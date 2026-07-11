import { createProduct, listProducts, getProductById } from '../services/productService.js';
import { createCategory, listCategories, getCategoryById } from '../services/categoryService.js';

const createCategoryHandler = async (req, res) => {
  try {
    const category = await createCategory(req.body);
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to create category.' });
  }
};

const listCategoriesHandler = async (req, res) => {
  try {
    const categories = await listCategories();
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load categories.' });
  }
};

const getCategoryByIdHandler = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load category.' });
  }
};

const createProductHandler = async (req, res) => {
  try {
    const product = await createProduct(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to create product.' });
  }
};

const listProductsHandler = async (req, res) => {
  try {
    const products = await listProducts();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load products.' });
  }
};

const getProductByIdHandler = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load product.' });
  }
};

export {
  createCategoryHandler,
  listCategoriesHandler,
  getCategoryByIdHandler,
  createProductHandler,
  listProductsHandler,
  getProductByIdHandler,
};
