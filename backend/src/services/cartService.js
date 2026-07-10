const cart = { items: [] };

const addToCart = ({ productId, quantity = 1 }) => {
  const existingItem = cart.items.find((item) => item.productId === Number(productId));
  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({ productId: Number(productId), quantity: Number(quantity) });
  }
  return cart;
};

const getCart = () => cart;

const clearCart = () => {
  cart.items = [];
  return cart;
};

export { addToCart, getCart, clearCart };
