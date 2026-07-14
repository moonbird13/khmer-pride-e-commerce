import db from "../models/index.js";
const { Cart, Cart_Item, Product } = db;

//----------------------------------------------------
// Select Or Search
// ---------------------------------------------------

// Find a cart by user ID
export const findCartByUserId = async (userId) => {
  return await Cart.findOne({
    where: { userId },
    include: [
      {
        model: Cart_Item,
        include: [
          {
            model: Product,
            attributes: [
              "productId",
              "productName",
              "productPrice",
              "productDescription"
            ]
          }
        ]
      }
    ]
  });
};


// Create a new cart for a user
export const createCart = async (userId) => {
  return await Cart.create({
    userId
  });
};

// Find a cart item by joining cart ID and product ID
export const findCartItem = async (cartId, productId) => {
  return await Cart_Item.findOne({
    where: {
      cartId,
      productId
    }
  });
};

// add a new cart item
export const addCartItem = async ({
  cartId,
  productId,
  quantity
}) => {

  return await Cart_Item.create({
    cartId,
    productId,
    quantity
  });

};

// ------------------------------------------------
// Delete
// ------------------------------------------------
export const deleteCartItem = async (cartId, productId) => {

  return await Cart_Item.destroy({
    where:{
      cartId,
      productId
    }
  });

};


export const clearCartItems = async (cartId) => {

  return await Cart_Item.destroy({
    where:{
      cartId
    }
  });

};

export default {
    findCartByUserId,
    createCart,
    findCartItem,
    addCartItem,
    deleteCartItem,
    clearCartItems
}