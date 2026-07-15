import test from 'node:test';
import assert from 'node:assert/strict';
import * as authService from '../src/services/authService.js';
import * as categoryService from '../src/services/categoryService.js';
import * as productService from '../src/services/productService.js';
import * as cartService from '../src/services/cartService.js';
import * as orderService from '../src/services/orderService.js';
import filterService from '../src/services/filterService.js';
import addressRepository from '../src/repository/address.repository.js';
import userRepository from '../src/repository/user.repository.js';
import categoryRepository from '../src/repository/category.repository.js';
import productRepository from '../src/repository/product.repository.js';
import db from '../src/config/database.js';
import models from '../src/models/index.js';

const uniqueId = Date.now();
const testEmail = `real-db-test-${uniqueId}@example.com`;
const testCategoryName = `Test Category ${uniqueId}`;
const testProductName = `Test Product ${uniqueId}`;

let createdUser = null;
let createdCategory = null;
let createdProduct = null;
let createdAddress = null;
let createdOrder = null;
let createdOrderToCancel = null;
let accessToken = null;
let refreshToken = null;

async function cleanup() {
  if (createdOrderToCancel) {
    await orderService.cancelOrder(createdOrderToCancel.id).catch(() => {});
  }
  if (createdOrder) {
    const orderRecord = await models.Order.findByPk(createdOrder.id).catch(() => null);
    if (orderRecord) {
      await models.Order_detail.destroy({ where: { orderId: orderRecord.orderId } }).catch(() => {});
      await orderRecord.destroy().catch(() => {});
    }
  }
  if (createdAddress) {
    await models.Address.destroy({ where: { addressId: createdAddress.addressId } }).catch(() => {});
  }
  if (createdProduct) {
    await models.Product.destroy({ where: { productId: createdProduct.id } }).catch(() => {});
  }
  if (createdCategory) {
    await models.Category.destroy({ where: { categoryId: createdCategory.id } }).catch(() => {});
  }
  if (createdUser) {
    await userRepository.deleteUser(createdUser.id).catch(() => {});
  }
}

