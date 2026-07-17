import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


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
        unique: true,
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
    timestamps: false,
    indexes: [
        {fields: ['status']}
    ]

});

export default Category;