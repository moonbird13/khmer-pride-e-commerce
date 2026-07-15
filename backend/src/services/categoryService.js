import categoryRepository from "../repository/category.repository.js";


const createCategory = async ({
  categoryName,
  categoryStatus = "Active",
}) => {

  const category = await categoryRepository.createCategory({
    categoryName,
    categoryStatus,
  });

  return {
    name: category.categoryName,
    status: category.categoryStatus,
  };
};


const listCategories = async () => {

  const categories =
    await categoryRepository.findAllCategories();

  return categories.map((category) => ({
    id: category.categoryId,
    name: category.categoryName,
    status: category.categoryStatus,
  }));
};


const getCategoryById = async (id) => {

  const category =
    await categoryRepository.findCategoryById(Number(id));

  if (!category) {
    return null;
  }

  return {
    id: category.categoryId,
    name: category.categoryName,
    status: category.categoryStatus,
  };
};


export {
  createCategory,
  listCategories,
  getCategoryById,
};