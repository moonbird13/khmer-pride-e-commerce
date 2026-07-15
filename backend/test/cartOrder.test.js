import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import User from '../src/models/User.js';
import { createCategory } from '../src/services/categoryService.js';
import { createProduct } from '../src/services/productService.js';
import { addToCart, getCart, removeCartItem, clearCart, updateQuantity } from '../src/services/cartService.js';

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
  const category = await createCategory({ categoryName: `Cart Category ${Date.now()}` });
  const product = await createProduct({
    productName: 'Cart Test Product',
    productPrice: 10,
    productDescription: 'Cart service test product',
    categoryId: category.id,
    slug: `cart-test-product-${Date.now()}`,
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
  const category = await createCategory({ categoryName: `Clear Category ${Date.now()}` });
  const product = await createProduct({
    productName: 'Clear Cart Product',
    productPrice: 8,
    productDescription: 'Cart clear test product',
    categoryId: category.id,
    slug: `clear-cart-product-${Date.now()}`,
  });

  await addToCart({ userId: user.userId, productId: product.id, quantity: 1 });
  await clearCart(user.userId);
  const loaded = await getCart(user.userId);

  assert.equal(loaded.items.length, 0);
});
