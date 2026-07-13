/**
 * Filter Service
 * Handles dynamic query building, filtering, and sorting for products
 * Supports: search, category, location, price range, brand, sort order
 */

import { Op } from 'sequelize';
import db from '../models/index.js';

const { Product, Category } = db;

/**
 * Build Sequelize where clause based on filter parameters
 */
const buildWhereClause = (filters = {}) => {
  const whereClause = {};

  const {
    search = '',
    categoryId = null,
    minPrice = null,
    maxPrice = null,
    location = null,
    brand = null,
  } = filters;

  // Search filter (name or description)
  if (search && search.trim()) {
    const searchTerm = `%${search.toLowerCase()}%`;
    whereClause[Op.or] = [
      { productName: { [Op.like]: searchTerm } },
      { productDescription: { [Op.like]: searchTerm } },
    ];
  }

  // Category filter
  if (categoryId && categoryId !== 'all') {
    whereClause.categoryId = Number(categoryId);
  }

  // Price range filter
  if (minPrice !== null || maxPrice !== null) {
    whereClause.productPrice = {};
    if (minPrice !== null) {
      whereClause.productPrice[Op.gte] = Number(minPrice);
    }
    if (maxPrice !== null) {
      whereClause.productPrice[Op.lte] = Number(maxPrice);
    }
  }

  // Location filter (if supported in future - currently stored in description or metadata)
  if (location && location !== 'all') {
    // TODO: Implement when location field is added to Product model
    // For now, can filter by location in productDescription
  }

  // Brand filter (if supported in future - currently stored in description or metadata)
  if (brand && brand !== 'all') {
    // TODO: Implement when brand field is added to Product model
    // For now, can filter by brand in productDescription
  }

  return Object.keys(whereClause).length > 0 ? whereClause : {};
};

/**
 * Apply sorting to the query
 */
const getOrderClause = (sortBy = 'newest') => {
  const sortMap = {
    newest: [['createAt', 'DESC']],
    'price-low': [['productPrice', 'ASC']],
    'price-high': [['productPrice', 'DESC']],
    'name-asc': [['productName', 'ASC']],
    'name-desc': [['productName', 'DESC']],
    'best-sellers': [['salesCount', 'DESC']],
    'trending': [['salesCount', 'DESC']],
  };

  return sortMap[sortBy] || sortMap.newest;
};

/**
 * Fetch filtered and sorted products from database
 * Supports mock mode fallback
 */
export const getFilteredProducts = async (filters = {}, pagination = {}) => {
  try {
    const { limit = 100, offset = 0 } = pagination;

    if (global.dbAvailable === false) {
      // Mock mode - return filtered mock data
      return getFilteredProductsMock(filters, pagination);
    }

    const whereClause = buildWhereClause(filters);
    const orderClause = getOrderClause(filters.sortBy);

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      include: [{ model: Category, attributes: ['categoryId', 'categoryName'] }],
      order: orderClause,
      limit: Number(limit),
      offset: Number(offset),
    });

    return {
      total: count,
      products: rows.map(toProductPayload),
      limit: Number(limit),
      offset: Number(offset),
    };
  } catch (error) {
    console.error('Error fetching filtered products:', error);
    throw error;
  }
};

/**
 * Mock mode - filter products from in-memory data
 */
