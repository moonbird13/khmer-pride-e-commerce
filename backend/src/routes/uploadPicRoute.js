import express from "express";
import upload from "../middlewares/upload.js";
import { createProduct } from "../controllers/productController.js";

const router = express.Router();

router.post(
    "/products",
    upload.single("image"),
    createProduct
);

export default router;