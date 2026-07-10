const products = [];

const createProduct = ({ name, price, description, categoryId, isFeatured = false }) => {
  const product = {
    id: Date.now(),
    name,
    price: Number(price),
    description: description || '',
    categoryId: Number(categoryId),
    isFeatured: Boolean(isFeatured),
    salesCount: 0,
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  return product;
};

const listProducts = () => products;

const getProductById = (id) => products.find((product) => product.id === Number(id));

const searchProducts = (query) => {
  if (!query) return products;
  const normalized = query.toLowerCase();
  return products.filter((product) => (
    product.name.toLowerCase().includes(normalized)
    || product.description.toLowerCase().includes(normalized)
  ));
};

const getFeaturedProducts = () => {
  const featured = products.filter((product) => product.isFeatured);
  return featured.length ? featured.slice(0, 6) : products.slice(0, 6);
};

const getNewArrivals = () => {
  return [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);
};

const getBestSellers = () => {
  return [...products]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 6);
};

const incrementProductSales = (productId, quantity = 1) => {
  const product = getProductById(productId);
  if (!product) return null;
  product.salesCount += Number(quantity);
  return product;
};

export {
  createProduct,
  listProducts,
  getProductById,
  searchProducts,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  incrementProductSales,
};
