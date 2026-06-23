import axiosInstance from "../../../app/axiosInstance.js";

export const toggleWishlistItemApi = async (productId) => {
    const response = await axiosInstance.post("/wishlist/toggle", { productId });
    return response.data;
};

export const getWishlistApi = async () => {
    const response = await axiosInstance.get("/wishlist");
    return response.data;
};
