import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { persistUser, findStoredUser } from '../utils/storage.js';
import dotenv from 'dotenv';
dotenv.config();

const generateAccessToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
);

const generateRefreshToken = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
);

const sanitizeUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
});

const findUserByEmail = async (email) => {
  if (global.dbAvailable === false) {
    return findStoredUser(email);
  }
  return User.findOne({ where: { email } });
};

const register = async ({ fullName, email, password }) => {
  if (!fullName || !email || !password) {
    throw new Error('All fields are required.');
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error('Email already registered.');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
  const userDocument = {
    id: Date.now(),
    fullName,
    email,
    password: hashedPassword,
    verificationToken,
    role: 'customer',
    isVerified: true,
    refreshToken: null,
    passwordResetToken: null,
    passwordResetExpires: null,
  };

  const user = global.dbAvailable === false
    ? await persistUser(userDocument)
    : await User.create({
        fullName,
        email,
        password: hashedPassword,
        verificationToken,
        role: 'customer',
      });

  return {
    message: 'Registration successful. Please verify your email.',
    user: sanitizeUser(user),
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error('Invalid credentials.');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials.');
    error.status = 401;
    throw error;
  }

  if (!user.isVerified) {
    const error = new Error('Please verify your email before logging in.');
    error.status = 403;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  if (global.dbAvailable === false) {
    await persistUser(user);
  } else {
    await user.save();
  }

  return {
    message: 'Login successful.',
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
};

const logout = async ({ refreshToken }) => {
  if (!refreshToken) {
    return { message: 'Logged out.' };
  }

  const payload = jwt.decode(refreshToken);
  if (!payload?.id) {
    return { message: 'Logged out.' };
  }

  const user = global.dbAvailable === false
    ? await findStoredUser(payload.email)
    : await User.findByPk(payload.id);

  if (user) {
    user.refreshToken = null;
    if (global.dbAvailable === false) {
      await persistUser(user);
    } else {
      await user.save();
    }
  }

  return { message: 'Logged out.' };
};

const verifyEmail = async ({ token }) => {
  const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  const user = await findUserByEmail(payload.email);
  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  user.isVerified = true;
  user.verificationToken = null;
  if (global.dbAvailable === false) {
    await persistUser(user);
  } else {
    await user.save();
  }

  return { message: 'Email verified successfully.' };
};

const forgotPassword = async ({ email }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error('No user found with that email.');
    error.status = 404;
    throw error;
  }

  const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);

  if (global.dbAvailable === false) {
    await persistUser(user);
  } else {
    await user.save();
  }

  return { message: 'Password reset instructions sent.', resetToken };
};

const resetPassword = async ({ token, newPassword }) => {
  const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  const user = global.dbAvailable === false
    ? global.memoryUsers?.find((entry) => entry.id === Number(payload.id) && entry.passwordResetToken === token)
    : await User.findOne({ where: { id: payload.id, passwordResetToken: token } });

  if (!user || new Date(user.passwordResetExpires) < new Date()) {
    const error = new Error('Invalid or expired reset token.');
    error.status = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  if (global.dbAvailable === false) {
    await persistUser(user);
  } else {
    await user.save();
  }

  return { message: 'Password reset successful.' };
};

const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = global.dbAvailable === false
    ? global.memoryUsers?.find((entry) => entry.id === Number(userId))
    : await User.findByPk(userId);

  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error('Current password is incorrect.');
    error.status = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  if (global.dbAvailable === false) {
    await persistUser(user);
  } else {
    await user.save();
  }

  return { message: 'Password changed successfully.' };
};

export {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};
