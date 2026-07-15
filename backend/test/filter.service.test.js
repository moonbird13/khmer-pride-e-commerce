import test from 'node:test';
import assert from 'node:assert/strict';
import filterService from '../src/services/filterService.js';

test('buildWhereClause with empty filters returns empty object', () => {
  const where = filterService.buildWhereClause({});
  assert.deepEqual(where, {});
});

test('buildWhereClause creates category and price filters', () => {
  const where = filterService.buildWhereClause({ categoryId: '5', minPrice: '10', maxPrice: '50', search: '' });
  assert.equal(where.categoryId, 5);
  // productPrice uses symbol keys (Sequelize Op symbols) — ensure property exists and has symbol keys
  assert.ok('productPrice' in where);
  const symbols = Object.getOwnPropertySymbols(where.productPrice || {});
  assert.ok(symbols.length > 0);
});

test('getOrderClause returns expected sort mapping', () => {
  const order = filterService.getOrderClause('price-low');
  assert.ok(Array.isArray(order));
  assert.equal(order[0][0], 'productPrice');
});

// Note: getFilterOptions uses `require` inside the module when running mock mode
// which is not available under ESM test runner; skip direct invocation here.
