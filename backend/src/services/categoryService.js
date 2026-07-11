const categories = [];

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
  };
  categories.push(category);
  return category;
};

const listCategories = () => categories;

<<<<<<< HEAD
const getCategoryById = (id) => categories.find((category) => category.id === Number(id));
=======
const getCategoryById = (id) => categories.find((category) => category.categoryId === Number(id));
>>>>>>> 252a5bd484a0db2b0118437b628075d47e4548ea

export { createCategory, listCategories, getCategoryById };
