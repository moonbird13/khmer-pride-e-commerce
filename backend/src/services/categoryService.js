import db from '../models/index.js';

const { Category } = db;

const createCategory = async ({ categoryName, categoryStatus = 'Active' }) => {
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
  const categories = await Category.findAll({ order: [['categoryId', 'ASC']] });
  return categories.map((category) => ({
    id: category.categoryId,
    name: category.categoryName,
    status: category.categoryStatus,
  }));
};

const getCategoryById = async (id) => {
  const category = await Category.findByPk(Number(id));
  if (!category) return null;

  return {
    id: category.categoryId,
    name: category.categoryName,
    status: category.categoryStatus,
  };
};

export { createCategory, listCategories, getCategoryById };
