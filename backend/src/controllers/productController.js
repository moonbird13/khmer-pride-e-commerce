import {
  createProduct,
  listProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getNewArrivals,
  updateProduct,
  deleteProduct,
} from '../services/productService.js';
import { getFilteredProducts, getFilterOptions } from '../services/filterService.js';
import { createCategory, listCategories, getCategoryById } from '../services/categoryService.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';

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

        let imageUrl = null;
        let publicId = null;

        if (req.file) {

            const result = await uploadToCloudinary(
                req.file.buffer,
                "products"
            );

            imageUrl = result.secure_url;
            publicId = result.public_id;
        }

        const product = await createProduct({

            ...req.body,

            imageUrl,
            publicId,

        });

        return res.status(201).json(product);

    } catch (error) {

        return res.status(500).json({
            message:error.message
        });

    }
};

const listProductsHandler = async (req, res) => {
  try {
    const {
      search = '',
      categoryId = null,
      location = null,
      minPrice = null,
      maxPrice = null,
      brand = null,
      sortBy = 'newest',
      limit = 100,
      offset = 0,
    } = req.query;

    // Build filter object
    const filters = {
      search,
      categoryId: categoryId || null,
      location: location || null,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      brand: brand || null,
      sortBy,
    };

    // Fetch filtered products
    const result = await getFilteredProducts(filters, {
      limit: Number(limit),
      offset: Number(offset),
    });

    // console.log(result); // <-- Add this line temporarily to test if database worked

    return res.json(result);
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

const getFeaturedProductsHandler = async (req, res) => {
  try {
    const products = await getFeaturedProducts();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load featured products.' });
  }
};

const getNewArrivalsHandler = async (req, res) => {
  try {
    const products = await getNewArrivals();
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load new arrivals.' });
  }
};

const getFilterOptionsHandler = async (req, res) => {
  try {
    const options = await getFilterOptions();
    return res.json(options);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to load filter options.' });
  }
};

const updateProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    let imageUrl = null;
    let publicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'khmer-pride/products',
      });
      imageUrl = result.secure_url;
      publicId = result.public_id;

      data.imageUrl = imageUrl;
      data.publicId = publicId;
    }

    // Staff may maintain product content, but pricing and stock changes require
    // a request approved by an administrator.
    if (req.user?.role === 'staff') {
      const allowedFields = ['productDescription', 'categoryId', 'imageUrl', 'publicId'];
      const requestedRestrictedFields = ['productName', 'productPrice', 'quantity']
        .filter((field) => Object.prototype.hasOwnProperty.call(data, field));

      if (requestedRestrictedFields.length > 0) {
        return res.status(403).json({
          message: 'Staff can only update a product image, description, or category. Submit a request for product name, price, or quantity changes.',
        });
      }

      Object.keys(data).forEach((field) => {
        if (!allowedFields.includes(field)) delete data[field];
      });
    }

    const product = await updateProduct(id, data);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to update product.' });
  }
};

const deleteProductHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteProduct(id);

    if (!result) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Unable to delete product.' });
  }
};

export {
  createCategoryHandler,
  listCategoriesHandler,
  getCategoryByIdHandler,
  createProductHandler,
  listProductsHandler,
  getProductByIdHandler,
  getFeaturedProductsHandler,
  getNewArrivalsHandler,
  getFilterOptionsHandler,
  updateProductHandler,
  deleteProductHandler,
};

