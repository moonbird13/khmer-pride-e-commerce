import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const Favorite = sequelize.define('Favorite', {
    favoriteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'favorite_ID'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_ID'
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'product_ID'
    },
    createDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'create_date'
    }
}, {
    tableName: 'Favorites',
    timestamps: false
});


export default Favorite;