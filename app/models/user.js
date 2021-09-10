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
        defaultValue: false,
    },
    password: {
        type: DataTypes.STRING,
        defaultValue: false,
    },
    email: {
        type: DataTypes.STRING,
        defaultValue: false,
    },
    fullName: {
        type: DataTypes.STRING,
        defaultValue: false,
    },
    publicKey: {
        type: DataTypes.STRING,
        defaultValue: false,
    },
    encryptedPrivateKey: {
        type: DataTypes.STRING,
        defaultValue: false,
    },
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

Users.sync({ force: true }).then(() => {
    generateUser().then(data => {
        console.log({ data })
        return Users.bulkCreate(data);
    })
});

module.exports.Users = Users;