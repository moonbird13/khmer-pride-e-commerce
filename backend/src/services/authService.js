import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as userRepository from '../repositories/user.repository.js';
import * as emailVerificationTokenRepository from '../repositories/emailVerificationToken.repository.js';
import * as refreshTokenRepository from '../repositories/refreshToken.repository.js';
import * as passwordResetTokenRepository from '../repositories/passwordResetToken.repository.js';

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

  const resetToken = jwt.sign({ id: user.userId ?? user.id, email: user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });

  await passwordResetTokenRepository.createPassToken({
    token: resetToken,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    userId: user.userId ?? user.id,
  });

  return { message: 'Password reset instructions sent.', resetToken };
};

const resetPassword = async ({ token, newPassword }) => {
  const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  const user = await getUserById(payload.id);

  const resetTokenRecord = await passwordResetTokenRepository.findByToken(token, payload.id);
  if (!user || !resetTokenRecord || resetTokenRecord.isUsed || new Date(resetTokenRecord.expiresAt) < new Date()) {
    const error = new Error('Invalid or expired reset token.');
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(String(newPassword), 10);

  await userRepository.updatePassword(user.userId ?? user.id, hashedPassword);
  await passwordResetTokenRepository.markAsUsed(resetTokenRecord.resetTokenId ?? resetTokenRecord.id);

  return { message: 'Password reset successful.' };
};

const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await getUserById(userId);

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

  const hashedPassword = await bcrypt.hash(String(newPassword), 10);

  await userRepository.updatePassword(user.userId ?? user.id, hashedPassword);

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
