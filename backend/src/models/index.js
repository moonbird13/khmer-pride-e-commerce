import sequelize from '../config/database.js';

import User from './User.js';
import Address from './Address.js';
import Category from './Category.js';
import Product from './Product.js';
import Cart from './Cart.js';   
import Cart_Item from './Cart_Item.js';
import Order from './Order.js';
import Order_detail from './Order_detail.js';
// Payment and Delivery models removed; not required for tests
import Review from './Review.js';
import Favorite from './Favorite.js';
import Product_Image from './Product_Image.js';
import Inventory from './Inventory.js';
import RefreshToken from './RefreshToken.js';
import EmailVerificationToken from './EmailVerificationToken.js';
import PasswordResetToken from './PasswordResetToken.js';



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


//one User has many RefreshTokens
User.hasMany(RefreshToken, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
RefreshToken.belongsTo(User, {
    foreignKey: 'userId'
});


//one user has many EmailVerificationTokens
User.hasMany(EmailVerificationToken, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
EmailVerificationToken.belongsTo(User, {
    foreignKey: 'userId'
});


//one User has many passwordResetTokens
User.hasMany(PasswordResetToken, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

PasswordResetToken.belongsTo(User, {
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


// Payment and Delivery associations removed (tests deleted these models)


export default db;