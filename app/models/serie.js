import { Sql } from '../database';
import { Categories } from './category';

const { DataTypes } = require('sequelize');

const Series = Sql.define('series', {
    serieId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
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
Categories.hasMany(Series, { foreignKey: 'categoryId' })

Series.belongsTo(Categories, {
    foreignKey: 'categoryId',
    onDelete: "CASCADE",
    as: "createdBy",
})
module.exports.Series = Series;