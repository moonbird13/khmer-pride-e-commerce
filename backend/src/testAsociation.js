import db from './models/index.js';

const {
    Users,
    Address,
    Category,
    Product,
    Cart,
    Cart_Items,
    Orders,
    Order_Detail,
    Payment,
    Delivery,
    Review,
    Favorite,
    Product_Image,
    Inventory
} = db;


async function testAssociation() {
    try {
        await db.sequelize.authenticate();
        console.log("✅ Database connected\n");


        // User -> Address
        await Users.findOne({
            include: Address
        });
        console.log("✅ User -> Address");


        // User -> Cart
        await Users.findOne({
            include: Cart
        });
        console.log("✅ User -> Cart");


        // User -> Order
        await Users.findOne({
            include: Orders
        });
        console.log("✅ User -> Order");


        // User -> Review
        await Users.findOne({
            include: Review
        });
        console.log("✅ User -> Review");


        // User -> Favorite
        await Users.findOne({
            include: Favorite
        });
        console.log("✅ User -> Favorite");


        // user -> refreshToken
        await Users.findOne({
            include: db.RefreshToken
        });
        console.log("✅ User -> RefreshToken");
        // user -> emailVerificationToken
        await Users.findOne({
            include: db.EmailVerificationToken
        });
        console.log("✅ User -> EmailVerificationToken");
        // user -> passwordResetToken
        await Users.findOne({
            include: db.PasswordResetToken
        });
        console.log("✅ User -> PasswordResetToken");
        // Category -> Product
        await Category.findOne({
            include: Product
        });
        console.log("✅ Category -> Product");


        // Product -> Category
        await Product.findOne({
            include: Category
        });
        console.log("✅ Product -> Category");


        // Product -> Product_Image
        await Product.findOne({
            include: Product_Image
        });
        console.log("✅ Product -> Product_Image");


        // Product -> Inventory
        await Product.findOne({
            include: Inventory
        });
        console.log("✅ Product -> Inventory");


        // Product -> Cart_Item
        await Product.findOne({
            include: Cart_Items
        });
        console.log("✅ Product -> Cart_Item");


        // Product -> Order_detail
        await Product.findOne({
            include: Order_Detail
        });
        console.log("✅ Product -> Order_detail");


        // Product -> Review
        await Product.findOne({
            include: Review
        });
        console.log("✅ Product -> Review");


        // Product -> Favorite
        await Product.findOne({
            include: Favorite
        });
        console.log("✅ Product -> Favorite");


        // Cart -> Cart_Item
        await Cart.findOne({
            include: Cart_Items
        });
        console.log("✅ Cart -> Cart_Item");


        // Order -> Order_detail
        await Orders.findOne({
            include: Order_Detail
        });
        console.log("✅ Order -> Order_detail");


        // Order -> Payment
        await Orders.findOne({
            include: Payment
        });
        console.log("✅ Order -> Payment");


        // Order -> Delivery
        await Orders.findOne({
            include: Delivery
        });

        console.log("✅ Order -> Delivery");


        console.log("\n🎉 All associations are working!");

    } catch (error) {
        console.log("\n❌ Association error:");
        console.log(error.message);

    } finally {
        await db.sequelize.close();
    }
}


testAssociation();