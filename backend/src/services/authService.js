import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import EmailVerificationToken from '../models/EmailVerificationToken.js';
import PasswordResetToken from '../models/PasswordResetToken.js';
import { persistUser, findStoredUser } from '../utils/storage.js';
import dotenv from 'dotenv';

dotenv.config();

const generateAccessToken = (user) => jwt.sign(
  { id: user.userId ?? user.id, email: user.email, role: user.role },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
);

const generateRefreshToken = (user) => jwt.sign(
  { id: user.userId ?? user.id, email: user.email, role: user.role },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
);

const sanitizeUser = (user) => ({
  id: user.userId ?? user.id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  isVerified: Boolean(user.isVerified),
});

const findUserByEmail = async (email) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (global.dbAvailable === false) {
    return findStoredUser(normalizedEmail);
  }
  return User.findOne({ where: { email: normalizedEmail } });
};

const saveUser = async (user) => {
  if (global.dbAvailable === false) {
    return persistUser(user);
  }

  if (typeof user.save === 'function') {
    await user.save();
  }

  return user;
};

const register = async ({ fullName, email, password }) => {
  if (!fullName || !email || !password) {
    throw Object.assign(new Error('All fields are required.'), { status: 400 });
  }

  const normalizedFullName = String(fullName).trim();
  const normalizedEmail = String(email).trim().toLowerCase();
  const normalizedPassword = String(password);

  if (!normalizedFullName || !normalizedEmail || normalizedPassword.length < 6) {
    throw Object.assign(new Error('Please provide a valid name, email, and password.'), { status: 400 });
  }

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    const error = new Error('Email already registered.');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
  const verificationToken = jwt.sign({ email: normalizedEmail }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
  const userId = Date.now();
  const userDocument = {
    id: userId,
    userId,
    fullName: normalizedFullName,
    email: normalizedEmail,
    phone: null,
    password: hashedPassword,
    role: 'customer',
    isVerified: false,
  };

  const user = global.dbAvailable === false
    ? await persistUser(userDocument)
    : await User.create({
        fullName: normalizedFullName,
        email: normalizedEmail,
        phone: null,
        password: hashedPassword,
        role: 'customer',
        isVerified: false,
      });

  if (global.dbAvailable !== false) {
    await EmailVerificationToken.create({
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: user.userId ?? user.id,
    });
  }

  return {
    message: 'Registration successful. Please verify your email.',
    user: sanitizeUser(user),
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw Object.assign(new Error('Email and password are required.'), { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    const error = new Error('Invalid credentials.');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(String(password), user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials.');
    error.status = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  if (global.dbAvailable === false) {
    user.refreshToken = refreshToken;
    await saveUser(user);
  } else {
    await RefreshToken.create({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user.userId ?? user.id,
    });
  }

  return {
    message: 'Login successful.',
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
};

const refreshAccessToken = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw Object.assign(new Error('Refresh token is required.'), { status: 400 });
  }

  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = global.dbAvailable === false
    ? global.memoryUsers?.find((entry) => (entry.userId ?? entry.id) === Number(payload.id))
    : await User.findByPk(payload.id);

  const storedToken = global.dbAvailable === false
    ? null
    : await RefreshToken.findOne({ where: { token: refreshToken, userId: payload.id } });

  if (!user || (global.dbAvailable === false ? user.refreshToken !== refreshToken : !storedToken || storedToken.isRevoked || new Date(storedToken.expiresAt) < new Date())) {
    const error = new Error('Invalid refresh token.');
    error.status = 403;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  return {
    message: 'Access token refreshed.',
    accessToken,
    user: sanitizeUser(user),
  };
};

const logout = async ({ refreshToken }) => {
  if (!refreshToken) {
    return { message: 'Logged out.' };
  }

  const payload = jwt.decode(refreshToken) || {};
  const userId = payload.id;
  if (!userId) {
    return { message: 'Logged out.' };
  }

  const user = global.dbAvailable === false
    ? global.memoryUsers?.find((entry) => (entry.userId ?? entry.id) === Number(userId))
    : await User.findByPk(userId);

  if (user && global.dbAvailable === false) {
    user.refreshToken = null;
    await saveUser(user);
  } else if (user) {
    await RefreshToken.update({ isRevoked: true, revokedAt: new Date() }, { where: { userId: user.userId ?? user.id, token: refreshToken } });
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

  const verificationTokenRecord = global.dbAvailable === false
    ? null
    : await EmailVerificationToken.findOne({ where: { token, userId: user.userId ?? user.id } });

  if (global.dbAvailable !== false && !verificationTokenRecord) {
    const error = new Error('Invalid or expired verification token.');
    error.status = 400;
    throw error;
  }

  user.isVerified = true;
  await saveUser(user);

  if (global.dbAvailable !== false && verificationTokenRecord) {
    verificationTokenRecord.isUsed = true;
    await verificationTokenRecord.save();
  }

  return { message: 'Email verified successfully.' };
};

const forgotPassword = async ({ email }) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    const error = new Error('No user found with that email.');
    error.status = 404;
    throw error;
  }

  const resetToken = jwt.sign({ id: user.userId ?? user.id, email: user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });

  if (global.dbAvailable === false) {
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await saveUser(user);
  } else {
    await PasswordResetToken.create({
      token: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      userId: user.userId ?? user.id,
    });
  }

  return { message: 'Password reset instructions sent.', resetToken };
};

const resetPassword = async ({ token, newPassword }) => {
  const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  const user = global.dbAvailable === false
    ? global.memoryUsers?.find((entry) => (entry.userId ?? entry.id) === Number(payload.id))
    : await User.findByPk(payload.id);

  const resetTokenRecord = global.dbAvailable === false
    ? null
    : await PasswordResetToken.findOne({ where: { token, userId: payload.id } });

  if (!user || (global.dbAvailable === false ? false : !resetTokenRecord || resetTokenRecord.isUsed || new Date(resetTokenRecord.expiresAt) < new Date())) {
    const error = new Error('Invalid or expired reset token.');
    error.status = 400;
    throw error;
  }

  user.password = await bcrypt.hash(String(newPassword), 10);
  await saveUser(user);

  if (global.dbAvailable !== false && resetTokenRecord) {
    resetTokenRecord.isUsed = true;
    await resetTokenRecord.save();
  }

  return { message: 'Password reset successful.' };
};

const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = global.dbAvailable === false
    ? global.memoryUsers?.find((entry) => (entry.userId ?? entry.id) === Number(userId))
    : await User.findByPk(userId);

  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(String(currentPassword), user.password);
  if (!isMatch) {
    const error = new Error('Current password is incorrect.');
    error.status = 400;
    throw error;
  }

  user.password = await bcrypt.hash(String(newPassword), 10);
  await saveUser(user);

  return { message: 'Password changed successfully.' };
};

export {
  register,
  login,
  refreshAccessToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};
