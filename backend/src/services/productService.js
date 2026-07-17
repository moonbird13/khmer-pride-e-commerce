import {
 createProduct as createProductRepo,
 findAllProducts,
 findProductById,
 searchProduct,
 findProductsByCategory,
 findFeaturedProducts,
 findNewProducts,
 findBestSellerProducts,
 saveProduct,
 updateProduct as updateProductRepo,
 deleteProduct as deleteProductRepo
} from "../repositories/product.repository.js";
import db from '../models/index.js';



const { Product_Image, Inventory } = db;

const formatProduct = (product)=>({

    id:product.productId,
    name:product.productName,
    description:product.productDescription,
    price:Number(product.productPrice),
    category:product.Category
    ?{
        id:product.Category.categoryId,
        name:product.Category.categoryName
    }
    :null,

    slug:product.slug,
    isFeatured:Boolean(product.isFeatured),
    isBestSeller:Boolean(product.isBestSeller),
    isNewArrival:Boolean(product.isNewArrival),
    salesCount:Number(product.salesCount || 0),
    imageUrl:product.Product_Images?.[0]?.imageUrl || null,
    publicId:product.Product_Images?.[0]?.publicId || null,
    quantity:Number(product.Inventory?.stockQuantity || 0),
    createdAt:product.createAt

});



// Create

export const createProduct = async(data)=>{

    // business validation
    if(data.productPrice <= 0){

        throw new Error(
            "Product price must be greater than zero"
        );

    }
    // ensure createAt is set to satisfy model not-null constraint
    if (!data.createAt) data.createAt = new Date();

    const { imageUrl, publicId, quantity, ...productData } = data;
    const product = await createProductRepo(productData);

    if (typeof quantity !== 'undefined') {
      await Inventory.create({
        productId: product.productId,
        stockQuantity: Number(quantity) || 0,
        lastUpdated: new Date(),
      });
    }

    if (imageUrl) {
      await Product_Image.create({
        productId: product.productId,
        imageUrl,
        publicId: publicId || null,
        isPrimary: true,
      });
    }

    return formatProduct(await findProductById(product.productId));

};



// List

export const listProducts = async()=>{

    const products = await findAllProducts();
    return products.map(formatProduct);

};


// Get one

export const getProductById = async(id)=>{

    const product =await findProductById(id);
    if(!product)return null;

    return formatProduct(product);

};


// Search
export const searchProducts = async(query)=>{

    if(!query) return listProducts();
    const products =await searchProduct(query.toLowerCase());
    return products.map(formatProduct);

};

// Category listing
export const getProductsByCategory = async(categoryId)=>{
    const products = await findProductsByCategory(categoryId);
    return products.map(formatProduct);
};

// Featured products
export const getFeaturedProducts = async()=>{
    const products = await findFeaturedProducts();
    return products.map(formatProduct);
};

// New arrivals
export const getNewArrivals = async()=>{
    const products = await findNewProducts();
    return products.map(formatProduct);
};

// Best sellers
export const getBestSellerProducts = async()=>{
    const products = await findBestSellerProducts();
    return products.map(formatProduct);
};

// Update product
export const updateProduct = async(id, data)=>{

    if(data.productPrice && data.productPrice <= 0){
        throw new Error("Product price must be greater than zero");
    }

    const { imageUrl, publicId, quantity, ...productData } = data;
    const product = await updateProductRepo(id, productData);
    if(!product) return null;

    if (typeof quantity !== 'undefined') {
      const inventory = await Inventory.findOne({ where: { productId: product.productId } });
      if (inventory) {
        await inventory.update({
          stockQuantity: Number(quantity) || 0,
          lastUpdated: new Date(),
        });
      } else {
        await Inventory.create({
          productId: product.productId,
          stockQuantity: Number(quantity) || 0,
          lastUpdated: new Date(),
        });
      }
    }

    if (imageUrl) {
      await Product_Image.update(
        { isPrimary: false },
        { where: { productId: product.productId, isPrimary: true } }
      );
      await Product_Image.create({
        productId: product.productId,
        imageUrl,
        publicId: publicId || null,
        isPrimary: true,
      });
    }

    return formatProduct(await findProductById(product.productId));
};

// Delete product
export const deleteProduct = async(id)=>{
    const product = await deleteProductRepo(id);
    if(!product) return null;

    return { message: "Product deleted successfully" };
};

export default {
    createProduct,
    listProducts,
    getProductById,
    searchProducts,
    getProductsByCategory,
    getFeaturedProducts,
    getNewArrivals,
    getBestSellerProducts,
    updateProduct,
    deleteProduct
}