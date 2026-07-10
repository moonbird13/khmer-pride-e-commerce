const isNumber = (v) => typeof v === 'number' && !Number.isNaN(v);

const createOrderValidation = (req, res, next) => {
  const { userId, items, total } = req.body || {};
  const parsedUserId = typeof userId === 'string' ? Number(userId) : userId;
  if (!isNumber(parsedUserId)) {
    return res.status(400).json({ message: 'userId is required and must be a number.' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'items must be a non-empty array.' });
  }
  for (const it of items) {
    const pid = typeof it.productId === 'string' ? Number(it.productId) : it.productId;
    const qty = typeof it.quantity === 'string' ? Number(it.quantity) : it.quantity;
    if (!isNumber(pid) || !isNumber(qty) || qty <= 0) {
      return res.status(400).json({ message: 'Each item must have a numeric productId and quantity > 0.' });
    }
  }
  const parsedTotal = typeof total === 'string' ? Number(total) : total;
  if (!isNumber(parsedTotal) || parsedTotal < 0) {
    return res.status(400).json({ message: 'total must be a non-negative number.' });
  }
  return next();
};

export { createOrderValidation };
