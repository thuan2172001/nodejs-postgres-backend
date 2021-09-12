import { Sql } from '../database';

const { DataTypes } = require('sequelize');

const Episodes = Sql.define('episodes', {
    episodeId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
    chapter: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
    },
    key: {
        type: DataTypes.STRING,
    },
    pageNumber: {
        type: DataTypes.INTEGER,
    },
    description: {
        type: DataTypes.STRING,
    },
    serieId: {
        type: DataTypes.UUID,
    },
    thumbnail: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.STRING,
    },
    timeFirstPublished: {
        type: DataTypes.STRING,
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

// Episodes.sync({ force: true }).then(() => {
//     generateEpisode().then(data => {
//         return Episodes.bulkCreate(data);
//     }).catch(err => console.log(err))
// });

module.exports.Episodes = Episodes;