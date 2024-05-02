// this table won't have any relationship with the already existing tables.
// it will only store emails coming fromt the Newsletter component.
const { DataTypes, literal } = require('sequelize');
const sequelize = require('../db');

const Newsletter = sequelize.define('Newsletter', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});



module.exports = Newsletter;




