
/*

const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const ShippingHistory = sequelize.define('ShippingHistory', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shippingId: { // this references the SHipping table
        type: DataTypes.INTEGER,
        allowNull: false
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
        type: DataTypes.STRING,
        allowNull: false
    }
});

// la idea  de esta tabla es guardar la direccion de envio 
// al momento de realizar una compra.
// si es que el usuario cambia su direccion de envio, entonces todas sus compras 
// que fueron adquiridas cuando la direccion de envio era distinta, deberia mantenersa
// tal cual como estaba al visitar /payment-history.

//Shipping.hasMany(ShippingHistory, { foreignKey: 'shippingId' });
// luego esto debe mostrarse de manera correcta en /payment-history.

module.exports = ShippingHistory;


*/