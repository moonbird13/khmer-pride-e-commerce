import db from '../models/index.js';
import { mockCategories, getCategoryById as getMockCategoryById } from '../data/mockData.js';

const { Category } = db;

const createCategory = async ({ categoryName, categoryStatus = 'Active' }) => {
  if (global.dbAvailable === false) {
    const newCategory = {
      categoryId: mockCategories.length + 1,
      id: mockCategories.length + 1,
      categoryName,
      name: categoryName,
      categoryStatus,
      status: categoryStatus,
    };
    mockCategories.push(newCategory);
    return {
      id: newCategory.categoryId,
      name: newCategory.categoryName,
      status: newCategory.categoryStatus,
    };
  }

  const category = await Category.create({
    categoryName,
    categoryStatus,
  });

  return {
    id: category.categoryId,
    name: category.categoryName,
    status: category.categoryStatus,
  };
};

const listCategories = async () => {
  if (global.dbAvailable === false) {
    return mockCategories.map((category) => ({
      id: category.categoryId,
      name: category.categoryName,
      status: category.categoryStatus,
    }));
  }

  const categories = await Category.findAll({ order: [['categoryId', 'ASC']] });
  return categories.map((category) => ({
    id: category.categoryId,
    name: category.categoryName,
    status: category.categoryStatus,
  }));
};

const getCategoryById = async (id) => {
  if (global.dbAvailable === false) {
    const category = getMockCategoryById(id);
    if (!category) return null;
    return {
      id: category.categoryId,
      name: category.categoryName,
      status: category.categoryStatus,
    };
  }

  const category = await Category.findByPk(Number(id));
  if (!category) return null;

  return {
    id: category.categoryId,
    name: category.categoryName,
    status: category.categoryStatus,
  };
};

export { createCategory, listCategories, getCategoryById };
