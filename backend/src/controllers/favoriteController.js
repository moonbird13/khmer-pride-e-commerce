import {
    addToFavorite,
    removeFromFavorite,
    viewAllFavorites
} from "../services/favorite.service.js";


// ===================================
// Customer add favorite
// POST /api/favorites
// ===================================

export const addFavoriteHandler = async (req, res) => {

    try {

        // Get user from JWT middleware
        const userId = req.user.userId;


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

        const userId = req.user.userId;

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


        const userId = req.user.userId;


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