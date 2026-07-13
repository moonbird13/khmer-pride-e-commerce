import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {
  createProductHandler,
  listProductsHandler,
  getProductByIdHandler,
  getFilterOptionsHandler,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/options/filters', getFilterOptionsHandler);
router.get('/', listProductsHandler);
router.get('/:id', getProductByIdHandler);
router.post(
    '/',
    authenticate,
    authorizeRoles('admin', 'staff'),
    upload.single('image'),
    createProductHandler
);

export default router;
