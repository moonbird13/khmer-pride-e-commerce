import db from '../models/index.js';
import { getUserCart, getProductById as getMockProductById } from '../data/mockData.js';

const { Cart, Cart_Item, Product } = db;

const createCartForUser = async (userId) => {
  if (global.dbAvailable === false) {
    const cart = getUserCart(userId);
    return cart;
  }

  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  return cart;
};

const getCart = async (userId) => {
  if (global.dbAvailable === false) {
    const cart = getUserCart(userId);
    return {
      id: cart.cartId,
      items: (cart.items || []).map((item) => {
        const product = getMockProductById(item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          product: product ? {
            id: product.productId,
            name: product.productName,
            price: Number(product.productPrice),
            description: product.productDescription,
          } : null,
        };
      }),
    };
  }

  const cart = await Cart.findOne({
    where: { userId },
    include: [{
      model: Cart_Item,
      include: [{ model: Product, attributes: ['productId', 'productName', 'productPrice', 'productDescription'] }],
    }],
  });

  if (!cart) {
    return { items: [] };
  }

  return {
    id: cart.cartId,
    items: cart.Cart_Items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      product: item.Product ? {
        id: item.Product.productId,
        name: item.Product.productName,
        price: Number(item.Product.productPrice),
        description: item.Product.productDescription,
      } : null,
    })),
  };
};

const addToCart = async ({ userId, productId, quantity = 1 }) => {
  if (global.dbAvailable === false) {
    const cart = getUserCart(userId);
    const existingItem = cart.items.find((item) => item.productId === Number(productId));

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        productId: Number(productId),
        quantity: Number(quantity),
      });
    }

    return getCart(userId);
  }

  const cart = await createCartForUser(userId);
  const existingItem = await Cart_Item.findOne({ where: { cartId: cart.cartId, productId: Number(productId) } });

  if (existingItem) {
    existingItem.quantity += Number(quantity);
    await existingItem.save();
  } else {
    await Cart_Item.create({
      cartId: cart.cartId,
      productId: Number(productId),
      quantity: Number(quantity),
    });
  }

  return getCart(userId);
};

const removeCartItem = async ({ userId, productId }) => {
  if (global.dbAvailable === false) {
    const cart = getUserCart(userId);
    cart.items = cart.items.filter((item) => item.productId !== Number(productId));
    return getCart(userId);
  }

  const cart = await createCartForUser(userId);
  await Cart_Item.destroy({ where: { cartId: cart.cartId, productId: Number(productId) } });
  return getCart(userId);
};

const updateQuantity = async ({ userId, productId, quantity }) => {
  if (global.dbAvailable === false) {
    const cart = getUserCart(userId);
    const item = cart.items.find((item) => item.productId === Number(productId));
    if (!item) return getCart(userId);

    if (Number(quantity) <= 0) {
      return removeCartItem({ userId, productId });
    }

    item.quantity = Number(quantity);
    return getCart(userId);
  }

  const cart = await createCartForUser(userId);
  const item = await Cart_Item.findOne({ where: { cartId: cart.cartId, productId: Number(productId) } });
  if (!item) return getCart(userId);

  if (Number(quantity) <= 0) {
    return removeCartItem({ userId, productId });
  }

  item.quantity = Number(quantity);
  await item.save();
  return getCart(userId);
};

const clearCart = async (userId) => {
  if (global.dbAvailable === false) {
    const cart = getUserCart(userId);
    cart.items = [];
    return { items: [] };
  }

  const cart = await createCartForUser(userId);
  await Cart_Item.destroy({ where: { cartId: cart.cartId } });
  return { items: [] };
};

export { addToCart, getCart, removeCartItem, updateQuantity, clearCart };
