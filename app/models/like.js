import { Sql } from '../database';

const { DataTypes } = require('sequelize');

const Likes = Sql.define('likes', {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    serieId: {
        type: DataTypes.UUID,
    },
    episodeId: {
        type: DataTypes.UUID,
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

module.exports.Likes = Likes;