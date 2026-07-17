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
    // `isRevoked` column removed — use `revokedAt` (timestamp) to determine revocation state.
    revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        // DB column is named `revockedAt` in your schema (typo preserved for compatibility)
        field: 'revockedAt'
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
    timestamps: false
});


export default RefreshToken;