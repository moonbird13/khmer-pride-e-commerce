import express from 'express';
import upload from '../middleware/upload.js';
import { register, login, staffLogin, refresh, logout, verifyEmail, forgotPassword, resetPassword, changePassword, profile, updateProfile } from '../controllers/authController.js';
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
router.patch('/profile', authenticate, upload.single('avatar'), updateProfile);

export default router;
