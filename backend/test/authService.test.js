import test from 'node:test';
import assert from 'node:assert/strict';
import {
  register,
  login,
  refreshAccessToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../src/services/authService.js';

const resetMemoryState = () => {
  global.dbAvailable = false;
  global.memoryUsers = [];
};

test('register creates a user with a verification token and an unverified state', async () => {
  resetMemoryState();

  const result = await register({
    fullName: 'Alice Example',
    email: 'alice@example.com',
    password: 'secret123',
  });

  assert.equal(result.user.email, 'alice@example.com');
  assert.equal(result.user.fullName, 'Alice Example');
  assert.equal(result.message.includes('Please verify your email'), true);
  assert.equal(global.memoryUsers[0].isVerified, false);
  assert.ok(result.message.includes('Please verify your email'));
});

test('login and refresh flows issue tokens and allow password reset', async () => {
  resetMemoryState();

  await register({ fullName: 'Bob Example', email: 'bob@example.com', password: 'secret123' });

  const loginResult = await login({ email: 'bob@example.com', password: 'secret123' });
  assert.ok(loginResult.accessToken);
  assert.ok(loginResult.refreshToken);
  assert.equal(loginResult.user.email, 'bob@example.com');

  const refreshResult = await refreshAccessToken({ refreshToken: loginResult.refreshToken });
  assert.ok(refreshResult.accessToken);

  const verifyResult = await verifyEmail({ token: global.memoryUsers[0].verificationToken || '' });
  assert.equal(verifyResult.message, 'Email verified successfully.');

  const forgotResult = await forgotPassword({ email: 'bob@example.com' });
  assert.equal(forgotResult.message, 'Password reset instructions sent.');

  const resetResult = await resetPassword({
    token: forgotResult.resetToken,
    newPassword: 'newSecret123',
  });
  assert.equal(resetResult.message, 'Password reset successful.');

  const changeResult = await changePassword({
    userId: global.memoryUsers[0].id,
    currentPassword: 'newSecret123',
    newPassword: 'updatedSecret123',
  });
  assert.equal(changeResult.message, 'Password changed successfully.');
});
