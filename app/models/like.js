import { Sql } from '../database';
import { Users } from '../models/user';
import { Series } from '../models/serie';
import { Episodes } from '../models/episode';

const { DataTypes } = require('sequelize');

const Likes = Sql.define('likes', {
    userId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    serieId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    episodeId: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

Likes.belongsTo(Episodes, {
    foreignKey: 'episodeId',
    onDelete: "CASCADE",
    as: "createdBy",
})

Episodes.hasMany(Likes, { foreignKey: 'episodeId' })
Series.hasMany(Likes, { foreignKey: 'serieId' })

module.exports.Likes = Likes;