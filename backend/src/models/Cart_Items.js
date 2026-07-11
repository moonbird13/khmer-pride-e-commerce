import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';



const Cart_Items = sequelize.define('Cart_Items', {
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
    tableName: 'Cart_Items',
    timestamps: false
});

export default Cart_Items;