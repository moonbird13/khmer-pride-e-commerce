import sequelize from '../config/database.js';

import Users from './Users.js';
import Address from './Address.js';
import Category from './Category.js';
import Product from './Product.js';
import Cart from './Cart.js';   
import Cart_Items from './Cart_Items.js';
import Orders from './Orders.js';
import Order_Detail from './Order_Detail.js';
import Payment from './Payment.js';
import Delivery from './Deliveries.js';
import Review from './Review.js';
import Favorite from './Favorite.js';
import Product_Image from './Product_Image.js';
import Inventory from './Inventory.js';
import RefreshToken from './RefreshToken.js';
import EmailVerificationToken from './EmailVerificationToken.js';
import PasswordResetToken from './PasswordResetToken.js';



const db = {
    sequelize,
    Users,
    Address,
    Category,
    Product,
    Cart,
    Cart_Items,
    Orders,
    Order_Detail,
    Payment,
    Delivery,
    Review,
    Favorite,
    Product_Image,
    Inventory,
    RefreshToken,
    EmailVerificationToken,
    PasswordResetToken
};

// Define associations

// ------------------------------ USER RELATIONSHIPS  ----------------------------------
// One User has many Addresses
Users.hasMany(Address, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Address.belongsTo(Users, {
    foreignKey: 'userId'
});


// One User has one Cart
Users.hasOne(Cart, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Cart.belongsTo(Users, {
    foreignKey: 'userId'
});


// One User has many Orders
Users.hasMany(Orders, {
    foreignKey: 'userId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Orders.belongsTo(Users, {
    foreignKey: 'userId'
});


// One User has many Reviews
Users.hasMany(Review, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Review.belongsTo(Users, {
    foreignKey: 'userId'
});


// One User has many Favorites
Users.hasMany(Favorite, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Favorite.belongsTo(Users, {
    foreignKey: 'userId'
});


//one User has many RefreshTokens
Users.hasMany(RefreshToken, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
RefreshToken.belongsTo(Users, {
    foreignKey: 'userId'
});


//one user has many EmailVerificationTokens
Users.hasMany(EmailVerificationToken, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
EmailVerificationToken.belongsTo(Users, {
    foreignKey: 'userId'
});


//one User has many passwordResetTokens
Users.hasMany(PasswordResetToken, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

PasswordResetToken.belongsTo(Users, {
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
Product.hasMany(Cart_Items, {
    foreignKey: 'productId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Cart_Items.belongsTo(Product, {
    foreignKey: 'productId'
});


// One Product has many Order Details
Product.hasMany(Order_Detail, {
    foreignKey: 'productId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Order_Detail.belongsTo(Product, {
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
Cart.hasMany(Cart_Items, {
    foreignKey: 'cartId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Cart_Items.belongsTo(Cart, {
    foreignKey: 'cartId'
});



// ----------------------------------ORDER RELATIONSHIPS -------------------------------------
// One Order has many Order Details
Orders.hasMany(Order_Detail, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Order_Detail.belongsTo(Orders, {
    foreignKey: 'orderId'
});


// One Order has one Payment
Orders.hasOne(Payment, {
    foreignKey: 'orderId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Payment.belongsTo(Orders, {
    foreignKey: 'orderId'
});


// One Order has one Delivery
Orders.hasOne(Delivery, {
    foreignKey: 'orderId',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

Delivery.belongsTo(Orders, {
    foreignKey: 'orderId'
});


export default db;