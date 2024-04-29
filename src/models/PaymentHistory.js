const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Shipping = require('./Shipping'); // Import the Shipping model
const User = require('./User');
const Order = require('./Order');

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
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE'
    }
});



PaymentHistory.beforeDestroy(async (paymentHistory, options) => {
    try {
        // Add deletion logic for associated records here
        // For example, you can delete related Shipping records
        // await Shipping.destroy({ where: { orderId: paymentHistory.orderId } });
        
        // Delete associated Order records
        await Order.destroy({ where: { userId: paymentHistory.userId } });
        
        // Delete associated PaymentHistory records
        await PaymentHistory.destroy({ where: { userId: paymentHistory.userId } });
        
        // Add deletion logic for other associated records as needed
        // For example, you can delete related Shipping records
        
    } catch (error) {
        console.error('Error deleting related records:', error);
        throw error;
    }
});



module.exports = PaymentHistory;
