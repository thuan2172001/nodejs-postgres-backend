import { Sql } from '../database';
import { Users } from '../models/user';

const { DataTypes } = require('sequelize');

const Bookshelves = Sql.define('bookshelves', {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    bookshelfItems: {
        type: DataTypes.ARRAY(DataTypes.UUID),
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

module.exports.Bookshelves = Bookshelves;