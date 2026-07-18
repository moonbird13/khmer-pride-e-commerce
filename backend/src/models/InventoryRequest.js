import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// A staff request to change stock after physical warehouse restocking.
const InventoryRequest = sequelize.define('InventoryRequest', {
  inventoryRequestId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'inventory_request_ID' },
  productId: { type: DataTypes.INTEGER, allowNull: false, field: 'product_ID' },
  staffId: { type: DataTypes.INTEGER, allowNull: false, field: 'staff_ID' },
  currentStock: { type: DataTypes.INTEGER, allowNull: false, field: 'current_stock' },
  requestedStock: { type: DataTypes.INTEGER, allowNull: false, field: 'requested_stock' },
  reason: { type: DataTypes.TEXT, allowNull: false, field: 'reason' },
  status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), allowNull: false, defaultValue: 'Pending', field: 'status' },
  reviewedBy: { type: DataTypes.INTEGER, allowNull: true, field: 'reviewed_by' },
  reviewNote: { type: DataTypes.TEXT, allowNull: true, field: 'review_note' },
  requestedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'requested_at' },
  reviewedAt: { type: DataTypes.DATE, allowNull: true, field: 'reviewed_at' },
}, {
  tableName: 'InventoryRequest',
  timestamps: false,
  indexes: [{ fields: ['product_ID'] }, { fields: ['staff_ID'] }, { fields: ['reviewed_by'] }, { fields: ['status'] }],
});

export default InventoryRequest;
