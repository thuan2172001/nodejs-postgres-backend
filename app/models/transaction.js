import { Users } from '../models/user';
import { Sql } from '../database';

const { DataTypes } = require('sequelize');

const Transactions = Sql.define('transactions', {
    transactionId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
    },
    paymentId: {
        type: DataTypes.STRING,
    },
    // card: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
    value: {
        type: DataTypes.FLOAT,
    },
    items: {
        type: DataTypes.ARRAY(DataTypes.UUID),
    },
    bought_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

Transactions.belongsTo(Users, {
    foreignKey: 'userId',
    onDelete: "CASCADE",
    as: "createdBy",
})

module.exports.Transactions = Transactions;