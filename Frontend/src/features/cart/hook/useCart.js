import { addItem, getCart, incrementCartItemApi, decrementCartItemApi, createCartOrder, verifyCartOrder } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { setCart, incrementCartItem, decrementCartItem } from "../state/cart.slice"


export const useCart = () => {

    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId }) {
        const data = await addItem({ productId, variantId })
        if (data.success && data.cart) {
            dispatch(setCart(data.cart))
        }
        return data
    }

    async function handleGetCart() {
        const data = await getCart()
        console.log(data)
        dispatch(setCart(data.cart))
    }

    async function handleIncrementCartItem({ productId, variantId }) {
        const data = await incrementCartItemApi({ productId, variantId })
        if (data.success && data.cart) {
            dispatch(setCart(data.cart))
        } else {
            dispatch(incrementCartItem({ productId, variantId }))
        }
    }

    async function handleDecrementCartItem({ productId, variantId }) {
        const data = await decrementCartItemApi({ productId, variantId })
        if (data.success && data.cart) {
            dispatch(setCart(data.cart))
        } else {
            dispatch(decrementCartItem({ productId, variantId, removed: !!data.removed }))
        }
    }

    async function handleCreateCartOrder() {
        const data = await createCartOrder()
        return data.order
    }

    async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        return data.success
    }

    return { handleAddItem, handleGetCart, handleIncrementCartItem, handleDecrementCartItem, handleCreateCartOrder, handleVerifyCartOrder }

}