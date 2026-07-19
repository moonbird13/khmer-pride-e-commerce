import test from 'node:test';
import assert from 'node:assert/strict';
import db from '../src/models/index.js';

process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'test-access-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

const { register, login, refreshAccessToken, verifyEmail, changePassword } = await import('../src/services/authService.js');

test.before(async () => {
  await db.sequelize.sync({ alter: true });
});

const resetTestState = () => {
  // No-op placeholder: tests use repository/database implementations only.
};

const createTestUser = (prefix) => {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;
  const phoneTail = `${Math.floor(Math.random() * 900000000) + 100000000}`;
  return {
    fullName: `${prefix} Example`,
    email: `${prefix.toLowerCase()}${suffix}@example.com`,
    password: 'secret123',
    phone: `+855${phoneTail}`,
  };
};

test('register creates an unverified user and returns a friendly message', async () => {
  resetTestState();

  const result = await register(createTestUser('Alice'));

  assert.equal(result.user.isVerified, false);
  assert.match(result.message, /verify your email/i);
  assert.ok(result.verificationToken);
});

test('login, refresh, verify, and change password all work against the database', async () => {
  resetTestState();

  const testUser = createTestUser('Bob');
  const registrationResult = await register(testUser);

  const loginResult = await login({ email: testUser.email, password: testUser.password });
  assert.ok(loginResult.accessToken);
  assert.ok(loginResult.refreshToken);
  assert.equal(loginResult.user.email, testUser.email);

  const refreshResult = await refreshAccessToken({ refreshToken: loginResult.refreshToken });
  assert.ok(refreshResult.accessToken);

  const verifyResult = await verifyEmail({ token: registrationResult.verificationToken });
  assert.equal(verifyResult.message, 'Email verified successfully.');

  const changeResult = await changePassword({
    userId: loginResult.user.id,
    role: 'customer',
    currentPassword: 'secret123',
    newPassword: 'UpdatedSecret123!',
  });
  assert.equal(changeResult.message, 'Password updated successfully.');
});
