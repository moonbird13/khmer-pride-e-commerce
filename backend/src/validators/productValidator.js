const isNumber = (v) => typeof v === 'number' && !Number.isNaN(v);

const createProductValidation = (req, res, next) => {
  const { productName, productPrice, productDescription, categoryId, slug } = req.body || {};
  if (!productName || typeof productName !== 'string' || productName.trim() === '') {
    return res.status(400).json({ message: 'Product name is required.' });
  }
  const parsedPrice = typeof productPrice === 'string' ? Number(productPrice) : productPrice;
  if (!isNumber(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ message: 'Product price must be a non-negative number.' });
  }
  const parsedCategory = typeof categoryId === 'string' ? Number(categoryId) : categoryId;
  if (!isNumber(parsedCategory)) {
    return res.status(400).json({ message: 'categoryId is required and must be a number.' });
  }
  if (!slug || typeof slug !== 'string' || slug.trim() === '') {
    return res.status(400).json({ message: 'slug is required.' });
  }
  if (productDescription !== undefined && typeof productDescription !== 'string') {
    return res.status(400).json({ message: 'productDescription must be a string when provided.' });
  }
  return next();
};

export { createProductValidation };
