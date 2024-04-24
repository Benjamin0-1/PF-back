const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product');

const Tag = sequelize.define('Tag', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

Tag.associate = (models) => {
    Product.belongsToMany(Tag, {through: 'ProductTag'});
    Tag.belongsToMany(Product, {through: 'ProductTag'});
}

module.exports = Tag;
