import test from 'node:test';
import assert from 'node:assert/strict';
import * as productService from '../src/services/productService.js';
import * as categoryService from '../src/services/categoryService.js';
import db from '../src/config/database.js';
import models from '../src/models/index.js';

const uniqueId = Date.now();
const testCategoryName = `ProductTest Category ${uniqueId}`;
const testProductName = `ProductTest Product ${uniqueId}`;

let createdCategory = null;
let createdProduct = null;

async function cleanup() {
  if (createdProduct) {
    await models.Product.destroy({ where: { productId: createdProduct.id } }).catch(() => {});
    createdProduct = null;
  }
  if (createdCategory) {
    await models.Category.destroy({ where: { categoryId: createdCategory.id } }).catch(() => {});
    createdCategory = null;
  }
}

test('productService create/list/get/search (integration)', async (t) => {
  await t.test('authenticate database connection', async () => {
    await db.authenticate();
  });

  await t.test('create category and product', async () => {
    const created = await categoryService.createCategory({ categoryName: testCategoryName });
    assert.equal(created.name, testCategoryName);
    const categories = await categoryService.listCategories();
    createdCategory = categories.find((c) => c.name === testCategoryName);
    assert.ok(createdCategory);

    const productData = {
      productName: testProductName,
      productDescription: 'Integration product test for product functions',
      productPrice: 9.99,
      categoryId: createdCategory.id,
      slug: `product-test-${uniqueId}`,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      salesCount: 0
    };

    const createdProd = await productService.createProduct(productData);
    assert.equal(createdProd.name, testProductName);
    createdProduct = createdProd;
  });

  await t.test('listProducts contains created product', async () => {
    const list = await productService.listProducts();
    assert.ok(Array.isArray(list));
    assert.ok(list.some((p) => p.id === createdProduct.id));
  });

  await t.test('getProductById returns the product', async () => {
    const found = await productService.getProductById(createdProduct.id);
    assert.equal(found.name, testProductName);
  });

  await t.test('searchProducts returns the product by name', async () => {
    const searched = await productService.searchProducts(testProductName);
    assert.ok(Array.isArray(searched));
    assert.ok(searched.some((p) => p.id === createdProduct.id));
  });

  await t.test('cleanup created records', async () => {
    await cleanup();
  });
});
