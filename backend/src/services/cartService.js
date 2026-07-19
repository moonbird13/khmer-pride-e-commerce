import {
    findCartByUserId,
    createCart,
    findCartItem,
    addCartItem,
    deleteCartItem,
    clearCartItems
} from "../repositories/cart.repository.js";
import db from '../models/index.js';



const getOrCreateCart = async(userId)=>{

    let cart = await findCartByUserId(userId);
    if(!cart){
        cart = await createCart(userId);
    }
    return cart;
};



export const getCart = async(userId)=>{

    const cart = await findCartByUserId(userId);
    if(!cart){
        return {
            items:[]
        };
    }

    return {
        id: cart.cartId,

        items: cart.Cart_Items.map(item=>({
            productId:item.productId,
            quantity:item.quantity,

            product:item.Product
            ? {
                id:item.Product.productId,
                name:item.Product.productName,
                price:Number(item.Product.productPrice),
                description:item.Product.productDescription
              }
            : null
        }))
    };

};



export const addToCart = async({
    userId,
    productId,
    quantity=1
})=>{
    const inventory = await db.Inventory.findOne({ where: { productId } });
    if (!inventory || Number(inventory.stockQuantity) <= 0) throw new Error('This product is out of stock.');
    const cart = await getOrCreateCart(userId);
    const existingItem = await findCartItem(
        cart.cartId,
        productId
    );

    if(existingItem){
        if (Number(existingItem.quantity) + Number(quantity) > Number(inventory.stockQuantity)) throw new Error('Requested quantity exceeds available stock.');
        existingItem.quantity += Number(quantity);
        await existingItem.save();
    }else{
        await addCartItem({
            cartId:cart.cartId,
            productId,
            quantity
        });
    }

    return getCart(userId);

};



export const removeCartItem = async({
    userId,
    productId
})=>{

    const cart = await getOrCreateCart(userId);
    await deleteCartItem(
        cart.cartId,
        productId
    );
    return getCart(userId);

};



export const clearCart = async(userId)=>{

    const cart = await getOrCreateCart(userId);
    await clearCartItems(cart.cartId);
    return {
        items:[]
    };

};

export const updateQuantity = async({
    userId,
    productId,
    quantity
})=>{
    const cart = await getOrCreateCart(userId);
    const existingItem = await findCartItem(cart.cartId, productId);

    if (!existingItem) {
        return getCart(userId);
    }

    const nextQuantity = Number(quantity);
    if (Number.isNaN(nextQuantity) || nextQuantity <= 0) {
        await deleteCartItem(cart.cartId, productId);
        return getCart(userId);
    }

    const inventory = await db.Inventory.findOne({ where: { productId } });
    if (!inventory || nextQuantity > Number(inventory.stockQuantity)) throw new Error('Requested quantity exceeds available stock.');

    existingItem.quantity = nextQuantity;
    await existingItem.save();
    return getCart(userId);
};

export default {
    getCart,
    addToCart,
    removeCartItem,
    clearCart,
    updateQuantity
}
