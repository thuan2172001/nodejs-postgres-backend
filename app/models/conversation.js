import { Sql } from '../database';

const { DataTypes } = require('sequelize');

const Conversations = Sql.define('conversations', {
    conversationId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
    },
    sender: {
        type: DataTypes.STRING,
    },
    receiver: {
        type: DataTypes.STRING,
    },
    messages: {
        type: DataTypes.JSON,
        defaultValue: "[]"
    }
}, {
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
});

module.exports.Conversations = Conversations;