const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Product = require('./Product'); 

const Category = sequelize.define('Category', {
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, 
{
    timestamps: true,
   // createdAt: 'createdAt',
    //updatedAt: 'updatedAt'
});


Category.associate = (models) => {
    Category.belongsToMany(models.Product, { through: 'ProductCategory' }); 
};

module.exports = Category;
