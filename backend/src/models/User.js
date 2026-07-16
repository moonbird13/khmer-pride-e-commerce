
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: "user_ID",
  },
  avatarUrl: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'default-avatar.png',
    field: "avatar_url",
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "full_name",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  phone:{
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(
      'guest', 
      'customer',
      'staff', 
      'admin'),
    defaultValue: 'customer',
  },
   userStatus: {
      type: DataTypes.ENUM(
        'Active',
        'Inactive',
        'Frozen'
     ),
     defaultValue: 'Active',
     field: "user_status",
  },
  createAt: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    field: "create_at",
  }
}, {
  tableName: 'Users',
  timestamps: false,
  indexes: [ { fields: ['role'] } ]
});

export default User;