import test from 'node:test';
import assert from 'node:assert/strict';

import { filterProducts, getFilterOptions } from './productFilters.mjs';

const sampleProducts = [
  {
    id: '1',
    name: 'Silk Tote',
    description: 'Hand-woven tote',
    price: 42,
    categoryId: 3,
    category: 'clothing',
    location: 'Phnom Penh',
    brand: 'Khmer House',
  },
  {
    id: '2',
    name: 'Ceramic Set',
    description: 'Elegant tableware',
    price: 36,
    categoryId: 5,
    category: 'souvenirs',
    location: 'Siem Reap',
    brand: 'River & Clay',
  },
  {
    id: '3',
    name: 'Herbal Blend',
    description: 'Soothing herbal tea',
    price: 19,
    categoryId: 1,
    category: 'food',
    location: 'Battambang',
    brand: 'Mekong Herbs',
  },
];

test('filters products across search, category, location, price, brand, and sorting', () => {
  const result = filterProducts(sampleProducts, {
    search: 'tea',
    selectedCategory: '1',
    location: 'Battambang',
    priceRange: 'under-25',
    brand: 'Mekong Herbs',
    sortBy: 'price-low',
  });

  assert.deepEqual(result.map((product) => product.id), ['3']);
});

test('builds filter options from product data', () => {
  const options = getFilterOptions(sampleProducts);

  assert.deepEqual(options.locations, ['Battambang', 'Phnom Penh', 'Siem Reap']);
  assert.deepEqual(options.brands, ['Khmer House', 'Mekong Herbs', 'River & Clay']);
  assert.equal(options.priceRanges[0].value, 'all');
  assert.equal(options.priceRanges.at(-1).value, '40-plus');
});
