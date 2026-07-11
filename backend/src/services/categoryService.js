import db from '../models/index.js';

<<<<<<< HEAD
<<<<<<< HEAD
const createCategory = ({ name, description }) => {
  const category = {
    id: Date.now(),
    name,
    description: description || '',
    createdAt: new Date().toISOString(),
=======
const createCategory = ({ categoryName, categoryStatus = 'Active' }) => {
  const category = {
    categoryId: Date.now(),
    categoryName,
    categoryStatus,
>>>>>>> 252a5bd484a0db2b0118437b628075d47e4548ea
=======
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
>>>>>>> 5a1b1778a44aa568178440ed33be23a1b57e1280
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

<<<<<<< HEAD
<<<<<<< HEAD
const getCategoryById = (id) => categories.find((category) => category.id === Number(id));
=======
const getCategoryById = (id) => categories.find((category) => category.categoryId === Number(id));
>>>>>>> 252a5bd484a0db2b0118437b628075d47e4548ea
=======
const getCategoryById = async (id) => {
  const category = await Category.findByPk(Number(id));
  if (!category) return null;

  return {
    id: category.categoryId,
    name: category.categoryName,
    status: category.categoryStatus,
  };
};
>>>>>>> 5a1b1778a44aa568178440ed33be23a1b57e1280

export { createCategory, listCategories, getCategoryById };
