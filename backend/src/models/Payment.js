import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';



const Payment = sequelize.define('Payment', {
    paymentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'payment_ID'
    },
    paymentMethod: {
        type: DataTypes.ENUM(
            'Credit Card',
            'ABA',
            'ACLEDA',
            'Wing',
            'cashOnDelivery'
        ),
        allowNull: false,
        field: 'payment_method'
    },
    paymentStatus: {
        type: DataTypes.ENUM(
            'Pending',
            'Completed',
            'Failed',
            'Refunded'
        ),
        allowNull: false,
        defaultValue: 'Pending',
        field: 'payment_status'
    },
    paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,   
        field: 'payment_date'
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        },
        field: 'amount'
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'order_ID'
    }    
        
}, {
    tableName: 'Payment',
    timestamps: false
});

export default Payment;