import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';



const Order_Detail = sequelize.define('Order_detail', {
    orderDetailId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,    
        primaryKey: true,
        field: 'order_detail_ID'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        },
        field: 'quantity'
    },
    unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        },
        field: 'unit_price'
    },
    subTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        },
        field: 'subtotal'
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        },
        field: 'order_ID'
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_ID'
    }
}, {
    tableName: 'Order_detail',
    timestamps: false
});

export default Order_Detail;