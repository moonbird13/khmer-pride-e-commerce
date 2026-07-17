import express from "express";

import {
    addFavoriteHandler,
    removeFavoriteHandler,
    getFavoritesHandler
} from "../controllers/favoriteController.js";

import { authenticate } from "../middleware/auth.js";


const router = express.Router();


// View all favorites
router.get("/", authenticate, getFavoritesHandler);


// Add favorite
router.post("/", authenticate, addFavoriteHandler);


// Remove favorite
router.delete("/:productId", authenticate, removeFavoriteHandler);


export default router;