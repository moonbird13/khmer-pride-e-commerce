import {
 createProduct as createProductRepo,
 findAllProducts,
 findProductById,
 searchProduct,
 findProductsByCategory,
 findFeaturedProducts,
 findNewProducts,
 findBestSellerProducts,
 saveProduct
} from "../repositories/product.repository.js";



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

    const product =await createProductRepo(data);
    return formatProduct(product);

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

export default {
    createProduct,
    listProducts,
    getProductById,
    searchProducts,
    getProductsByCategory,
    getFeaturedProducts,
    getNewArrivals,
    getBestSellerProducts
}