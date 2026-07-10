import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateAccessToken = (user) => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error('JWT_ACCESS_SECRET is not set');
  }
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

const generateRefreshToken = (user) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not set');
  }
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

const verifyToken = (token, type = 'access') => {
  const secret = type === 'refresh' ? process.env.JWT_REFRESH_SECRET : process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error(`${type === 'refresh' ? 'JWT_REFRESH_SECRET' : 'JWT_ACCESS_SECRET'} is not set`);
  }
  return jwt.verify(token, secret);
};

export { generateAccessToken, generateRefreshToken, verifyToken };
