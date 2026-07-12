import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {
  createProductHandler,
  listProductsHandler,
  getProductByIdHandler,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', listProductsHandler);
router.get('/:id', getProductByIdHandler);
router.post('/', authenticate, authorizeRoles('admin', 'staff'), createProductHandler);

export default router;
