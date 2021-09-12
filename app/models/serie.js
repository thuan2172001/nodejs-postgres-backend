import { Sql } from '../database';

const { DataTypes } = require('sequelize');

const Series = Sql.define('series', {
    serieId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    serieName: {
        type: DataTypes.STRING,
    },
    categoryId: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
    thumbnail: {
        type: DataTypes.STRING,
    },
    cover: {
        type: DataTypes.STRING,
    },
    isPublished: {
        type: DataTypes.BOOLEAN,
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

module.exports.Series = Series;