const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Shipping = sequelize.define('Shipping', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },

    country: {
        type: DataTypes.STRING,
        allowNull: false
    },

    city: {
        type: DataTypes.STRING,
        allowNull: false
    },

    zip_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    
});

module.exports = Shipping;


// if we delete a user, then its shipping details should all be gone. (use a hook)