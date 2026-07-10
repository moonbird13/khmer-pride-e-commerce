const products = [];

const createProduct = ({ name, price, description, categoryId }) => {
  const product = {
    id: Date.now(),
    name,
    price: Number(price),
    description: description || '',
    categoryId: Number(categoryId),
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  return product;
};

const listProducts = () => products;

const getProductById = (id) => products.find((product) => product.id === Number(id));

export { createProduct, listProducts, getProductById };
