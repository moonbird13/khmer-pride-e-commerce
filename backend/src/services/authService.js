import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as userRepository from '../repositories/user.repository.js';
import * as emailVerificationTokenRepository from '../repositories/emailVerificationToken.repository.js';
import * as refreshTokenRepository from '../repositories/refreshToken.repository.js';
import * as passwordResetTokenRepository from '../repositories/passwordResetToken.repository.js';
import { sendPasswordResetCode } from '../utils/email.js';

dotenv.config();

// ─────────────────────────────────────────────
// Authentication Service
// Handles business logic related to user authentication
// including login, registration, token generation, etc.
// ─────────────────────────────────────────────

const generateAccessToken = (user) => jwt.sign(
  { id: user.userId ?? user.id, email: user.email, phone: user.phone, role: user.role },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
);

const generateRefreshToken = (user) => jwt.sign(
  { id: user.userId ?? user.id, email: user.email, phone: user.phone, role: user.role },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
);

const sanitizeUser = (user) => ({
  id: user.userId ?? user.id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  avatarUrl: user.avatarUrl || null,
});

const getUserByEmail = async (email) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  return userRepository.findUserByEmail(normalizedEmail);
};

const getUserById = async (userId) => {
  return userRepository.findUserById(userId);
};

const saveUserRecord = async (user) => {
  return userRepository.addUser(user);
};

const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
const passwordChangeFailures = new Map();
const MAX_PASSWORD_CHANGE_FAILURES = 5;
const PASSWORD_CHANGE_LOCK_MS = 15 * 60 * 1000;

const assertPasswordChangeAllowed = (userId) => {
  const attempt = passwordChangeFailures.get(userId);
  if (!attempt || !attempt.lockedUntil) return;
  if (attempt.lockedUntil <= Date.now()) {
    passwordChangeFailures.delete(userId);
    return;
  }
  throw Object.assign(
    new Error('Too many incorrect current-password attempts. Try again in 15 minutes.'),
    { status: 429 }
  );
};

const recordPasswordChangeFailure = (userId) => {
  const attempt = passwordChangeFailures.get(userId) || { count: 0, lockedUntil: null };
  attempt.count += 1;
  if (attempt.count >= MAX_PASSWORD_CHANGE_FAILURES) {
    attempt.count = 0;
    attempt.lockedUntil = Date.now() + PASSWORD_CHANGE_LOCK_MS;
  }
  passwordChangeFailures.set(userId, attempt);
};

/**
 * Register a new user
 * 
 * Steps:
 * 1. Validate user input
 * 2. Check if email already exists
 * 3. Hash user password
 * 4. Store user data
 * 5. Return created user information
 */
