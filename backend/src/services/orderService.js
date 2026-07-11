import db from '../models/index.js';

const { Order, Order_detail } = db;

const createOrder = async ({ userId, items, total }) => {
  const order = await Order.create({
    userId: Number(userId),
    orderDate: new Date(),
    totalAmount: Number(total),
    orderStatus: 'Pending',
    shippingHouseNumber: 'N/A',
    shippingStreet: 'N/A',
    shippingCommune: 'N/A',
    shippingDistrict: 'N/A',
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

const listOrders = async () => {
  const orders = await Order.findAll({ order: [['orderId', 'DESC']] });
  return orders.map((order) => ({
    id: order.orderId,
    userId: order.userId,
    total: Number(order.totalAmount),
    status: order.orderStatus,
    createdAt: order.orderDate,
  }));
};

const getOrderById = async (id) => {
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
