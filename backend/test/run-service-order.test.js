import test from 'node:test';
import assert from 'node:assert/strict';
import orderService from '../src/services/orderService.js';

// Simple smoke test for orderService.formatOrder
// This test does not call DB; it verifies the formatter and exported functions exist.

test('orderService.formatOrder returns formatted object', (t) => {
  const sample = {
    orderId: 123,
    userId: 5,
    totalAmount: '150.00',
    orderStatus: 'Pending',
    orderDate: '2026-07-15T00:00:00Z'
  };

  const result = orderService.formatOrder(sample, [ { productId: 1, quantity: 2 } ]);

  assert.equal(result.id, 123);
  assert.equal(result.userId, 5);
  assert.equal(result.total, 150);
  assert.equal(result.status, 'Pending');
  assert.ok(Array.isArray(result.items));
});
