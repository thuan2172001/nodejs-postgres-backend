import { Sql } from '../database';
import { Series } from '../models/serie';

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
        type: DataTypes.FLOAT,
    },
    likeInit: {
        type: DataTypes.INTEGER,
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

Series.hasMany(Episodes, { foreignKey: 'serieId' })

Episodes.belongsTo(Series, {
    foreignKey: 'serieId',
    onDelete: "CASCADE",
    as: "createdBy",
})

module.exports.Episodes = Episodes;