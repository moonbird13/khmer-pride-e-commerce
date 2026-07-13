import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const createProduct = async (req, res) => {
    try {
        const { name, price } = req.body;

        let imageUrl = null;
        let publicId = null;

        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.buffer,
                "products"
            );

            imageUrl = result.secure_url;
            publicId = result.public_id;
        }

        // Save to MySQL
        // INSERT INTO products (name, price, image_url, public_id)

        res.json({
            message: "Product created",
            imageUrl,
            publicId,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};