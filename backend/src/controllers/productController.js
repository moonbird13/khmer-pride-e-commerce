import { createProduct, listProducts, getProductById } from '../services/productService.js';
import { createCategory, listCategories, getCategoryById } from '../services/categoryService.js';

const createCategoryHandler = (req, res) => {
  const category = createCategory(req.body);
  res.status(201).json(category);
};

const listCategoriesHandler = (req, res) => {
  res.json(listCategories());
};

const getCategoryByIdHandler = (req, res) => {
  const category = getCategoryById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }
  return res.json(category);
};

const createProductHandler = (req, res) => {
  const product = createProduct(req.body);
  res.status(201).json(product);
};

const listProductsHandler = (req, res) => {
  res.json(listProducts());
};

const getProductByIdHandler = (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }
  return res.json(product);
};

export {
  createCategoryHandler,
  listCategoriesHandler,
  getCategoryByIdHandler,
  createProductHandler,
  listProductsHandler,
  getProductByIdHandler,
};
