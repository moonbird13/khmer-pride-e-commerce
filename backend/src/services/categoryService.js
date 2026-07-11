const categories = [];

const createCategory = ({ categoryName, categoryStatus = 'Active' }) => {
  const category = {
    categoryId: Date.now(),
    categoryName,
    categoryStatus,
  };
  categories.push(category);
  return category;
};

const listCategories = () => categories;

const getCategoryById = (id) => categories.find((category) => category.categoryId === Number(id));

export { createCategory, listCategories, getCategoryById };
