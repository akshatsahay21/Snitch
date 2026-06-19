import api from "../../../app/axiosInstance"

export async function createProduct(formData) {
    const response = await api.post("/api/products/", formData)
    return response.data
}

export async function getSellerProduct() {
    const response = await api.get("/api/products/seller")
    return response.data
}

export async function getAllProducts() {
    const response = await api.get("/api/products/")
    return response.data
}

export async function getProductById(productId) {
    const response = await api.get(`/api/products/detail/${productId}`)
    return response.data
}

export async function addProductVariant(productId, newProductVariant) {
    console.log(newProductVariant)

    const formData = new FormData()

    newProductVariant.images.forEach((image) => {
        formData.append(`images`, image.file)
    })

    formData.append("stock", newProductVariant.stock)
    formData.append("priceAmount", newProductVariant.price)
    formData.append("attributes", JSON.stringify(newProductVariant.attributes))

    const response = await api.post(`/api/products/${productId}/variants`, formData)
    return response.data
}