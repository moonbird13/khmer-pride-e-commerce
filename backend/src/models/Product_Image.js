import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const Product_Image = sequelize.define("Product_Image", {
    imageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "image_ID"
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "product_ID"
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "image_url"
    },
    isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: "is_primary"
    }

}, {
    tableName: "Product_Images",
    timestamps: false,
    indexes: [{ fields: ['product_ID'] }]
});

export default Product_Image;