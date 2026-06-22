import api from "../../../app/axiosInstance"

// Helper that always gets the freshest token from localStorage
function authHeader() {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export const addItem = async ({ productId, variantId }) => {
    const response = await api.post(
        `/api/cart/add/${productId}/${variantId}`,
        { quantity: 1 },
        { headers: authHeader() }
    )
    return response.data
}

export const getCart = async () => {
    const response = await api.get("/api/cart/", { headers: authHeader() })
    return response.data
}

export const incrementCartItemApi = async ({ productId, variantId }) => {
    const response = await api.patch(
        `/api/cart/quantity/increment/${productId}/${variantId}`,
        undefined,
        { headers: authHeader() }
    )
    return response.data
}

export const decrementCartItemApi = async ({ productId, variantId }) => {
    const response = await api.patch(
        `/api/cart/quantity/decrement/${productId}/${variantId}`,
        undefined,
        { headers: authHeader() }
    )
    return response.data
}

export const createCartOrder = async () => {
    const token = localStorage.getItem("token")
    console.log("[createCartOrder] token from localStorage:", token ? "EXISTS" : "MISSING")
    const response = await api.post(
        "/api/cart/payment/create/order",
        undefined,
        { headers: authHeader() }
    )
    return response.data
}

export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await api.post(
        "/api/cart/payment/verify/order",
        { razorpay_order_id, razorpay_payment_id, razorpay_signature },
        { headers: authHeader() }
    )
    return response.data
}