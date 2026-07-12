import { Op } from 'sequelize';
import db from '../models/index.js';
import {
  mockProducts,
  getProductById as getMockProductById,
  getProductsByCategory as getMockProductsByCategory,
  searchProducts as searchMockProducts,
  getFeaturedProducts as getMockFeaturedProducts,
  getNewArrivals as getMockNewArrivals,
} from '../data/mockData.js';

const { Product, Category } = db;

const toProductPayload = (product) => ({
  id: product.productId,
  name: product.productName,
  description: product.productDescription,
  price: Number(product.productPrice),
  categoryId: product.categoryId,
  category: product.Category ? { id: product.Category.categoryId, name: product.Category.categoryName } : null,
  slug: product.slug,
  isFeatured: Boolean(product.isFeatured),
  isBestSeller: Boolean(product.isBestSeller),
  isNewArrival: Boolean(product.isNewArrival),
  salesCount: Number(product.salesCount || 0),
  createdAt: product.createAt,
});

const createProduct = async ({
  productName,
  productPrice,
  productDescription = '',
  categoryId,
  slug,
  isFeatured = false,
  isBestSeller = false,
  isNewArrival = false,
}) => {
  // Mock mode: generate new ID
  if (global.dbAvailable === false) {
    const newProduct = {
      productId: mockProducts.length + 1,
      id: mockProducts.length + 1,
      productName,
      name: productName,
      productPrice: Number(productPrice),
      price: Number(productPrice),
      productDescription,
      description: productDescription,
      categoryId: Number(categoryId),
      slug,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: Boolean(isNewArrival),
      salesCount: 0,
      createAt: new Date(),
      Category: null,
    };
    mockProducts.push(newProduct);
    return toProductPayload(newProduct);
  }

  const product = await Product.create({
    productName,
    productPrice: Number(productPrice),
    productDescription,
    categoryId: Number(categoryId),
    slug,
    isFeatured: Boolean(isFeatured),
    isBestSeller: Boolean(isBestSeller),
    isNewArrival: Boolean(isNewArrival),
    createAt: new Date(),
  });

  return toProductPayload(product);
};

const listProducts = async () => {
  if (global.dbAvailable === false) {
    return mockProducts.map(toProductPayload);
  }

  const products = await Product.findAll({
    include: [{ model: Category, attributes: ['categoryId', 'categoryName'] }],
    order: [['productId', 'ASC']],
  });

  return products.map(toProductPayload);
};

const getProductById = async (id) => {
  if (global.dbAvailable === false) {
    const product = getMockProductById(id);
    return product ? toProductPayload(product) : null;
  }

  const product = await Product.findByPk(Number(id), {
    include: [{ model: Category, attributes: ['categoryId', 'categoryName'] }],
  });

  if (!product) return null;
  return toProductPayload(product);
};

const searchProducts = async (query) => {
  if (global.dbAvailable === false) {
    const results = searchMockProducts(query);
    return results.map(toProductPayload);
  }

  if (!query) return listProducts();

  const normalized = query.toLowerCase();
  const products = await Product.findAll({
    where: {
      [Op.or]: [
        { productName: { [Op.like]: `%${normalized}%` } },
        { productDescription: { [Op.like]: `%${normalized}%` } },
      ],
    },
    include: [{ model: Category, attributes: ['categoryId', 'categoryName'] }],
  });

  return products.map(toProductPayload);
};

const getProductsByCategory = async (categoryId) => {
  if (global.dbAvailable === false) {
    const results = getMockProductsByCategory(categoryId);
    return results.map(toProductPayload);
  }

  const products = await Product.findAll({
    where: { categoryId: Number(categoryId) },
    include: [{ model: Category, attributes: ['categoryId', 'categoryName'] }],
  });

  return products.map(toProductPayload);
};

const getFeaturedProducts = async () => {
  if (global.dbAvailable === false) {
    const featured = getMockFeaturedProducts();
    return featured.map(toProductPayload);
  }

  const featured = await Product.findAll({
    where: { isFeatured: true },
    include: [{ model: Category, attributes: ['categoryId', 'categoryName'] }],
    limit: 6,
    order: [['productId', 'ASC']],
  });

  return featured.length ? featured.map(toProductPayload) : (await listProducts()).slice(0, 6);
};

const getNewArrivals = async () => {
  if (global.dbAvailable === false) {
    const products = getMockNewArrivals();
    return products.map(toProductPayload);
  }

  const products = await Product.findAll({
    include: [{ model: Category, attributes: ['categoryId', 'categoryName'] }],
    order: [['createAt', 'DESC']],
    limit: 6,
  });

  return products.map(toProductPayload);
};

const getBestSellers = async () => {
  const products = await Product.findAll({
    include: [{ model: Category, attributes: ['categoryId', 'categoryName'] }],
    order: [['salesCount', 'DESC']],
    limit: 6,
  });

  return products.map(toProductPayload);
};

const incrementProductSales = async (productId, quantity = 1) => {
  const product = await Product.findByPk(Number(productId));
  if (!product) return null;

  product.salesCount = (product.salesCount || 0) + Number(quantity);
  await product.save();
  return toProductPayload(product);
};

export {
  createProduct,
  listProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  incrementProductSales,
};
