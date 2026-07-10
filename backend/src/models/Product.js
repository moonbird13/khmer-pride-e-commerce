const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

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
    }
}, {
    tableName: "Product",
    timestamps: false
});

module.exports = Product;