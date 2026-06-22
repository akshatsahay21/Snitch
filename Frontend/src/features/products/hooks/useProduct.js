import { createProduct, getSellerProduct, getAllProducts, getProductById, addProductVariant, deleteProductApi, updateProductApi } from "../service/product.api"
import { useDispatch } from "react-redux"
import { setSellerProducts, setProducts } from "../state/product.slice"



export const useProduct = () => {

    const dispatch = useDispatch()

    async function handleCreateProduct(formData) {
        const data = await createProduct(formData)
        return data.product
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))
        return data.products
    }

    async function handleGetAllProducts(query = '') {
        const data = await getAllProducts(query)
        dispatch(setProducts(data.products))
    }

    async function handleGetProductById(productId) {
        const data = await getProductById(productId)
        return data.product
    }

    async function handleAddProductVariant(productId, newProductVariant) {
        const data = await addProductVariant(productId, newProductVariant)
        return data
    }

    async function handleDeleteProduct(productId) {
        await deleteProductApi(productId)
        // Remove from sellerProducts in store
        dispatch(setSellerProducts(
            (store => store)(undefined) // will be done via re-fetch
        ))
        return true
    }

    async function handleUpdateProduct(productId, data) {
        const res = await updateProductApi(productId, data)
        return res.product
    }

    return { handleCreateProduct, handleGetSellerProduct, handleGetAllProducts, handleGetProductById, handleAddProductVariant, handleDeleteProduct, handleUpdateProduct }

}