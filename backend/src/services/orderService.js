import db from '../models/index.js';
import { createOrder as createMockOrder, getUserOrders, getOrderById as getMockOrderById } from '../data/mockData.js';

const { Order, Order_detail } = db;

const createOrder = async ({ userId, items, total, shippingAddress = 'N/A', shippingCity = 'N/A', paymentMethod = 'card' }) => {
  if (global.dbAvailable === false) {
    const order = createMockOrder(userId, {
      items,
      total: Number(total),
      shippingAddress,
      shippingCity,
      paymentMethod,
    });

    return {
      id: order.orderId,
      userId: order.userId,
      items: order.items,
      total: Number(order.totalAmount),
      status: order.orderStatus,
      createdAt: order.orderDate,
    };
  }

  const order = await Order.create({
    userId: Number(userId),
    orderDate: new Date(),
    totalAmount: Number(total),
    orderStatus: 'Pending',
    shippingHouseNumber: 'N/A',
    shippingStreet: shippingAddress || 'N/A',
    shippingCommune: 'N/A',
    shippingDistrict: shippingCity || 'N/A',
    shippingProvince: 'N/A',
  });

  await Promise.all(items.map((item) => Order_detail.create({
    orderId: order.orderId,
    productId: Number(item.productId),
    quantity: Number(item.quantity),
    unitPrice: Number(item.price || 0),
    subTotal: Number(item.price || 0) * Number(item.quantity),
  })));

  return {
    id: order.orderId,
    userId: order.userId,
    items,
    total: Number(order.totalAmount),
    status: order.orderStatus,
    createdAt: order.orderDate,
  };
};

const listOrders = async (userId = null) => {
  if (global.dbAvailable === false) {
    if (!userId) return [];
    const orders = getUserOrders(userId);
    return orders.map((order) => ({
      id: order.orderId,
      userId: order.userId,
      total: Number(order.totalAmount),
      status: order.orderStatus,
      createdAt: order.orderDate,
    }));
  }

  const where = userId ? { userId: Number(userId) } : {};
  const orders = await Order.findAll({ where, order: [['orderId', 'DESC']] });
  return orders.map((order) => ({
    id: order.orderId,
    userId: order.userId,
    total: Number(order.totalAmount),
    status: order.orderStatus,
    createdAt: order.orderDate,
  }));
};

const getOrderById = async (id) => {
  if (global.dbAvailable === false) {
    const order = getMockOrderById(id);
    if (!order) return null;
    return {
      id: order.orderId,
      userId: order.userId,
      items: order.items,
      total: Number(order.totalAmount),
      status: order.orderStatus,
      createdAt: order.orderDate,
    };
  }

  const order = await Order.findByPk(Number(id));
  if (!order) return null;
  return {
    id: order.orderId,
    userId: order.userId,
    total: Number(order.totalAmount),
    status: order.orderStatus,
    createdAt: order.orderDate,
  };
};

const getOrderHistory = async (userId) => {
  if (global.dbAvailable === false) {
    const orders = getUserOrders(userId);
    return orders.map((order) => ({
      id: order.orderId,
      userId: order.userId,
      total: Number(order.totalAmount),
      status: order.orderStatus,
      createdAt: order.orderDate,
    }));
  }

  const orders = await Order.findAll({ where: { userId: Number(userId) }, order: [['orderId', 'DESC']] });
  return orders.map((order) => ({
    id: order.orderId,
    userId: order.userId,
    total: Number(order.totalAmount),
    status: order.orderStatus,
    createdAt: order.orderDate,
  }));
};

const cancelOrder = async (id) => {
  if (global.dbAvailable === false) {
    const order = getMockOrderById(id);
    if (!order) return null;
    order.orderStatus = 'Cancelled';
    order.status = 'Cancelled';
    return {
      id: order.orderId,
      userId: order.userId,
      total: Number(order.totalAmount),
      status: order.orderStatus,
      createdAt: order.orderDate,
    };
  }

  const order = await Order.findByPk(Number(id));
  if (!order) return null;
  order.orderStatus = 'Cancelled';
  await order.save();
  return {
    id: order.orderId,
    userId: order.userId,
    total: Number(order.totalAmount),
    status: order.orderStatus,
    createdAt: order.orderDate,
  };
};

export { createOrder, listOrders, getOrderById, getOrderHistory, cancelOrder };
const updateOrderStatus = async (id, status) => {
  if (global.dbAvailable === false) {
    const order = getMockOrderById(id);
    if (!order) return null;
    order.orderStatus = status;
    order.status = status;
    return {
      id: order.orderId,
      userId: order.userId,
      total: Number(order.totalAmount),
      status: order.orderStatus,
      createdAt: order.orderDate,
    };
  }

  const order = await Order.findByPk(Number(id));
  if (!order) return null;
  order.orderStatus = status;
  await order.save();
  return {
    id: order.orderId,
    userId: order.userId,
    total: Number(order.totalAmount),
    status: order.orderStatus,
    createdAt: order.orderDate,
  };
};

export { updateOrderStatus };
