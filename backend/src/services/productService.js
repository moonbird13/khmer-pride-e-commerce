const products = [];

const createProduct = ({
  productName,
  productPrice,
  productDescription = '',
  categoryId,
  slug,
  isFeatured = false,
  isBestSeller = false,
  isNewArrival = false,
}) => {
  const product = {
    productId: Date.now(),
    productName,
    productPrice: Number(productPrice),
    productDescription,
    categoryId: Number(categoryId),
    slug,
    isFeatured: Boolean(isFeatured),
    isBestSeller: Boolean(isBestSeller),
    isNewArrival: Boolean(isNewArrival),
    salesCount: 0,
    createAt: new Date().toISOString(),
  };
  products.push(product);
  return product;
};

const listProducts = () => products;

const getProductById = (id) => products.find((product) => product.productId === Number(id));

const searchProducts = (query) => {
  if (!query) return products;
  const normalized = query.toLowerCase();
  return products.filter((product) => (
    product.productName.toLowerCase().includes(normalized)
    || product.productDescription.toLowerCase().includes(normalized)
  ));
};

const getFeaturedProducts = () => {
  const featured = products.filter((product) => product.isFeatured);
  return featured.length ? featured.slice(0, 6) : products.slice(0, 6);
};

const getNewArrivals = () => {
  return [...products]
    .sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
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
