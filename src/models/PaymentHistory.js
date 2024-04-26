const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Shipping = require('./Shipping'); // Import the Shipping model

const PaymentHistory = sequelize.define('PaymentHistory', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    purchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW 
    },
    total_transaction_amount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    shippingId: {
        type: DataTypes.INTEGER
    }
});

module.exports = PaymentHistory;
