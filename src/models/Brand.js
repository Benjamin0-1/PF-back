const { DataTypes, literal } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product');

const Brand = sequelize.define('Brand', {
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: 'HenryBrand'
    }
});

Brand.associate = (models) => {
    Brand.hasMany(Product, { foreignKey: 'brandId' });
};


module.exports = Brand;
