import { Sql } from '../database';

const { DataTypes } = require('sequelize');

const Categories = Sql.define('categories', {
    categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    categoryName: {
        type: DataTypes.STRING,
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

module.exports.Categories = Categories;