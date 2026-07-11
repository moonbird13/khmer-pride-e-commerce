import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';



const Deliveries = sequelize.define('Delivery', {
    deliveryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'delivery_ID'
    },
    deliveryStatus: {
        type: DataTypes.ENUM(
            'Preparing',
            'In Transit',
            'Out for Delivery',
            'Delivered',
            'Failed'
        ),
        allowNull: false,
        defaultValue: 'Preparing',
        field: 'delivery_status'
    },
    trackingCode: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'tracking_code'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'update_at'
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'create_at'
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_ID'
    }
}, {
    tableName: 'Delivery',
    timestamps: false
});

export default Deliveries;