import express from 'express';
import {
  addToCartHandler,
  getCartHandler,
  clearCartHandler,
  createOrderHandler,
  listOrdersHandler,
  getOrderByIdHandler,
} from '../controllers/cartOrderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/cart', authenticate, getCartHandler);
router.post('/cart', authenticate, addToCartHandler);
router.delete('/cart', authenticate, clearCartHandler);

router.get('/orders', authenticate, listOrdersHandler);
router.get('/orders/:id', authenticate, getOrderByIdHandler);
router.post('/orders', authenticate, createOrderHandler);

export default router;
