import test from 'node:test';
import assert from 'node:assert/strict';
import { createCategory, listCategories } from '../src/services/categoryService.js';
import { createProduct, listProducts, getProductById } from '../src/services/productService.js';

test('category service can create and list categories', () => {
  const category = createCategory({ name: 'Textiles', description: 'Handmade fabrics' });
  const categories = listCategories();

  assert.equal(category.name, 'Textiles');
  assert.equal(categories.length > 0, true);
});

test('product service can create and retrieve products', () => {
  const product = createProduct({
    name: 'Silk Scarf',
    price: 24,
    description: 'Traditional Khmer silk scarf',
    categoryId: 1,
  });

  const products = listProducts();
  const found = getProductById(product.id);

  assert.equal(product.name, 'Silk Scarf');
  assert.equal(products.length > 0, true);
  assert.equal(found?.name, 'Silk Scarf');
});
