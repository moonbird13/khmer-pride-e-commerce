
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Users = sequelize.define('User', {
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
    field: "username",
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  phone:{
    type: DataTypes.STRING,
    allowNull: false,
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

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createAt: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    field: "create_at",
  }
}, {
  tableName: 'Users',
  timestamps: false,
});

export default User;