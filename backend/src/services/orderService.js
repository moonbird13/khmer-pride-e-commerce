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

export { createOrder, listOrders, getOrderById };
