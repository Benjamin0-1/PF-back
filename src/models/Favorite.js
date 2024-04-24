const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Product = require('./Product')

const Favorite = sequelize.define('Favorite', {
    userId: { // <-- a User can have many favorites, req.user.userId.
        type: DataTypes.INTEGER,
        allowNull: false // <-- a favorite product must belong to a user.
    },
    productId: { // <-- the key of the Product to be added
        type: DataTypes.INTEGER,
        allowNull: false 
    }
});


module.exports = Favorite;
