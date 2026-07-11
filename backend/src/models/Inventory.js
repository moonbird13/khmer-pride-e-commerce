import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


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


export default Inventory;