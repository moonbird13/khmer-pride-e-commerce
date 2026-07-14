import test from 'node:test';
import assert from 'node:assert/strict';
import { getUserCart, createOrder as createMockOrder, getUserOrders, getOrderById as getMockOrderById } from '../src/data/mockData.js';

test('cart service can add and retrieve items', async () => {
  const userId = 1;
  const cart = getUserCart(userId);
  cart.items = [];
  cart.items.push({ productId: 1, quantity: 2 });

  const loaded = getUserCart(userId);
  assert.equal(loaded.items.length, 1);
  assert.equal(loaded.items[0].quantity, 2);
});

test('order service can create and list orders', async () => {
  const userId = 1;
  const order = createMockOrder(userId, { items: [{ productId: 1, quantity: 2 }], total: 48 });
  const orders = getUserOrders(userId);
  const found = getMockOrderById(order.orderId);

  assert.equal(order.total, 48);
  assert.equal(orders.length > 0, true);
  assert.equal(found?.orderId, order.orderId);
});
