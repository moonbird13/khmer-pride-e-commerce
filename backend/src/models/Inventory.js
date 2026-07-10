const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");


const Inventory = sequelize.define("Inventory", {
    inventoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "inventory_ID"
    },
    stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "stock_quantity"
    },
    lastUpdated: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "last_update"
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "product_ID",
        foreignKey: true,
    }
}, {
    tableName: "Inventory",
    timestamps: false
});


module.exports = Inventory;