const { DataTypes } = require('sequelize');
const sequelize = require('../db');



const ShippingHistory = new sequelize.define('ShippingHistory', {
    shippingId: { // this references the SHipping table
        type: DataTypes.INTEGER,
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