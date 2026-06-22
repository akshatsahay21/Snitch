import api from "../../../app/axiosInstance"

function authHeader() {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getProfileApi = async () => {
    const response = await api.get("/api/auth/me", { headers: authHeader() })
    return response.data
}

export const updateProfileApi = async ({ fullname, contact }) => {
    const response = await api.put("/api/auth/profile", { fullname, contact }, { headers: authHeader() })
    return response.data
}

export const addAddressApi = async (addressData) => {
    const response = await api.post("/api/auth/address", addressData, { headers: authHeader() })
    return response.data
}

export const deleteAddressApi = async (addressId) => {
    const response = await api.delete(`/api/auth/address/${addressId}`, { headers: authHeader() })
    return response.data
}

export const toggleWishlistApi = async (productId) => {
    const response = await api.post(`/api/auth/wishlist/${productId}`, {}, { headers: authHeader() })
    return response.data
}

export const getWishlistApi = async () => {
    const response = await api.get("/api/auth/wishlist", { headers: authHeader() })
    return response.data
}

export const getMyOrdersApi = async () => {
    const response = await api.get("/api/auth/orders", { headers: authHeader() })
    return response.data
}
