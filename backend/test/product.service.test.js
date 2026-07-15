
import test from 'node:test';
import assert from 'node:assert/strict';
import { createProduct } from '../src/services/productService.js';

test('createProduct throws when price is zero or negative', async () => {
  await assert.rejects(
    async () => {
      await createProduct({ productPrice: -5, productName: 'x' });
    },
    (err) => {
      assert.ok(err instanceof Error);
      assert.equal(err.message, 'Product price must be greater than zero');
      return true;
    }
  );
});
