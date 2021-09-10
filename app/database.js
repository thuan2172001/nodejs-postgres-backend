import {
    PG_URL,
    PG_PORT,
    PG_USER,
    PG_PASS,
    PG_DB,
} from './environment';

const Sequelize = require('sequelize');

export const Sql = new Sequelize(`postgres://${PG_USER}:${PG_PASS}@${PG_URL}:${PG_PORT}/${PG_DB}`);