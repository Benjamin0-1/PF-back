const { DataTypes, literal, where } = require('sequelize');
const sequelize = require('../db');
const Category = require('./Category');
const Brand = require('./Brand');
const Review = require('./Review');
const Favorite = require('./Favorite');
const ReportedProduct = require('./ReportedProduct');
//const Rating = require('./Rating')

const Product = sequelize.define('Product', {
    brandId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    product: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true //<-- Cada nombre de producto debe ser unico, para poder buscar por nombre, etc. force: true en caso de error.
    }, 
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // rating fue eleminado ya que eso lo deciden los usuarios.
    attributes: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    salePrice: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    userId: {   // puede servir para ver que ADMIN creo cada producto.
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // link de imagen va en cloudinary.
    image: {
        type: DataTypes.STRING, // <-- revisar ruta POST /product y PUT /product
        allowNull: true,
        defaultValue: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGm5siy6WyzdMY2c_MmzhE8bSy8RZ4QqZ2rQ&s'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    updatedAt: 'updatedAt'
});

// associations.js
/*
Product.associate = (models) => {
    //Product.belongsTo(models.User, {foreignKey: 'userId'});
    Product.belongsTo(models.Brand, { foreignKey: 'brandId' }); 
    Product.belongsTo(Brand, {foreignKey: 'brandId'});
    Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
};
*/

// cuando se elimina un producto, su descripcion, reviews tambien deben irse

Product.beforeDestroy(async (product, option) => {
    try {
        await sequelize.models.Description.destroy({where: {productId: product.id}});
        await sequelize.models.Review.destroy({where: {productId: product.id}});
        await sequelize.models.Favorite.destroy({where: {productId: product.id}});
        await sequelize.models.ReportedProduct.destroy({where: {productId: product.id}})

    } catch (error) {
        console.log(`Error eliminando datos asociados: ${error}`);
    }
});

module.exports = Product;
