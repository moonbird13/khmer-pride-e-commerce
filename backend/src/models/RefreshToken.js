import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const RefreshToken = sequelize.define('RefreshToken', {

    refreshTokenId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'refresh_token_ID'
    },

    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'token'
    },

    isRevoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'isrevoked'
    },
    revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'revokedAt'
    },

    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
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
    tableName: 'Refresh_Tokens',
    timestamps: false,
    indexes: [
        { unique: true, fields: ['userId'] }
    ]
});


export default RefreshToken;