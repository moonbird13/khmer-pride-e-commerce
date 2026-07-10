const isNumber = (v) => typeof v === 'number' && !Number.isNaN(v);

const createProductValidation = (req, res, next) => {
  const { name, price, description, categoryId } = req.body || {};
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ message: 'Product name is required.' });
  }
  const parsedPrice = typeof price === 'string' ? Number(price) : price;
  if (!isNumber(parsedPrice) || parsedPrice < 0) {
    return res.status(400).json({ message: 'Product price must be a non-negative number.' });
  }
  const parsedCategory = typeof categoryId === 'string' ? Number(categoryId) : categoryId;
  if (!isNumber(parsedCategory)) {
    return res.status(400).json({ message: 'categoryId is required and must be a number.' });
  }
  return next();
};

export { createProductValidation };
