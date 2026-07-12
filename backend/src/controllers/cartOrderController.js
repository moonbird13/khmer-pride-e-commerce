import { addToCart, getCart, clearCart, removeCartItem, updateQuantity } from '../services/cartService.js';
import { createOrder, listOrders, getOrderById } from '../services/orderService.js';
import { updateOrderStatus } from '../services/orderService.js';

const addToCartHandler = async (req, res) => {
  try {
    const cart = await addToCart({ ...req.body, userId: req.user?.id });
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Unable to update cart.' });
  }
};

const getCartHandler = async (req, res) => {
  try {
    const cart = await getCart(req.user?.id);
    return res.json(cart);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Unable to load cart.' });
  }
};

const clearCartHandler = async (req, res) => {
  try {
    const cart = await clearCart(req.user?.id);
    return res.json(cart);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Unable to clear cart.' });
  }
};

const updateCartItemHandler = async (req, res) => {
  try {
    const cart = await updateQuantity({
      userId: req.user?.id,
      productId: req.params.productId,
      quantity: req.body.quantity,
    });
    return res.json(cart);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Unable to update cart item.' });
  }
};

const removeCartItemHandler = async (req, res) => {
  try {
    const cart = await removeCartItem({
      userId: req.user?.id,
      productId: req.params.productId,
    });
    return res.json(cart);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Unable to remove cart item.' });
  }
};

const createOrderHandler = async (req, res) => {
  try {
    // Frontend sends: items, total, shippingAddress, shippingCity, paymentMethod
    // Backend needs: userId, items, total
    const { items, total, shippingAddress, shippingCity, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    if (!total || Number(total) <= 0) {
      return res.status(400).json({ message: 'Invalid order total.' });
    }

    const order = await createOrder({
      userId: req.user?.id,
      items,
      total,
      shippingAddress,
      shippingCity,
      paymentMethod,
    });

    // Clear cart after successful order
    await clearCart(req.user?.id);

    return res.status(201).json(order);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Unable to create order.' });
  }
};

const listOrdersHandler = async (req, res) => {
  try {
    const orders = await listOrders(req.user?.id);
    return res.json(orders);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Unable to load orders.' });
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
    return res.status(error.status || 500).json({ message: error.message || 'Unable to load order.' });
  }
};

const updateOrderStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required.' });

    const updated = await updateOrderStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ message: 'Order not found.' });
    return res.json({ message: 'Order updated.', status: updated.status });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Unable to update order status.' });
  }
};

export {
  addToCartHandler,
  getCartHandler,
  clearCartHandler,
  updateCartItemHandler,
  removeCartItemHandler,
  createOrderHandler,
  listOrdersHandler,
  getOrderByIdHandler,
  updateOrderStatusHandler,
};
