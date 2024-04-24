/*

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product'); // to see the price associated to a certain product and query efficiently.

const Price = sequelize.define('Price', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    currency: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'USD'
    }
});


//relations here.

Price.associate = (models) => {
    Price.belongsTo(models.Product, {foreignKey: 'productId'})
}

module.exports = Price;
*/