import {
    addToFavorite,
    removeFromFavorite,
    viewAllFavorites
} from "../services/favoriteService.js";


// ===================================
// Customer add favorite
// POST /api/favorites
// ===================================

export const addFavoriteHandler = async (req, res) => {

    try {
        // Get user from JWT middleware
        const userId = req.user?.userId ?? req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        // Product comes from frontend
        const { productId } = req.body;

        const favorite = await addToFavorite(
            userId,
            productId
        );
        res.status(201).json({
            message: "Added to favorite",
            data: favorite
        });
    } catch(error){
        res.status(400).json({
            message: error.message
        });

    }

};



// ===================================
// Customer remove favorite
// DELETE /api/favorites/:productId
// ===================================

export const removeFavoriteHandler = async(req,res)=>{

    try{
        const userId = req.user?.userId ?? req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        const { productId } = req.params;

        const favorite = await removeFromFavorite(
            userId,
            productId
        );
        res.status(200).json({
            message:"Removed from favorite",
            data: favorite
        });
    }catch(error){
        res.status(400).json({
            message:error.message
        });

    }

};



// ===================================
// Customer view favorite list
// GET /api/favorites
// ===================================

export const getFavoritesHandler = async(req,res)=>{


    try{
        const userId = req.user?.userId ?? req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        const favorites =
            await viewAllFavorites(userId);
        res.status(200).json({
            data:favorites
        });
    }catch(error){
        res.status(400).json({
            message:error.message
        });
    }
};