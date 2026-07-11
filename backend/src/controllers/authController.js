<<<<<<< HEAD
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { persistUser, findStoredUser } from '../utils/storage.js';
import dotenv from 'dotenv';
dotenv.config();
=======
import dotenv from 'dotenv';
import {
  register as registerService,
  login as loginService,
  refreshAccessToken,
  logout as logoutService,
  verifyEmail as verifyEmailService,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
  changePassword as changePasswordService,
} from '../services/authService.js';
>>>>>>> 252a5bd484a0db2b0118437b628075d47e4548ea

dotenv.config();

const register = async (req, res) => {
  try {
    const result = await registerService(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Registration failed.' });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginService(req.body);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: result.message,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Login failed.' });
  }
};

const refresh = async (req, res) => {
  try {
    const result = await refreshAccessToken({ refreshToken: req.cookies.refreshToken });
    return res.status(200).json({ accessToken: result.accessToken, message: result.message });
  } catch (error) {
    return res.status(error.status || 401).json({ message: error.message || 'Refresh token invalid.' });
  }
};

const logout = async (req, res) => {
  try {
    await logoutService({ refreshToken: req.cookies.refreshToken });
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out.' });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Logout failed.' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const result = await verifyEmailService({ token: req.params.token });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Invalid or expired verification token.' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Forgot password failed.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await resetPasswordService(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 400).json({ message: error.message || 'Unable to reset password.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const result = await changePasswordService({
      userId: req.user.id,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Change password failed.' });
  }
};

export {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};
