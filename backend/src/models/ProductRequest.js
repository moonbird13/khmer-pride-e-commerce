import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Staff submits this model when asking an admin to add or delete a product.
const ProductRequest = sequelize.define('ProductRequest', {
  productRequestId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, field: 'product_request_ID' },
  requestType: { type: DataTypes.ENUM('Create', 'Delete'), allowNull: false, field: 'request_type' },
  productId: { type: DataTypes.INTEGER, allowNull: true, field: 'product_ID' },
  categoryId: { type: DataTypes.INTEGER, allowNull: true, field: 'category_ID' },
  staffId: { type: DataTypes.INTEGER, allowNull: false, field: 'staff_ID' },
  productName: { type: DataTypes.STRING, allowNull: true, field: 'product_name' },
  productDescription: { type: DataTypes.TEXT, allowNull: true, field: 'description' },
  productPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'price' },
  initialStock: { type: DataTypes.INTEGER, allowNull: true, field: 'initial_stock' },
  imageUrl: { type: DataTypes.STRING(255), allowNull: true, field: 'image_url' },
  reason: { type: DataTypes.TEXT, allowNull: false, field: 'reason' },
  status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), allowNull: false, defaultValue: 'Pending', field: 'status' },
  reviewedBy: { type: DataTypes.INTEGER, allowNull: true, field: 'reviewed_by' },
  reviewNote: { type: DataTypes.TEXT, allowNull: true, field: 'review_note' },
  requestedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'requested_at' },
  reviewedAt: { type: DataTypes.DATE, allowNull: true, field: 'reviewed_at' },
}, {
  tableName: 'ProductRequest',
  timestamps: false,
  indexes: [{ fields: ['product_ID'] }, { fields: ['category_ID'] }, { fields: ['staff_ID'] }, { fields: ['reviewed_by'] }, { fields: ['status'] }],
});

export default ProductRequest;
