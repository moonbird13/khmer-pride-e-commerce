import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  createProductHandler,
  listProductsHandler,
  getProductByIdHandler,
  getFilterOptionsHandler,
  updateProductHandler,
  deleteProductHandler,
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
router.put(
    '/:id',
    authenticate,
    authorizeRoles('admin', 'staff'),
    upload.single('image'),
    updateProductHandler
);
router.delete(
    '/:id',
    authenticate,
    authorizeRoles('admin', 'staff'),
    deleteProductHandler
);

export default router;
