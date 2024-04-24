const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const BannedToken = sequelize.define('BannedToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

module.exports = BannedToken;

