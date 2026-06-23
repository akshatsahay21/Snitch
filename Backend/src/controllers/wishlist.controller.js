import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";

export async function toggleWishlistItem(req, res) {
    try {
        const { productId } = req.body;
        const userId = req.user._id;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const isInWishlist = user.wishlist.includes(productId);

        if (isInWishlist) {
            // Remove from wishlist
            user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        } else {
            // Add to wishlist
            user.wishlist.push(productId);
        }

        await user.save();

        return res.status(200).json({
            message: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
            success: true,
            wishlist: user.wishlist
        });

    } catch (error) {
        console.error("Error toggling wishlist item:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export async function getWishlist(req, res) {
    try {
        const userId = req.user._id;

        // Fetch user and populate the wishlist products
        const user = await userModel.findById(userId).populate({
            path: 'wishlist',
            model: 'product'
        });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({
            message: "Wishlist fetched successfully",
            success: true,
            wishlist: user.wishlist
        });

    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
