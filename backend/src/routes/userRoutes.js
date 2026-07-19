import express from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import {
  listUsersHandler,
  dashboardHandler,
  getUserByIdHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/userController.js';

const router = express.Router();
const adminOnly = authorizeRoles('admin');

router.get('/', authenticate, adminOnly, listUsersHandler);
router.get('/dashboard', authenticate, adminOnly, dashboardHandler);
router.get('/:id', authenticate, adminOnly, getUserByIdHandler);
router.patch('/:id', authenticate, adminOnly, updateUserHandler);
router.delete('/:id', authenticate, adminOnly, deleteUserHandler);

export default router;
