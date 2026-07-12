import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {
  createCategoryHandler,
  listCategoriesHandler,
  getCategoryByIdHandler,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', listCategoriesHandler);
router.get('/:id', getCategoryByIdHandler);
router.post('/', authenticate, authorizeRoles('admin', 'staff'), createCategoryHandler);

export default router;
