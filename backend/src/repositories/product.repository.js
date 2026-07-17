import { Op } from "sequelize";
import db from "../models/index.js";

const { Product, Category, Product_Image, Inventory } = db;

const commonIncludes = [
  {
    model: Category,
    attributes: ["categoryId", "categoryName"],
  },
  {
    model: Product_Image,
    where: { isPrimary: true },
    required: false,
    attributes: ["imageUrl", "publicId"],
  },
  {
    model: Inventory,
    required: false,
    attributes: ["stockQuantity"],
  },
];


// Create

export const createProduct = async(data)=>{

    return await Product.create(data);
};


// Find all

export const findAllProducts = async()=>{

    return await Product.findAll({

        include: commonIncludes,

        order:[
            ["productId","ASC"]
        ]

    });

};


// Find by id

export const findProductById = async(id)=>{

    return await Product.findByPk(
        Number(id),
        {
            include: commonIncludes
        }
    );

};



// Search

export const searchProduct = async(query)=>{

    return await Product.findAll({

        where:{[Op.or]:[
               {
                    productName:{
                        [Op.like]:`%${query}%`
                    }
                },
                {
                    productDescription:{
                        [Op.like]:`%${query}%`
                    }
                }
            ]
        },

        include: commonIncludes

    });

};



// Category filter

export const findProductsByCategory = async(categoryId)=>{

    return await Product.findAll({
        where:{ categoryId:Number(categoryId)},
        include: commonIncludes

    });

};



// Featured

export const findFeaturedProducts = async()=>{

    return await Product.findAll({

        where:{ isFeatured:true },
        include: commonIncludes,
        limit:6,
        order:[
            ["productId","ASC"]
        ]

    });

};



// New arrivals

export const findNewProducts = async()=>{

    return await Product.findAll({

        include: commonIncludes,

        order:[
            ["createAt","DESC"]
        ],

        limit:6

    });

};



// Best seller

export const findBestSellerProducts = async()=>{

    return await Product.findAll({

        include: commonIncludes,

        order:[
            ["salesCount","DESC"]
        ],
// To be consider
        limit:6

    });

};



// Update sales

export const saveProduct = async(product)=>{

    return await product.save();

};

// Update product
export const updateProduct = async(id, data)=>{

    const product = await Product.findByPk(Number(id));
    if(!product) return null;

    return await product.update(data);

};

// Delete product
export const deleteProduct = async(id)=>{

    const product = await Product.findByPk(Number(id));
    if(!product) return null;

    return await product.destroy();

};


export default {
    createProduct,
    findAllProducts,
    findProductById,
    searchProduct,
    findProductsByCategory,
    findFeaturedProducts,
    findNewProducts,
    findBestSellerProducts,
    saveProduct,
    updateProduct,
    deleteProduct
}