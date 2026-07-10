const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const Address = sequelize.define("Address", {
    addressId: {
       type: DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true,
       field: "address_ID",    
    },
    street: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    houseNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "house",
    },
    commune: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    district: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    province: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_ID", 
    }
}, {
    tableName: "Address",
    timestamps: false,
});

module.exports = Address;