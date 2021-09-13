import express from 'express';
import { seed } from './seed-data/seed';
import path from 'path';
import {
	API_PREFIX,
	NODE_ENV,
	PROJECT_NAME,
	SERVER_PORT,
	PG_URL,
	PG_PORT,
	PG_USER,
	PG_PASS,
	PG_DB,
} from './environment';
import { generateEpisodeData } from './seed-data/data/auto-generator';

const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();
const server = require('http').Server(app);
const fs = require('fs');
const Sequelize = require('sequelize');

module.exports = () => {
	console.log('Bootstrap starting time', new Date());

	let url = `postgres://${PG_USER}:${PG_PASS}@${PG_URL}:${PG_PORT}/${PG_DB}`

	// generateEpisodeData().then(() => console.log(1));

	console.log({ url });

	const Sql = new Sequelize(url);

	const errMes = {};

	if (!fs.existsSync('uploads')) {
		fs.mkdirSync('uploads');
	}

	const dbConnect = () => Sql
		.authenticate()
		.then(() => {
			console.log('Connection has been established successfully.');
		})
		.catch(err => {
			console.error('Unable to connect to the database:', err);
		});

	seed().then(() => console.log('Seed success !')).catch(err => console.log(err));

	const initApi = () => {
		if (NODE_ENV !== 'production') {
			app.use(morgan('dev'));
		} else app.use(morgan('combined'));
		app.use(cors());
		app.use(bodyParser.json({ limit: '50mb' }));
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(cookieParser());
		app.use(API_PREFIX, require('./api'));
		app.use('/mobile/build', express.static(`${__dirname}/../mobile/build`));
		app.use('/uploads', express.static(`${__dirname}/../uploads`));
		app.use(express.static(`${__dirname}/../deploy/build`));
		app.get('*', (req, res) => {
			res.sendFile(path.join(__dirname, '../deploy/build', 'index.html'));
		});
		app.use((err, req, res, next) => {
			res.json({ error: errMes.e ?? 'DO_YOU_LIKE_SCHOOL?' });
		});
		console.log('Bootstrap ending time', new Date());
	};
	return Promise.all([dbConnect(), initApi()])
		.then((e) => {
			server.setTimeout(7200000);
			server.listen(SERVER_PORT, (err) => {
				if (err) throw err;
				console.log(`${PROJECT_NAME} server is listening on port ${SERVER_PORT}`);
				console.log(new Date());
			});
		})
		.catch((err) => {
			console.log('Something wrong!', err);
			process.exit(1)
		});
};

module.exports.server = server;
