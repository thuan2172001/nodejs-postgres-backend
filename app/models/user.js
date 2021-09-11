import { Sql } from '../database';
import { generateUser } from '../seed-data/user';

const { DataTypes } = require('sequelize');

const Users = Sql.define('users', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    fullName: {
        type: DataTypes.STRING,
    },
    publicKey: {
        type: DataTypes.STRING,
    },
    encryptedPrivateKey: {
        type: DataTypes.STRING,
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

Users.sync({ force: true }).then(() => {
    generateUser().then(data => {
        return Users.bulkCreate(data);
    })
});

module.exports.Users = Users;