const { DataTypes, literal, where } = require('sequelize');
const sequelize = require('../db');
const Cart = require('./Cart');
const Product = require('./Product');

const ProductCart = sequelize.define('ProductCart', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'ProductCarts'
});


module.exports = ProductCart;
