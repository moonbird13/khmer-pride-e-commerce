import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {
  createOrderHandler,
  listOrdersHandler,
  getOrderByIdHandler,
  updateOrderStatusHandler,
} from '../controllers/cartOrderController.js';

const router = express.Router();

router.get('/', authenticate, listOrdersHandler);
router.get('/:id', authenticate, getOrderByIdHandler);
router.post('/', authenticate, createOrderHandler);
router.put('/:id/status', authenticate, authorizeRoles('staff', 'admin'), updateOrderStatusHandler);

export default router;
