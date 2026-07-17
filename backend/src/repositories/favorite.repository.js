import Favorite from "../models/Favorite.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";


// --------------------------------------
// Find all favorites by user
// --------------------------------------
export const findAllFavorites = async (userId) => {

    return await Favorite.findAll({
        where: {
            userId
        },
        include: [
            {
                model: Product,
                include: [
                    {
                        model: Category
                    }
                ]
            }
        ],
        order: [
            ["favoriteId", "ASC"]
        ]
    });
};


// --------------------------------------
// Find favorite by user + product
// Used for checking duplicate
// --------------------------------------
export const findFavorite = async (userId, productId) => {

    return await Favorite.findOne({
        where: {
            userId,
            productId
        }
    });
};


// --------------------------------------
// Add favorite
// --------------------------------------
export const addFavorite = async ({
    userId,
    productId
}) => {

    return await Favorite.create({
        userId,
        productId
    });

};


// --------------------------------------
// Remove favorite
// --------------------------------------
export const removeFavorite = async (
    userId,
    productId
) => {

    return await Favorite.destroy({
        where: {
            userId,
            productId
        }
    });

};



export default {
    findAllFavorites,
    findFavorite,
    addFavorite,
    removeFavorite
};