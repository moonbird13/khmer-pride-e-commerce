const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { persistUser, findStoredUser } = require('../utils/storage');
require('dotenv').config();

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

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = global.dbAvailable === false
      ? await findStoredUser(email)
      : await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
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

    return res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = global.dbAvailable === false
      ? await findStoredUser(email)
      : await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    if (global.dbAvailable !== false) {
      await user.save();
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'Login successful.',
      accessToken,
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: 'Refresh token missing.' });
    }

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid refresh token.' });
    }

    const accessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token invalid.', error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const payload = jwt.decode(token);
      if (payload?.id) {
        const user = await User.findByPk(payload.id);
        if (user) {
          user.refreshToken = null;
          await user.save();
        }
      }
    }
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'Logged out.' });
  } catch (error) {
    return res.status(500).json({ message: 'Logout failed.', error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findOne({ where: { email: payload.email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    return res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired verification token.', error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email.' });
    }

    const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1h' });
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    return res.status(200).json({ message: 'Password reset instructions sent.', resetToken });
  } catch (error) {
    return res.status(500).json({ message: 'Forgot password failed.', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findOne({ where: { id: payload.id, passwordResetToken: token } });
    if (!user || new Date(user.passwordResetExpires) < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    return res.status(400).json({ message: 'Unable to reset password.', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Change password failed.', error: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
};
