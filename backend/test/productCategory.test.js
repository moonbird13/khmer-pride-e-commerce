import test from 'node:test';
import assert from 'node:assert/strict';
import { createCategory, listCategories, getCategoryById } from '../src/services/categoryService.js'; 
import { createProduct, listProducts, getProductById,} from '../src/services/productService.js';

test('category service can create and list categories', async () => {
  const category = await createCategory({ categoryName: 'Textiles', categoryStatus: 'Active' });
  const categories = await listCategories();
  const found = await getCategoryById(category.id);

  assert.equal(category.name, 'Textiles');
  assert.equal(category.status, 'Active');
  assert.equal(categories.length > 0, true);
  assert.equal(found?.name, 'Textiles');
});

test('product service can create and retrieve products', async () => {
  const category = await createCategory({ categoryName: 'Crafts', categoryStatus: 'Active' });
  const product = await createProduct({
    productName: 'Silk Scarf',
    productPrice: 24,
    productDescription: 'Traditional Khmer silk scarf',
    categoryId: category.id,
    slug: 'silk-scarf',
  });

  const products = await listProducts();
  const found = await getProductById(product.id);

  assert.equal(product.name, 'Silk Scarf');
  assert.equal(product.price, 24);
  assert.equal(products.length > 0, true);
  assert.equal(found?.name, 'Silk Scarf');
});
