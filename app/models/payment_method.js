import { Users } from '../models/user';
import { Sql } from '../database';

const { DataTypes } = require('sequelize');

const PaymentMethods = Sql.define('payment_methods', {
    nameOnCard: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    card: {
        type: DataTypes.JSON,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    futureUsage: {
        type: DataTypes.BOOLEAN,
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

PaymentMethods.belongsTo(Users, {
    foreignKey: 'userId',
    onDelete: "CASCADE",
    as: "createdBy",
})

module.exports.PaymentMethods = PaymentMethods;