import * as userRepository from '../repositories/user.repository.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import db from '../models/index.js';

const ALLOWED_ROLES = ['guest', 'customer', 'staff', 'admin'];
const ALLOWED_STATUSES = ['Active', 'Inactive', 'Frozen'];
const serializeUser = (user) => ({
  id: user.userId,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  userStatus: user.userStatus,
  avatarUrl: user.avatarUrl,
  createAt: user.createAt,
});

const confirmAdminPassword = async (req) => {
  const adminId = req.user?.id ?? req.user?.userId;
  const admin = await userRepository.findUserById(adminId);
  const matches = admin && req.body?.adminPassword && await bcrypt.compare(String(req.body.adminPassword), admin.password);
  if (!matches) {
    const error = new Error('Admin password confirmation is incorrect.');
    error.status = 403;
    throw error;
  }
};

const listUsersHandler = async (req, res) => {
  try {
    const { role, status } = req.query;
    let users = await userRepository.findAllUsers();

    if (role) {
      users = users.filter((user) => String(user.role).toLowerCase() === String(role).toLowerCase());
    }

    if (status) {
      users = users.filter((user) => String(user.userStatus).toLowerCase() === String(status).toLowerCase());
    }

    return res.json(users.map(serializeUser));
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load users.' });
  }
};

const dashboardHandler = async (_req, res) => {
  try {
    const [totalOrders, totalCustomers, totalStaff, pendingProductRequests, pendingInventoryRequests, lowStockProducts, revenue, orders, productRequests, inventoryRequests] = await Promise.all([
      db.Order.count(),
      db.User.count({ where: { role: 'customer' } }),
      db.User.count({ where: { role: 'staff' } }),
      db.ProductRequest.count({ where: { status: 'Pending' } }),
      db.InventoryRequest.count({ where: { status: 'Pending' } }),
      db.Inventory.count({ where: { stockQuantity: { [Op.lte]: 20 } } }),
      db.Order.sum('totalAmount', { where: { orderStatus: { [Op.ne]: 'Cancelled' } } }),
      db.Order.findAll({ order: [['orderDate', 'DESC']], limit: 5 }),
      db.ProductRequest.findAll({ order: [['requestedAt', 'DESC']], limit: 5 }),
      db.InventoryRequest.findAll({ order: [['requestedAt', 'DESC']], limit: 5 }),
    ]);

    const activities = [
      ...orders.map((order) => ({ type: 'Order', title: `Order #${order.orderId} was placed`, status: order.orderStatus, at: order.orderDate })),
      ...productRequests.map((request) => ({ type: 'Product request', title: `${request.requestType} product request submitted`, status: request.status, at: request.requestedAt })),
      ...inventoryRequests.map((request) => ({ type: 'Inventory request', title: 'Inventory request submitted', status: request.status, at: request.requestedAt })),
    ].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 8);

    return res.json({
      totalRevenue: Number(revenue || 0), totalOrders, totalCustomers, totalStaff,
      pendingRequests: pendingProductRequests + pendingInventoryRequests,
      lowStockProducts, activities,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load dashboard analytics.' });
  }
};

const getUserByIdHandler = async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(serializeUser(user));
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load user.' });
  }
};

const updateUserHandler = async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await confirmAdminPassword(req);

    const updates = {};
    if (req.body.role) {
      const normalizedRole = String(req.body.role).trim();
      if (!ALLOWED_ROLES.includes(normalizedRole)) {
        return res.status(400).json({ message: 'Invalid role.' });
      }
      updates.role = normalizedRole;
    }

    if (req.body.userStatus) {
      const normalizedStatus = String(req.body.userStatus).trim();
      if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({ message: 'Invalid user status.' });
      }
      updates.userStatus = normalizedStatus;
    }

    for (const field of ['fullName', 'email', 'phone']) {
      if (req.body[field] !== undefined) updates[field] = String(req.body[field]).trim() || null;
    }

    if (req.body.newPassword) {
      if (String(req.body.newPassword).length < 8) {
        return res.status(400).json({ message: 'New password must be at least 8 characters.' });
      }
      updates.password = await bcrypt.hash(String(req.body.newPassword), 10);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid user updates provided.' });
    }

    await userRepository.updateUser(req.params.id, updates);
    const updatedUser = await userRepository.findUserById(req.params.id);
    return res.json(serializeUser(updatedUser));
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to update user.' });
  }
};

const deleteUserHandler = async (req, res) => {
    try {
    await confirmAdminPassword(req);
    const deletedRows = await userRepository.deleteUser(req.params.id);
    if (!deletedRows) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to delete user.' });
  }
};

export {
  listUsersHandler,
  dashboardHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
};
