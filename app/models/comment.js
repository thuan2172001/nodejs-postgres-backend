import { Sql } from '../database';
import { Series } from './serie';
import { Episodes } from './episode';

const { DataTypes } = require('sequelize');

const Comments = Sql.define('comments', {
    commentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
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
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

Comments.belongsTo(Episodes, {
    foreignKey: 'episodeId',
    onDelete: "CASCADE",
    as: "createdBy",
})

Episodes.hasMany(Comments, { foreignKey: 'episodeId' })
Series.hasMany(Comments, { foreignKey: 'serieId' })

module.exports.Comments = Comments;