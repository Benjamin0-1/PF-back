const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const PaymentHistory = require('./PaymentHistory');
const Shipping = require('./Shipping');
const Order = require('./Order');

const User = sequelize.define('User', {
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true // <-- PARA QUE FUNCIONE CON GOOGLE
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    // propiedad/column para activar/desactivar 2FA (para activarla is_admin debe ser TRUE).
    two_factor_authentication: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    // aqui deberia ir una column de secret para autenticar al usuario con su otp y que siempre utilize el mismo secreto,
    // y que este este guardado en el servidor y no tenga que ser enviado con la solicitud (POST).
    otp_secret: {
        type: DataTypes.STRING,
        unique: true
    },
    
    password_reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    password_reset_token_expires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // para almecenar a los usuarios de Google.
    
    google_id: {
        type: DataTypes.STRING,
        allowNull: true, // PUEDE SER NULL PARA USUARIOS LOCALES.
        unique: true 
    },

    banned: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    
    ban_expiration: {
        type: DataTypes.DATE,
        allowNull: true
    }
});


// FALTA PROBAR ESTO.
User.beforeDestroy(async (user, options) => {
    try {
        // Delete associated orders
        await Order.destroy({ where: { userId: user.id } });
        // Continue deleting associated records (PaymentHistory, Shipping, etc.)
        await PaymentHistory.destroy({ where: { userId: user.id } });
        await Shipping.destroy({ where: { userId: user.id } });
        // Add more deletion logic for other associated records if needed
        
    } catch (error) {
        console.error('Error deleting associated records:', error);
        throw error; // Rethrow the error to prevent deletion if there's an issue
    }
});

// <-- FALTA: EN CASO DE QUE UN USUARIO SEA ELIMINADO, TAMBIEN DEBE ELIMINAR SU
// SHIPPING, PAYMENTHISTORY, ORDER.

module.exports = User;

// add email field.
// name is: username.
