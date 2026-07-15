import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define("Product", {
    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "product_ID"
    },
    productName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "product_name"
    },
    productDescription: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "description"
    },
    productPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "price"
    },
    createAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "create_date"
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "category_ID"
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "slug"
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "isfeatured"
    },
    isBestSeller: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "isbestseller"
    },
    isNewArrival: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "isnewarrival"
    },
    salesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "sales_count"
    }
}, {
    tableName: "Product",
    timestamps: false,
    indexes: [
        { fields: ['categoryId'] },
        { unique: true, fields: ['slug'] }
    ]
});

export default Product;