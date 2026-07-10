const sequelize = require('../config/database');

const User = require('./User');
const Address = require('./Address');
const Category = require('./Category');
const Product = require('./Product');
const Cart = require('./Cart');
const Cart_Item = require('./Cart_Item');
const Order = require('./Order');
const Order_detail = require('./Order_detail');
const Payment = require('./Payment');
const Delivery = require('./Delivery');
const Review = require('./Review');
const Favorite = require('./Favorite');
const Product_Image = require('./Product_Image');
const Inventory = require('./Inventory');


const db = {
    sequelize,
    User,
    Address,
    Category,
    Product,
    Cart,
    Cart_Item,
    Order,
    Order_detail,
    Payment,
    Delivery,
    Review,
    Favorite,
    Product_Image,
    Inventory
};

// Define associations

// ------------------------------ USER RELATIONSHIPS  ----------------------------------
// One User has many Addresses
User.hasMany(Address, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Address.belongsTo(User, {
    foreignKey: 'userId'
});


// One User has one Cart
User.hasOne(Cart, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Cart.belongsTo(User, {
    foreignKey: 'userId'
});


// One User has many Orders
User.hasMany(Order, {
    foreignKey: 'userId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Order.belongsTo(User, {
    foreignKey: 'userId'
});


// One User has many Reviews
User.hasMany(Review, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Review.belongsTo(User, {
    foreignKey: 'userId'
});


// One User has many Favorites
User.hasMany(Favorite, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Favorite.belongsTo(User, {
    foreignKey: 'userId'
});



//-------------------------------------- CATEGORY RELATIONSHIPS -------------------------------
// One Category has many Products
Category.hasMany(Product, {
    foreignKey: 'categoryId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Product.belongsTo(Category, {
    foreignKey: 'categoryId'
});


//-------------------------------------- PRODUCT RELATIONSHIPS -----------------------------
// One Product has many Images
Product.hasMany(Product_Image, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Product_Image.belongsTo(Product, {
    foreignKey: 'productId'
});


// One Product has one Inventory
Product.hasOne(Inventory, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Inventory.belongsTo(Product, {
    foreignKey: 'productId'
});


// One Product has many Cart Items
Product.hasMany(Cart_Item, {
    foreignKey: 'productId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Cart_Item.belongsTo(Product, {
    foreignKey: 'productId'
});


// One Product has many Order Details
Product.hasMany(Order_detail, {
    foreignKey: 'productId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Order_detail.belongsTo(Product, {
    foreignKey: 'productId'
});


// One Product has many Reviews
Product.hasMany(Review, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Review.belongsTo(Product, {
    foreignKey: 'productId'
});


// One Product has many Favorites
Product.hasMany(Favorite, {
    foreignKey: 'productId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Favorite.belongsTo(Product, {
    foreignKey: 'productId'
});


//-------------------------------------- CART RELATIONSHIPS --------------------------------------
// One Cart has many Cart Items
Cart.hasMany(Cart_Item, {
    foreignKey: 'cartId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Cart_Item.belongsTo(Cart, {
    foreignKey: 'cartId'
});



// ----------------------------------ORDER RELATIONSHIPS -------------------------------------
// One Order has many Order Details
Order.hasMany(Order_detail, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Order_detail.belongsTo(Order, {
    foreignKey: 'orderId'
});


// One Order has one Payment
Order.hasOne(Payment, {
    foreignKey: 'orderId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Payment.belongsTo(Order, {
    foreignKey: 'orderId'
});


// One Order has one Delivery
Order.hasOne(Delivery, {
    foreignKey: 'orderId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Delivery.belongsTo(Order, {
    foreignKey: 'orderId'
});


module.exports = db;