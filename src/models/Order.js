const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); 
const Product = require('./Product'); 

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    order_date: {
        type: DataTypes.DATEONLY, // this is meant to happen automatically
        defaultValue: Sequelize.NOW() // get the exact time the order went through
    },
    
    userId: {
        type: DataTypes.INTEGER, // <- foreign key referencing User.
        allowNull: false
    },

    totalAmount: {
        type: DataTypes.FLOAT, // <-- total amount from all products in the cart.
        allowNull: false 
    },

    paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: 'unpaid'
    }
});


Order.associate = (models) => {
    Order.belongsTo(models.User, {foreignKey: 'UserId'}) // add belongsToMany Product
}


module.exports = Order;
