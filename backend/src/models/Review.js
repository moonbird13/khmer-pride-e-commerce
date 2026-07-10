const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Review = sequelize.define('Review', {
    reviewId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: 'review_ID'
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        },
        field: 'rating'
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'comments'
    },
    createAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'create_at'
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
    }
}, {
    tableName: 'Reviews',
    timestamps: false
});


module.exports = Review;