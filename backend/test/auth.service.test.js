import test from 'node:test';
import assert from 'node:assert/strict';
import * as authService from '../src/services/authService.js';

test('register throws when required fields missing', async () => {
  await assert.rejects(async () => {
    await authService.register({ fullName: '', email: '', password: '' });
  }, (err) => {
    assert.ok(err instanceof Error);
    assert.equal(err.status, 400);
    return true;
  });
});

test('login throws when missing credentials', async () => {
  await assert.rejects(async () => {
    await authService.login({ email: '', password: '' });
  }, (err) => {
    assert.ok(err instanceof Error);
    assert.equal(err.status, 400);
    return true;
  });
});
