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
  // no export change in service; controller enforces staff role
} from '../services/authService.js';
import * as userRepository from '../repositories/user.repository.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';

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
    if (['staff', 'admin'].includes(String(result.user?.role).toLowerCase())) {
      return res.status(403).json({ message: 'Staff and admin accounts must sign in at /staff-login.' });
    }
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
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

const staffLogin = async (req, res) => {
  try {
    const result = await loginService(req.body);

    const allowed = ['staff', 'admin'];
    const userRole = (result.user && result.user.role) || '';

    if (!allowed.includes(String(userRole).toLowerCase())) {
      return res.status(403).json({ message: 'Access denied. Not a staff account.' });
    }

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Staff login successful.',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
      redirect: '/staff-portal',
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Staff login failed.' });
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
      role: req.user.role,
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || 'Change password failed.' });
  }
};

const profile = async (req, res) => {
  try {
    const payload = req.user || {};
    if (!payload.email && !payload.id) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const user = await User.findByPk(payload.id || payload.id);

    if (!user) return res.status(404).json({ message: 'User not found.' });

    const result = {
      id: user.userId ?? user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const payload = req.user || {};
    if (!payload.email && !payload.id) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const user = await User.findByPk(payload.id || payload.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const updates = {};
    if (req.body.fullName) {
      updates.fullName = String(req.body.fullName).trim();
    }

    if (req.file) {
      const oldPublicId = user.avatarPublicId;
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'khmer-pride/avatars',
        public_id: `user_${user.userId ?? user.id}`,
        overwrite: true,
      });

      updates.avatarUrl = result.secure_url;
      updates.avatarPublicId = result.public_id;

      if (oldPublicId && oldPublicId !== result.public_id) {
        await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'image' });
      }
    }

    const email = req.body.email ? String(req.body.email).trim().toLowerCase() : null;
    if (email && email !== user.email) {
      const existingEmailUser = await userRepository.findUserByEmail(email);
      if (existingEmailUser && existingEmailUser.userId !== user.userId) {
        return res.status(409).json({ message: 'Email is already in use.' });
      }
      updates.email = email;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No profile data to update.' });
    }

    await userRepository.updateUser(user.userId ?? user.id, updates);
    const updatedUser = await User.findByPk(user.userId ?? user.id);

    return res.status(200).json({
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser.userId ?? updatedUser.id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update profile.' });
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
  // Staff login handler: allow only staff/admin roles
  staffLogin,
  profile,
  updateProfile,
};
