const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');



const Order = sequelize.define('Order', {
    orderId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,    
        primaryKey: true,
        field: 'order_ID'
    },
    orderDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'order_date'
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'total_amount'
    },
    orderStatus: {
        type: DataTypes.ENUM('Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
        allowNull: false,
        field: 'order_status'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_ID'
    },
    shippingHouseNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'shipping_house'
    },
    shippingStreet: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'shipping_street'
    },
    shippingCommune: {
        type: DataTypes.STRING, 
         allowNull: false,
        field: 'shipping_commune'
    },
    shippingDistrict: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'shipping_district'
    },
    shippingProvince: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'shipping_province'
    }
}, {
    tableName: 'Order',
    timestamps: false
});

module.exports = Order;