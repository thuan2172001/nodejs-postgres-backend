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
        type: DataTypes.TEXT,
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
    likeInit: {
        type: DataTypes.INTEGER,
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

module.exports.Episodes = Episodes;