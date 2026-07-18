import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import User from '../src/models/User.js';
import { createCategory } from '../src/services/categoryService.js';
import { createProduct } from '../src/services/productService.js';
import { addToCart, getCart, removeCartItem, clearCart, updateQuantity } from '../src/services/cartService.js';
import { createOrder } from '../src/services/orderService.js';
import Address from '../src/models/Address.js';
import Order from '../src/models/Order.js';

const createFixtureUser = async (prefix) => {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000000)}`;
  const phoneTail = `${Math.floor(Math.random() * 900000000) + 100000000}`;
  return User.create({
    fullName: `${prefix} User`,
    email: `${prefix.toLowerCase()}-${suffix}@example.com`,
    phone: `+855${phoneTail}`,
    password: await bcrypt.hash('secret123', 10),
    role: 'customer',
    isVerified: true,
  });
};

test('cart service can add, update, and remove items', async () => {
  const user = await createFixtureUser('CartAdd');
  const category = await createCategory({ categoryName: `Test Category ${Date.now()}` });
  const product = await createProduct({
    productName: 'Test Product',
    productPrice: 10,
    productDescription: 'Test product',
    categoryId: category.id,
    slug: `test-product-${Date.now()}`,
  });

  await addToCart({ userId: user.userId, productId: product.id, quantity: 2 });
  await updateQuantity({ userId: user.userId, productId: product.id, quantity: 3 });

  const loaded = await getCart(user.userId);
  assert.equal(loaded.items.length, 1);
  assert.equal(loaded.items[0].quantity, 3);

  await removeCartItem({ userId: user.userId, productId: product.id });
  const afterRemove = await getCart(user.userId);
  assert.equal(afterRemove.items.length, 0);
});

test('cart service can clear cart', async () => {
  const user = await createFixtureUser('CartClear');
  const category = await createCategory({ categoryName: `Test Category ${Date.now()}` });
  const product = await createProduct({
    productName: 'Test Product',
    productPrice: 8,
    productDescription: 'Test product',
    categoryId: category.id,
    slug: `test-product-${Date.now()}`,
  });

  await addToCart({ userId: user.userId, productId: product.id, quantity: 1 });
  await clearCart(user.userId);
  const loaded = await getCart(user.userId);

  assert.equal(loaded.items.length, 0);
});

test('checkout creates an order with payment details', async () => {
  const user = await createFixtureUser('Checkout');
  const category = await createCategory({ categoryName: `Checkout Category ${Date.now()}` });
  const product = await createProduct({
    productName: 'Checkout Product',
    productPrice: 15,
    productDescription: 'Checkout test product',
    categoryId: category.id,
    slug: `checkout-product-${Date.now()}`,
  });

  const address = await Address.create({
    userId: user.userId,
    houseNumber: '12A',
    street: 'Monivong',
    commune: 'Sangkat 1',
    district: 'Daun Penh',
    province: 'Phnom Penh',
  });

  const order = await createOrder({
    userId: user.userId,
    addressId: address.addressId,
    items: [{ productId: product.id, price: 15, quantity: 2 }],
    paymentMethod: 'Cash on Delivery',
  });

  const savedOrder = await Order.findByPk(order.id);

  assert.equal(order.paymentMethod, 'Cash on Delivery');
  assert.equal(order.paymentStatus, 'Unpaid');
  assert.equal(savedOrder.paymentMethod, 'Cash on Delivery');
  assert.equal(savedOrder.paymentStatus, 'Unpaid');
});
