const orders = [];

const createOrder = ({ userId, items, total }) => {
  const order = {
    id: Date.now(),
    userId: Number(userId),
    items,
    total: Number(total),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  return order;
};

const listOrders = () => orders;

const getOrderById = (id) => orders.find((order) => order.id === Number(id));

const getOrderHistory = (userId) => orders.filter((order) => order.userId === Number(userId));

const cancelOrder = (id) => {
  const order = getOrderById(id);
  if (!order) return null;
  order.status = 'cancelled';
  return order;
};

export { createOrder, listOrders, getOrderById, getOrderHistory, cancelOrder };
