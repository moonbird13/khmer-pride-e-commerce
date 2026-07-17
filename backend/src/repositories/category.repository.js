import db from "../models/index.js";
const { Category } = db;

const createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

const findAllCategories = async () => {
  return await Category.findAll({
    order: [["categoryId", "ASC"]],
  });
};

const findCategoryById = async (id) => {
  return await Category.findByPk(id);
};

export default {
  createCategory,
  findAllCategories,
  findCategoryById,
};