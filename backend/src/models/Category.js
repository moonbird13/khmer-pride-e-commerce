const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");


const Category = sequelize.define("Category", {
    categoryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        field: "category_ID"
    },
    categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "category_name",
    },
    categoryStatus: {
        type: DataTypes.ENUM(
            'Active',
            'Inactive'
        ),
        allowNull: false,
        defaultValue: 'Active',
        field: "status"
    }
}, {
    tableName: "Category",
    timestamps: false
});

module.exports = Category;