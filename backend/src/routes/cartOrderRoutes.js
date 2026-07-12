import express from 'express';
import {
  addToCartHandler,
  getCartHandler,
  clearCartHandler,
  updateCartItemHandler,
  removeCartItemHandler,
  createOrderHandler,
  listOrdersHandler,
  getOrderByIdHandler,
} from '../controllers/cartOrderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/cart', authenticate, getCartHandler);
router.post('/cart', authenticate, addToCartHandler);
router.patch('/cart/items/:productId', authenticate, updateCartItemHandler);
router.delete('/cart/items/:productId', authenticate, removeCartItemHandler);
router.delete('/cart', authenticate, clearCartHandler);

router.get('/orders', authenticate, listOrdersHandler);
router.get('/orders/:id', authenticate, getOrderByIdHandler);
router.post('/orders', authenticate, createOrderHandler);

export default router;
