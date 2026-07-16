import Favorite from "../models/Favorite";

//---------------------------------------
// Search
// --------------------------------------

// Find all favorite of a user
export const findAllFavorites = async (userId) => {

    return await Favorite.findAll({
        where: { userId },
        order: [["favoriteId", "ASC"]],
    });
}

// Search favorite by id
export const findFavoriteById = async (favoriteId) => {
    return await Favorite.findByPk(favoriteId);
}


//------------------------------------------
// Create or add
// -----------------------------------------

//add favorite product to favorite list
export const addFavorite = async ({ userId, productId}) {

    return await Favorite.create({
        userId,
        productId
    });
}

// -----------------------------------------
// remove or delete
// -----------------------------------------

//remove favorite from the list
export const removeFavorite = async (userId, productId) => {

    return await Favorite.update(
        { isFavorite: false },
        { where: { userId, productId } }
    );
}

export default {findAllFavorites, 
                findFavoriteById, 
                addFavorite, 
                removeFavorite};