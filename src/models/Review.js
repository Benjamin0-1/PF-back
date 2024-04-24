const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); // <-- to see which user a review belongs to.
const Product = require('./Product'); // <-- to see which product is being reviewed.

const Review = sequelize.define('Review', {
    productId: {  // <-- para asociar review a producto.
        type: DataTypes.INTEGER,
        allowNull: false
    },

    userId: { // <-- para asociar a usuario especifico el cual escribio la review.
        type: DataTypes.INTEGER,
        allowNull: false
    },
    reviewDate: { // <-- fecha de cuando la review fue escrita.
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    review: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // rating, luego en las rutas se agregara logica para que sea entre 1 y 5, debe ser un float.
  //  rating: {
   //     type: DataTypes.FLOAT,
   //     allowNull: true
   // }
});

// associations.js 
/*
Review.associate = (models) => {
    Review.belongsToMany(models.Product, {through: 'ProductReview'})
}
*/

// one to many with user
// many to many with Product.


module.exports = Review;
