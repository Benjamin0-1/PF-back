const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Shipping = sequelize.define('Shipping', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // en vez de utilizar ID, los usuarios tambien pueden asignarle un nombre (ejemplo: Trabajo, Casa, etc)
    // a una de sus ubicaciones, haciendolo mas facil para ellos de recordar.
    nickname: {
        type: DataTypes.STRING,
        allowNull: true,    // <-------
       // unique: true          <-- ?
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
    },
    shippingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // Assuming shippingId is intended to be the primary key
        autoIncrement: true // Assuming shippingId is intended to be auto-generated
    }


});

module.exports = Shipping;


// if we delete a user, then its shipping details should all be gone. (use a hook)