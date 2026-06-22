import api from "../../../app/axiosInstance"

function authHeader() {
    const token = localStorage.getItem("token")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function createProduct(formData) {
    const response = await api.post("/api/products/", formData)
    return response.data
}

export async function getSellerProduct() {
    const response = await api.get("/api/products/seller")
    return response.data
}

export async function getAllProducts(query = '') {
    const url = query ? `/api/products/?q=${encodeURIComponent(query)}` : '/api/products/'
    const response = await api.get(url)
    return response.data
}

export async function getProductById(productId) {
    const response = await api.get(`/api/products/detail/${productId}`)
    return response.data
}

export async function addProductVariant(productId, payload) {
    const formData = new FormData()

    if (payload.images) {
        payload.images.forEach((image) => {
            formData.append(`images`, image.file)
        })
    }

    if (payload.variantsData) {
        formData.append("variantsData", JSON.stringify(payload.variantsData))
    } else {
        formData.append("stock", payload.stock)
        formData.append("priceAmount", payload.price)
        formData.append("attributes", JSON.stringify(payload.attributes))
    }

    const response = await api.post(`/api/products/${productId}/variants`, formData)
    return response.data
}

export async function deleteProductApi(productId) {
    const response = await api.delete(`/api/products/${productId}`, { headers: authHeader() })
    return response.data
}

export async function updateProductApi(productId, data) {
    const response = await api.put(`/api/products/${productId}`, data, { headers: authHeader() })
    return response.data
}