const register = async ({ fullName, email, password, phone, role }) => {
  if (role && ['staff', 'admin'].includes(String(role).toLowerCase())) {
    const error = new Error('Staff and admin accounts cannot be created through registration.');
    error.status = 403;
    throw error;
  }

  if (!fullName || (!email && !phone) || !password) {
    throw Object.assign(new Error('All fields are required.'), { status: 400 });
  }

  const normalizedFullName = String(fullName).trim();
  const normalizedEmail = email
  ? String(email).trim().toLowerCase()
  : null;

const normalizedPhone = phone
  ? String(phone).trim()
  : null;

const normalizedPassword = String(password).trim();

 if (!normalizedFullName || normalizedPassword.length < 6) {
  throw Object.assign(
    new Error('Please provide a valid name and password.'),
    { status: 400 }
  );
}

if (normalizedEmail && normalizedEmail.length === 0) {
  throw Object.assign(new Error('Invalid email.'), { status: 400 });
}

if (normalizedPhone && normalizedPhone.length === 0) {
  throw Object.assign(new Error('Invalid phone number.'), { status: 400 });
}

 const existingUser = await userRepository.findUserByIdentifier(
    normalizedEmail || normalizedPhone
);
  if (existingUser) {
    const error = new Error('An account with this email or phone number already exists.');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
  const verificationToken = normalizedEmail
    ? jwt.sign({ email: normalizedEmail }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' })
    : null;
  const userDocument = {
    fullName: normalizedFullName,
    email: normalizedEmail,
    phone: normalizedPhone,
    password: hashedPassword,
    role: 'customer',
  };

  const user = await saveUserRecord(userDocument);

  if (verificationToken) {
    await emailVerificationTokenRepository.createToken({
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: user.userId ?? user.id,
    });
  }

  return {
    message: normalizedEmail
      ? 'Registration successful. Please verify your email.'
      : 'Registration successful. You can log in with your phone number.',
    verificationToken,
    user: sanitizeUser(user),
  };
};

const login = async ({ identifier, email, phone, password }) => {
  const loginIdentifier = identifier || email || phone;

  if (!loginIdentifier || !password) {
    throw Object.assign(
      new Error('Email/phone and password are required.'),
      { status: 400 }
    );
  }

  const normalizedIdentifier = String(loginIdentifier)
      .trim()
      .toLowerCase();

  const user = await userRepository.findUserByIdentifier(
      normalizedIdentifier
  );


  if (!user) {
    const error = new Error('Invalid credentials.');
    error.status = 401;
    throw error;
  }

  if (user.userStatus === 'Frozen') {
    throw Object.assign(new Error('This account has been frozen. Please contact an administrator.'), { status: 403 });
  }


  const isMatch = await bcrypt.compare(
      String(password),
      user.password
  );


  if (!isMatch) {
    const error = new Error('Invalid credentials.');
    error.status = 401;
    throw error;
  }


  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);


  await refreshTokenRepository.createToken({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userId: user.userId ?? user.id,
  });


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
  const user = await getUserById(payload.id);

  const storedToken = await refreshTokenRepository.findByToken(refreshToken, payload.id);
  // consider token revoked when `revokedAt` is set
  const isTokenRevoked = storedToken && storedToken.revokedAt;
  if (!user || !storedToken || isTokenRevoked || new Date(storedToken.expiresAt) < new Date()) {
    const error = new Error('Invalid refresh token.');
    error.status = 403;
    throw error;
  }
  if (user.userStatus === 'Frozen') {
    throw Object.assign(new Error('This account has been frozen. Please contact an administrator.'), { status: 403 });
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

  const user = await getUserById(userId);
  if (!user) {
    return { message: 'Logged out.' };
  }

  await refreshTokenRepository.revokeToken(user.userId ?? user.id, refreshToken);

  return { message: 'Logged out.' };
};

const verifyEmail = async ({ token }) => {
  const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  const user = await getUserByEmail(payload.email);
  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  const verificationTokenRecord = await emailVerificationTokenRepository.findByToken(token, user.userId ?? user.id);
  if (!verificationTokenRecord) {
    const error = new Error('Invalid or expired verification token.');
    error.status = 400;
    throw error;
  }

  await emailVerificationTokenRepository.markAsUsed(verificationTokenRecord.verificationTokenId ?? verificationTokenRecord.id);

  return { message: 'Email verified successfully.' };
};

const forgotPassword = async ({ email }) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await getUserByEmail(normalizedEmail);
  if (!user) {
    const error = new Error('No user found with that email.');
    error.status = 404;
    throw error;
  }

  if (user.role !== 'customer') {
    throw Object.assign(new Error('Password recovery is available for customer accounts only.'), { status: 403 });
  }

  const resetCode = crypto.randomInt(100000, 1000000).toString();
  const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

  await passwordResetTokenRepository.createPassToken({
    token: hashedResetCode,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    userId: user.userId ?? user.id,
  });

  await sendPasswordResetCode({ email: user.email, code: resetCode });
  return { message: 'A six-digit password reset code was sent to your email. It expires in 5 minutes.' };
};

const resetPassword = async ({ email, code, newPassword }) => {
  const user = await getUserByEmail(email);
  const hashedResetCode = crypto.createHash('sha256').update(String(code || '')).digest('hex');

  const resetTokenRecord = user
    ? await passwordResetTokenRepository.findByToken(hashedResetCode, user.userId ?? user.id)
    : null;
  if (!user || !resetTokenRecord || resetTokenRecord.isUsed || new Date(resetTokenRecord.expiresAt) < new Date()) {
    const error = new Error('Invalid or expired reset token.');
    error.status = 400;
    throw error;
  }

  if (user.role !== 'customer') {
    throw Object.assign(new Error('Password recovery is available for customer accounts only.'), { status: 403 });
  }

  if (!PASSWORD_POLICY.test(String(newPassword))) {
    throw Object.assign(
      new Error('New password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.'),
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(String(newPassword), 10);

  await userRepository.updatePassword(user.userId ?? user.id, hashedPassword);
  await passwordResetTokenRepository.markAsUsed(resetTokenRecord.resetTokenId ?? resetTokenRecord.id);
  await refreshTokenRepository.revokeAllTokensForUser(user.userId ?? user.id);

  return { message: 'Password reset successful. Please sign in again.' };
};

const changePassword = async ({ userId, currentPassword, newPassword, role }) => {
  if (!['admin', 'customer'].includes(String(role).toLowerCase())) {
    throw Object.assign(new Error('You do not have permission to change this password.'), { status: 403 });
  }

  assertPasswordChangeAllowed(userId);
  const user = await getUserById(userId);

  if (!user) {
    const error = new Error('User not found.');
    error.status = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(String(currentPassword), user.password);
  if (!isMatch) {
    recordPasswordChangeFailure(userId);
    const error = new Error('Current password is incorrect.');
    error.status = 400;
    throw error;
  }

  if (!PASSWORD_POLICY.test(String(newPassword))) {
    throw Object.assign(
      new Error('New password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.'),
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(String(newPassword), 10);

  await userRepository.updatePassword(user.userId ?? user.id, hashedPassword);
  await refreshTokenRepository.revokeAllTokensForUser(user.userId ?? user.id);
  passwordChangeFailures.delete(userId);

  return { message: 'Password updated successfully.' };
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
