const sequelize = require('sequelize');
const Category = require('./Category');
const Product = require('./Product');
const User = require('./User');
const Brand = require('./Brand');
const Review = require('./Review');
const Favorite = require('./Favorite');
const PaymentHistory = require('./PaymentHistory');

// Define associations for Category model
Product.belongsToMany(Category, { through: 'ProductCategory' });
Category.belongsToMany(Product, { through: 'ProductCategory' });

Product.belongsTo(Brand, {foreignKey: 'brandId'}); // <-- this fixed it.

// User y Reviews.
User.hasMany(Review, {foreignKey: 'userId'});
Review.belongsTo(User, {foreignKey: 'userId'});

//Product y Review many to many.
Review.belongsToMany(Product, { through: 'ProductReview' });
//Product.belongsToMany(Review, {through: 'ProductReview'})

Product.hasMany(Review, {foreignKey: 'productId'});

Product.associate = (models) => {
    Product.belongsTo(models.User, { foreignKey: 'userId' }); // Add this association for User model
    Product.belongsTo(models.Brand, { foreignKey: 'brandId' });
    Product.hasMany(models.Review, { foreignKey: 'productId' }); // Corrected association for Review model
};

// relacion entre Favorite con User y Product.
Favorite.belongsTo(User, {foreignKey: 'userId'});
Favorite.belongsTo(Product, {foreignKey: 'productId'});

// User y Product tienen MUCHOS Favorite.
User.hasMany(Favorite, {foreignKey: 'userId'});
Product.hasMany(Favorite, {foreignKey: 'productId'});

// relacion entre PaymentHistory con User y Product va aqui:
PaymentHistory.belongsTo(User, {foreignKey: 'userId'});

PaymentHistory.belongsToMany(Product, {through: 'ProductPayment'});
Product.belongsToMany(PaymentHistory, {through: 'ProductPayment'}); 



// Define associations for User model
//User.associate = (models) => {
//    User.hasMany(models.Product, { foreignKey: 'userId' }); // Add this association for Product model
//};

module.exports = {
    Category,
    Product,
    User,
    Brand,
    Review,
    Favorite
};

