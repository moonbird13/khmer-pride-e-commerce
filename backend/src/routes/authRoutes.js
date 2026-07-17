import express from 'express';
import { register, login, staffLogin, refresh, logout, verifyEmail, forgotPassword, resetPassword, changePassword, profile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/staff-login', staffLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticate, changePassword);
router.get('/profile', authenticate, profile);

export default router;
