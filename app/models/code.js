import { Sql } from '../database';
import { Users } from './user';

const { DataTypes } = require('sequelize');

const Codes = Sql.define('codes', {
    codeId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

module.exports.Codes = Codes;