test('real Aiven DB integration test for service logic', async (t) => {
  await t.test('authenticate database connection', async () => {
    await db.authenticate();
  });

  await t.test('authService register/login/refresh/verify/reset/change password flow', async () => {
    const registerRes = await authService.register({
      fullName: 'Real DB User',
      email: testEmail,
      password: 'Test123!@#',
      phone: '0123456789'
    });

    assert.equal(registerRes.message, 'Registration successful. Please verify your email.');
    assert.equal(registerRes.user.id, registerRes.user.id);
    createdUser = registerRes.user;

    const loginRes = await authService.login({ email: testEmail, password: 'Test123!@#' });
    assert.equal(loginRes.message, 'Login successful.');
    assert.ok(loginRes.accessToken);
    assert.ok(loginRes.refreshToken);
    accessToken = loginRes.accessToken;
    refreshToken = loginRes.refreshToken;

    const refreshRes = await authService.refreshAccessToken({ refreshToken });
    assert.equal(refreshRes.message, 'Access token refreshed.');
    assert.ok(refreshRes.accessToken);

    const verifyRes = await authService.verifyEmail({ token: registerRes.verificationToken });
    assert.equal(verifyRes.message, 'Email verified successfully.');

    const forgotRes = await authService.forgotPassword({ email: testEmail });
    assert.equal(forgotRes.message, 'Password reset instructions sent.');
    assert.ok(forgotRes.resetToken);

    const resetRes = await authService.resetPassword({ token: forgotRes.resetToken, newPassword: 'NewPass123!' });
    assert.equal(resetRes.message, 'Password reset successful.');

    const changeRes = await authService.changePassword({ userId: createdUser.id, currentPassword: 'NewPass123!', newPassword: 'NewPass456!' });
    assert.equal(changeRes.message, 'Password changed successfully.');

    const secondLogin = await authService.login({ email: testEmail, password: 'NewPass456!' });
    assert.equal(secondLogin.message, 'Login successful.');

    const logoutRes = await authService.logout({ refreshToken });
    assert.equal(logoutRes.message, 'Logged out.');
  });

  await t.test('categoryService create/list/get by id', async () => {
    const created = await categoryService.createCategory({ categoryName: testCategoryName });
    assert.equal(created.name, testCategoryName);

    const categories = await categoryService.listCategories();
    assert.ok(Array.isArray(categories));
    createdCategory = categories.find((cat) => cat.name === testCategoryName);
    assert.ok(createdCategory);

    const found = await categoryService.getCategoryById(createdCategory.id);
    assert.equal(found.name, testCategoryName);
  });

  await t.test('productService create/list/get/search', async () => {
    const productData = {
      productName: testProductName,
      productDescription: 'Integration product test',
      productPrice: 15.5,
      categoryId: createdCategory.id,
      slug: `test-product-${uniqueId}`,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      salesCount: 0
    };

    const created = await productService.createProduct(productData);
    assert.equal(created.name, testProductName);
    createdProduct = created;

    const list = await productService.listProducts();
    assert.ok(Array.isArray(list));
    assert.ok(list.some((item) => item.id === createdProduct.id));

    const found = await productService.getProductById(createdProduct.id);
    assert.equal(found.name, testProductName);

    const searched = await productService.searchProducts(testProductName);
    assert.ok(Array.isArray(searched));
    assert.ok(searched.some((item) => item.id === createdProduct.id));
  });

  await t.test('filterService getFilteredProducts and getFilterOptions', async () => {
    const filtered = await filterService.getFilteredProducts({ search: testProductName, categoryId: createdCategory.id }, { limit: 10, offset: 0 });
    assert.ok(filtered.products.some((item) => item.id === createdProduct.id));

    const options = await filterService.getFilterOptions();
    assert.ok(Array.isArray(options.priceRanges));
    assert.ok(typeof options.maxPrice === 'number');
  });

  await t.test('cartService add/update/remove/clear cart', async () => {
    const cartEmpty = await cartService.getCart(createdUser.id);
    assert.ok(Array.isArray(cartEmpty.items));

    await cartService.addToCart({ userId: createdUser.id, productId: createdProduct.id, quantity: 2 });
    let cart = await cartService.getCart(createdUser.id);
    assert.equal(cart.items[0].quantity, 2);

    await cartService.updateQuantity({ userId: createdUser.id, productId: createdProduct.id, quantity: 3 });
    cart = await cartService.getCart(createdUser.id);
    assert.equal(cart.items[0].quantity, 3);

    await cartService.removeCartItem({ userId: createdUser.id, productId: createdProduct.id });
    cart = await cartService.getCart(createdUser.id);
    assert.equal(cart.items.length, 0);

    await cartService.addToCart({ userId: createdUser.id, productId: createdProduct.id, quantity: 1 });
    const cleared = await cartService.clearCart(createdUser.id);
    assert.equal(cleared.items.length, 0);
  });

  await t.test('orderService create/list/get/cancel/update', async () => {
    createdAddress = await addressRepository.createAddress({
      userId: createdUser.id,
      street: 'Test street',
      houseNumber: '1',
      commune: 'Test commune',
      district: 'Test district',
      province: 'Test province'
    });

    const orderResult = await orderService.createOrder({
      userId: createdUser.id,
      addressId: createdAddress.addressId,
      items: [{ productId: createdProduct.id, quantity: 1, price: createdProduct.price }],
      paymentMethod: 'card'
    });
    assert.equal(orderResult.status, 'Pending');
    createdOrder = orderResult;

    const fetchedList = await orderService.listOrders(createdUser.id);
    assert.ok(Array.isArray(fetchedList));
    assert.ok(fetchedList.some((item) => item.id === createdOrder.id));

    const fetchedOne = await orderService.getOrder(createdOrder.id);
    assert.equal(fetchedOne.id, createdOrder.id);

    createdOrderToCancel = await orderService.createOrder({
      userId: createdUser.id,
      addressId: createdAddress.addressId,
      items: [{ productId: createdProduct.id, quantity: 1, price: createdProduct.price }],
      paymentMethod: 'card'
    });
    const cancelled = await orderService.cancelOrder(createdOrderToCancel.id);
    assert.equal(cancelled.status, 'Cancelled');

    const updated = await orderService.updateOrderStatus(createdOrder.id, 'Completed');
    assert.equal(updated.status, 'Completed');
  });

  await t.test('cleanup created database records', async () => {
    await cleanup();
  });
});
