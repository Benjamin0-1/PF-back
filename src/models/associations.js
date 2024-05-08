

const sequelize = require('sequelize');
const Category = require('./Category');
const Product = require('./Product');
const User = require('./User');
const Brand = require('./Brand');
const Review = require('./Review');
const Favorite = require('./Favorite');
const PaymentHistory = require('./PaymentHistory');
const ReportedProduct = require('./ReportedProduct');
const Shipping = require('./Shipping');
const ShippingHistory = require('./ShippingHistory');
const Order = require('./Order');
const Cart = require('./Cart');   // CART
const ProductCart = require('./ProductCart');

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

// reported product con User y Product.
ReportedProduct.belongsTo(User, {foreignKey: 'userId'});
ReportedProduct.belongsTo(Product, {foreignKey: 'productId'});

//relacion entre User y Shipping. un usuario puede tener varias direcciones.
User.hasMany(Shipping, {foreignKey: 'userId'});
Shipping.belongsTo(User, {foreignKey: 'userId'});

// relacion entre: PaymentHistory y Shipping. 
PaymentHistory.belongsTo(Shipping, {foreignKey: 'shippingId'}); // onDelete: 'CASCADE';


// relacion de Order con los modelos: User, Product, PaymentHistory, Shipping.
Order.belongsTo(User, { foreignKey: 'userId' });

// un usuario puede tener varias ordenes pero cada orden pertenece a un usuario (one to many).

Order.belongsToMany(Product, { through: 'OrderProduct' });
Product.belongsToMany(Order, { through: 'OrderProduct', onDelete: 'CASCADE' });
// many to many entre Order y Product.

PaymentHistory.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(PaymentHistory, { foreignKey: 'orderId' });
// one to many. un historial de pago pertenece a una orden. 
// cada orden puede tener varias transacciones.

Order.belongsTo(Shipping, { foreignKey: 'shippingId' });
Shipping.hasMany(Order, { foreignKey: 'shippingId' });
// cada orden esta asociada a una shipping addr.
// cada shipping addr puede tener/estar asociada a multiples ordenes. 


// CART TABLE.
// Associations
Cart.belongsToMany(Product, {
    through: ProductCart,
    foreignKey: 'cartId',
    otherKey: 'productId'
});
Product.belongsToMany(Cart, {
    through: ProductCart,
    foreignKey: 'productId',
    otherKey: 'cartId'
});

ProductCart.belongsTo(Cart, { foreignKey: 'cartId' });
ProductCart.belongsTo(Product, { foreignKey: 'productId' });
Cart.hasMany(ProductCart, { foreignKey: 'cartId' });
Product.hasMany(ProductCart, { foreignKey: 'productId' });

// USER AND CART.
// Define relationships between models

// User and Cart
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// Ensure all other existing relationships are correct and maintained as you already have them set up


/*
// relacion entre ShippingHistory y Shipping.
//Shipping.hasMany(ShippingHistory, {foreignKey: 'shippingId'}); 

// relacion en shipping histories y users.
//ShippingHistory.belongsTo(User, { foreignKey: 'userId' });
//ShippingHistory.belongsTo(Shipping, { foreignKey: 'shippingId' });

*/


module.exports = {
    Category,
    Product,
    User,
    Brand,
    Review,
    Favorite,
    PaymentHistory,
    ReportedProduct,
    Shipping,
    ShippingHistory,
    Order
};
