import test from 'node:test';
import assert from 'node:assert/strict';
import { createCategory, listCategories } from '../src/services/categoryService.js';
import { createProduct, listProducts, getProductById } from '../src/services/productService.js';

test('category service can create and list categories', () => {
  const category = createCategory({ categoryName: 'Textiles', categoryStatus: 'Active' });
  const categories = listCategories();

  assert.equal(category.categoryName, 'Textiles');
  assert.equal(category.categoryStatus, 'Active');
  assert.equal(categories.length > 0, true);
});

test('product service can create and retrieve products', () => {
  const product = createProduct({
    productName: 'Silk Scarf',
    productPrice: 24,
    productDescription: 'Traditional Khmer silk scarf',
    categoryId: 1,
    slug: 'silk-scarf',
  });

  const products = listProducts();
  const found = getProductById(product.productId);

  assert.equal(product.productName, 'Silk Scarf');
  assert.equal(product.productPrice, 24);
  assert.equal(products.length > 0, true);
  assert.equal(found?.productName, 'Silk Scarf');
});
