import { addToCart, getCart, clearCart } from '../services/cartService.js';
import { createOrder, listOrders, getOrderById } from '../services/orderService.js';

const addToCartHandler = (req, res) => {
  const cart = addToCart(req.body);
  res.status(200).json(cart);
};

const getCartHandler = (req, res) => {
  res.json(getCart());
};

const clearCartHandler = (req, res) => {
  res.json(clearCart());
};

const createOrderHandler = (req, res) => {
  const order = createOrder(req.body);
  res.status(201).json(order);
};

const listOrdersHandler = (req, res) => {
  res.json(listOrders());
};

const getOrderByIdHandler = (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }
  return res.json(order);
};

export {
  addToCartHandler,
  getCartHandler,
  clearCartHandler,
  createOrderHandler,
  listOrdersHandler,
  getOrderByIdHandler,
};
