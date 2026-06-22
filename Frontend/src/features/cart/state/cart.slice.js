import { createSlice } from "@reduxjs/toolkit";


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalPrice: null,
        currency: null,
        items: [],
    },
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items;
            state.totalPrice = action.payload.totalPrice;
            state.currency = action.payload.currency;
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        incrementCartItem: (state, action) => {
            const { productId, variantId } = action.payload

            state.items = state.items.map(item => {
                // item.variant is a populated object — compare via ._id
                const itemVariantId = item.variant?._id?.toString() ?? item.variant?.toString()
                if (item.product._id === productId && itemVariantId === variantId) {
                    return { ...item, quantity: item.quantity + 1 }
                }
                return item
            })
        },
        decrementCartItem: (state, action) => {
            const { productId, variantId, removed } = action.payload

            if (removed) {
                state.items = state.items.filter(item => {
                    const itemVariantId = item.variant?._id?.toString() ?? item.variant?.toString()
                    return !(item.product._id === productId && itemVariantId === variantId)
                })
            } else {
                state.items = state.items.map(item => {
                    const itemVariantId = item.variant?._id?.toString() ?? item.variant?.toString()
                    if (item.product._id === productId && itemVariantId === variantId) {
                        return { ...item, quantity: item.quantity - 1 }
                    }
                    return item
                })
            }
        }
    }
})

export const { setCart, addItem, incrementCartItem, decrementCartItem } = cartSlice.actions
export default cartSlice.reducer