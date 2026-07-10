const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');



const Cart_Item = sequelize.define('Cart_Item', {
    cartItemId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'cart_item_ID'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'quantity'
    },
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cart_ID'
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_ID'
    }
}, {
    tableName: 'Cart_Item',
    timestamps: false
});

module.exports = Cart_Item;