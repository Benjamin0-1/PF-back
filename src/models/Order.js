const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); 
const Product = require('./Product'); 
const PaymentHistory = require('./PaymentHistory');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    order_date: {
        type: DataTypes.DATEONLY, // automaticamente.
        defaultValue: Sequelize.NOW 
    },
    
    userId: {
        type: DataTypes.INTEGER, // <- foreign key referencing User.
        allowNull: false, // <-- a user can have many orders (one-to-many)
    },

    totalAmount: {
        type: DataTypes.FLOAT, // <-- total amount from all products in the cart.
        allowNull: false 
    },

    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // all statuses: pending, shipped, fullfiled.
    },
    shippingId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: 'userId' }); // Add association to User model
};


Order.beforeDestroy(async (order, options) => {
    try {
        await PaymentHistory.destroy({ where: { orderId: order.id } });
        
        await Order.destroy({ where: { userId: order.userId } }); // <-- debugging line.
        await Shipping.destroy({ where: { orderId: order.id } });

    } catch (error) {
        console.error('Error deleting related records:', error);
        throw error;
    }
});


module.exports = Order;