const getFilteredProductsMock = (filters = {}, pagination = {}) => {
  const { mockProducts } = require('../data/mockData.js');
  const { limit = 100, offset = 0 } = pagination;

  const {
    search = '',
    categoryId = null,
    minPrice = null,
    maxPrice = null,
    location = null,
    brand = null,
    sortBy = 'newest',
  } = filters;

  let filtered = [...mockProducts];

  // Search
  if (search && search.trim()) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.productName || '').toLowerCase().includes(term) ||
        (p.productDescription || '').toLowerCase().includes(term) ||
        (p.name || '').toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term)
    );
  }

  // Category
  if (categoryId && categoryId !== 'all') {
    filtered = filtered.filter((p) => Number(p.categoryId) === Number(categoryId));
  }

  // Price range
  if (minPrice !== null) {
    const min = Number(minPrice);
    filtered = filtered.filter((p) => Number(p.productPrice || p.price) >= min);
  }
  if (maxPrice !== null) {
    const max = Number(maxPrice);
    filtered = filtered.filter((p) => Number(p.productPrice || p.price) <= max);
  }

  // Location filter (mock: check description)
  if (location && location !== 'all') {
    filtered = filtered.filter((p) => {
      const desc = (p.productDescription || p.description || '').toLowerCase();
      return desc.includes(location.toLowerCase());
    });
  }

  // Brand filter (mock: check description)
  if (brand && brand !== 'all') {
    filtered = filtered.filter((p) => {
      const desc = (p.productDescription || p.description || '').toLowerCase();
      return desc.includes(brand.toLowerCase());
    });
  }

  // Sort
  const sortMap = {
    newest: (a, b) => new Date(b.createAt) - new Date(a.createAt),
    'price-low': (a, b) => Number(a.productPrice || a.price) - Number(b.productPrice || b.price),
    'price-high': (a, b) => Number(b.productPrice || b.price) - Number(a.productPrice || a.price),
    'name-asc': (a, b) => (a.productName || a.name).localeCompare(b.productName || b.name),
    'name-desc': (a, b) => (b.productName || b.name).localeCompare(a.productName || a.name),
    'best-sellers': (a, b) => (b.salesCount || 0) - (a.salesCount || 0),
    'trending': (a, b) => (b.salesCount || 0) - (a.salesCount || 0),
  };

  if (sortMap[sortBy]) {
    filtered.sort(sortMap[sortBy]);
  }

  const total = filtered.length;
  const products = filtered.slice(offset, offset + limit);

  return {
    total,
    products: products.map(toProductPayload),
    limit,
    offset,
  };
};

/**
 * Convert product to frontend-friendly payload
 */
const toProductPayload = (product) => ({
  id: product.productId || product.id,
  name: product.productName || product.name,
  description: product.productDescription || product.description,
  price: Number(product.productPrice || product.price),
  categoryId: product.categoryId,
  category: product.Category
    ? { id: product.Category.categoryId, name: product.Category.categoryName }
    : null,
  slug: product.slug,
  isFeatured: Boolean(product.isFeatured),
  isBestSeller: Boolean(product.isBestSeller),
  isNewArrival: Boolean(product.isNewArrival),
  salesCount: Number(product.salesCount || 0),
  createdAt: product.createAt,
});

/**
 * Get distinct filter options from products
 */
export const getFilterOptions = async () => {
  try {
    if (global.dbAvailable === false) {
      return getFilterOptionsMock();
    }

    const products = await Product.findAll({
      attributes: ['productPrice'],
      raw: true,
    });

    const maxPrice = Math.max(...products.map((p) => Number(p.productPrice) || 0), 0);

    const priceRanges = [
      { value: 'all', label: 'Any price' },
      { value: 'under-25', label: 'Under $25', min: 0, max: 25 },
      { value: '25-50', label: '$25 - $50', min: 25, max: 50 },
      { value: '50-100', label: '$50 - $100', min: 50, max: 100 },
      { value: '100-plus', label: '$100+', min: 100, max: null },
    ].filter((range) => {
      if (range.value === 'all') return true;
      if (range.min && range.min > maxPrice) return false;
      if (range.max === null) return maxPrice > 100;
      return maxPrice >= range.min;
    });

    return {
      priceRanges,
      maxPrice,
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return { priceRanges: [], maxPrice: 0 };
  }
};

/**
 * Mock filter options
 */
const getFilterOptionsMock = () => {
  const { mockProducts } = require('../data/mockData.js');

  const prices = mockProducts.map((p) => Number(p.productPrice || p.price) || 0);
  const maxPrice = Math.max(...prices, 0);

  const priceRanges = [
    { value: 'all', label: 'Any price' },
    { value: 'under-25', label: 'Under $25', min: 0, max: 25 },
    { value: '25-50', label: '$25 - $50', min: 25, max: 50 },
    { value: '50-100', label: '$50 - $100', min: 50, max: 100 },
    { value: '100-plus', label: '$100+', min: 100, max: null },
  ].filter((range) => {
    if (range.value === 'all') return true;
    if (range.min && range.min > maxPrice) return false;
    if (range.max === null) return maxPrice > 100;
    return maxPrice >= range.min;
  });

  return {
    priceRanges,
    maxPrice,
  };
};

export default {
  buildWhereClause,
  getOrderClause,
  getFilteredProducts,
  getFilterOptions,
  toProductPayload,
};
