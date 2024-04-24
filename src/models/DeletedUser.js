const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');


const DeletedUser = sequelize.define('DeletedUser', {
    // is userId really necessary? if not, another user will take its place instead.
    // en caso de 'restaurar' un usuario eliminado, podemos mantener su userId.
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    // this should reference the username column in the user model.
    // relacion con User no es requerida.
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    // this references the email column in the User model.
    // relacion con User no es requerida.
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = DeletedUser;
