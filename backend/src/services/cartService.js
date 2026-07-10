const cart = { items: [] };

const getCart = () => cart;

const addToCart = ({ productId, quantity = 1 }) => {
  const existingItem = cart.items.find((item) => item.productId === Number(productId));
  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({ productId: Number(productId), quantity: Number(quantity) });
  }
  return cart;
};

const removeCartItem = ({ productId }) => {
  cart.items = cart.items.filter((item) => item.productId !== Number(productId));
  return cart;
};

const updateQuantity = ({ productId, quantity }) => {
  const item = cart.items.find((current) => current.productId === Number(productId));
  if (!item) return cart;
  if (Number(quantity) <= 0) {
    return removeCartItem({ productId });
  }
  item.quantity = Number(quantity);
  return cart;
};

const clearCart = () => {
  cart.items = [];
  return cart;
};

export { addToCart, getCart, removeCartItem, updateQuantity, clearCart };
