const categories = [];

const createCategory = ({ name, description }) => {
  const category = {
    id: Date.now(),
    name,
    description: description || '',
    createdAt: new Date().toISOString(),
  };
  categories.push(category);
  return category;
};

const listCategories = () => categories;

const getCategoryById = (id) => categories.find((category) => category.id === Number(id));

export { createCategory, listCategories, getCategoryById };
