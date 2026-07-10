import express from 'express';
import {
  createCategoryHandler,
  listCategoriesHandler,
  getCategoryByIdHandler,
  createProductHandler,
  listProductsHandler,
  getProductByIdHandler,
} from '../controllers/productController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/categories', listCategoriesHandler);
router.get('/categories/:id', getCategoryByIdHandler);
router.post('/categories', authenticate, authorizeRoles('admin', 'staff'), createCategoryHandler);

router.get('/products', listProductsHandler);
router.get('/products/:id', getProductByIdHandler);
router.post('/products', authenticate, authorizeRoles('admin', 'staff'), createProductHandler);

export default router;
