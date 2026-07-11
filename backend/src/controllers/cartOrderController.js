import { addToCart, getCart, clearCart } from '../services/cartService.js';
import { createOrder, listOrders, getOrderById } from '../services/orderService.js';

const addToCartHandler = async (req, res) => {
  try {
    const cart = await addToCart({ ...req.body, userId: req.user?.id });
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to update cart.' });
  }
};

const getCartHandler = async (req, res) => {
  try {
    const cart = await getCart(req.user?.id);
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load cart.' });
  }
};

const clearCartHandler = async (req, res) => {
  try {
    const cart = await clearCart(req.user?.id);
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to clear cart.' });
  }
};

const createOrderHandler = async (req, res) => {
  try {
    const order = await createOrder({ ...req.body, userId: req.user?.id });
    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to create order.' });
  }
};

const listOrdersHandler = async (req, res) => {
  try {
    const orders = await listOrders(req.user?.id);
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load orders.' });
  }
};

const getOrderByIdHandler = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load order.' });
  }
};

export {
  addToCartHandler,
  getCartHandler,
  clearCartHandler,
  createOrderHandler,
  listOrdersHandler,
  getOrderByIdHandler,
};
