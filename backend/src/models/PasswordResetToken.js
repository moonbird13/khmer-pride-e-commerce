import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const PasswordResetToken = sequelize.define('PasswordResetToken', {

    resetTokenId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'reset_token_ID'
    },

    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'token'
    },

    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
    },

    isUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_used'
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_ID'
    }

}, {
    tableName: 'Password_Reset_Tokens',
    timestamps: false,
    indexes: [
        { unique: true, fields: ['user_ID'] }
    ]
});


export default PasswordResetToken;