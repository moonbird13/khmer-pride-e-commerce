import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const Cart = sequelize.define('Cart', {
    cartId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'cart_ID'
    },
    createdAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'create_at'
    },
    updatedAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'update_at'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_ID'
    }
}
, {
    tableName: 'Cart',
    timestamps: false,
    indexes: [
        { fields: ['userId'] }
    ]
});

export default Cart;