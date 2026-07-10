import test from 'node:test';
import assert from 'node:assert/strict';
import { addToCart, getCart, clearCart } from '../src/services/cartService.js';
import { createOrder, getOrderById, listOrders } from '../src/services/orderService.js';

test('cart service can add and retrieve items', () => {
  clearCart();
  addToCart({ productId: 1, quantity: 2 });
  const cart = getCart();

  assert.equal(cart.items.length, 1);
  assert.equal(cart.items[0].quantity, 2);
});

test('order service can create and list orders', () => {
  const order = createOrder({ userId: 1, items: [{ productId: 1, quantity: 2 }], total: 48 });
  const orders = listOrders();
  const found = getOrderById(order.id);

  assert.equal(order.total, 48);
  assert.equal(orders.length > 0, true);
  assert.equal(found?.id, order.id);
});
