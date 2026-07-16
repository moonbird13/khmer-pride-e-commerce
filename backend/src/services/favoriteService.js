import favoriteRepository, { findFavorite } from "../repositories/favorite.repository.js";
import { findProductById } from "../repositories/product.repository.js";


// Format product data before sending to frontend
const formatProduct = (product) => {

    return {
        id: product.productId,
        name: product.productName,
        description: product.productDescription,
        price: Number(product.productPrice),

        category: product.Category
            ? {
                id: product.Category.categoryId,
                name: product.Category.categoryName
            }
            : null,

        slug: product.slug,

        isFeatured: Boolean(product.isFeatured),
        isBestSeller: Boolean(product.isBestSeller),
        isNewArrival: Boolean(product.isNewArrival),

        salesCount: Number(product.salesCount || 0),

        createdAt: product.createAt
    };
};



// ======================================================
// ADD TO FAVORITE
// ======================================================
// Flow:
// 1. Receive userId and productId
// 2. Validate productId exists
// 3. Check product exists in database
// 4. Check if user already favorited this product
// 5. Create favorite record
// ======================================================

export const addToFavorite = async (
    userId,
    productId
) => {


    // Step 1:
    // Check if frontend sent productId
    // because without it we don't know what product to favorite

    if(!productId){
        throw new Error(
            "Product ID is required"
        );
    }



    // Step 2:
    // Check product exists
    //
    // Example:
    // User sends productId = 999
    // But product 999 does not exist
    //
    // We should not create:
    // Favorites(userId:5, productId:999)

    const product = await findProductById(productId);


    if(!product){

        throw new Error(
            "Product not found"
        );

    }



    // Step 3:
    // Check duplicate favorite
    //
    // Example:
    //
    // User already has:
    // userId: 5
    // productId: 10
    //
    // They click ❤️ again
    //
    // We prevent duplicate data

    const existingFavorite =
        await favoriteRepository.findFavorite(
            userId,
            productId
        );


    if(existingFavorite){

        throw new Error(
            "Already in favorite list"
        );

    }



    // Step 4:
    // Everything is valid
    // Now save relationship:
    //
    // User 5 likes Product 10

    return await favoriteRepository.addFavorite({

        userId,

        productId

    });

};




// ======================================================
// REMOVE FROM FAVORITE
// ======================================================
// Flow:
// 1. Find favorite relationship
// 2. If not found, throw error
// 3. Delete favorite record
// ======================================================

export const removeFromFavorite = async (
    userId,
    productId
) => {


    // Step 1:
    // Check whether this product is already favorited

    const existingFavorite =
        await favoriteRepository.findFavorite(
            userId,
            productId
        );



    // Step 2:
    // Cannot remove something that does not exist

    if(!existingFavorite){

        throw new Error(
            "Favorite not found"
        );

    }



    // Step 3:
    // Remove the relationship

    return await favoriteRepository.removeFavorite(
        userId,
        productId
    );

};




// ======================================================
// VIEW ALL FAVORITES
// ======================================================
// Flow:
// 1. Receive userId from JWT
// 2. Find all favorite records of this user
// 3. Get product information
// 4. Format product data for frontend
// ======================================================

export const viewAllFavorites = async (
    userId
) => {


    // Step 1:
    // Get all favorite products belonging to this user

    const favorites =
        await favoriteRepository.findAllFavorites(
            userId
        );



    // Step 2:
    // Convert Favorite + Product data
    // into normal product card format
    //
    // Frontend does not need:
    // favoriteId
    // userId
    //
    // It only needs product information

    return favorites.map((favorite)=>{

        return formatProduct(
            favorite.Product
        );

    });

};

export default {
                viewAllFavorites, 
                removeFromFavorite, 
                addToFavorite};