import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  addToCartHandler,
  getCartHandler,
  clearCartHandler,
  updateCartItemHandler,
  removeCartItemHandler,
} from '../controllers/cartOrderController.js';

const router = express.Router();

router.get('/', authenticate, getCartHandler);
router.post('/', authenticate, addToCartHandler);
router.patch('/items/:productId', authenticate, updateCartItemHandler);
router.delete('/items/:productId', authenticate, removeCartItemHandler);
router.delete('/', authenticate, clearCartHandler);

export default router;
