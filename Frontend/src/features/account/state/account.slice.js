import { createSlice } from "@reduxjs/toolkit"

const accountSlice = createSlice({
    name: "account",
    initialState: {
        addresses: [],
        wishlist: [],
        orders: [],
        loading: false,
    },
    reducers: {
        setAddresses: (state, action) => {
            state.addresses = action.payload
        },
        setWishlist: (state, action) => {
            state.wishlist = action.payload
        },
        setOrders: (state, action) => {
            state.orders = action.payload
        },
        toggleWishlistItem: (state, action) => {
            const { productId, wishlisted } = action.payload
            if (wishlisted) {
                state.wishlist.push(productId)
            } else {
                state.wishlist = state.wishlist.filter(id => {
                    const idStr = typeof id === 'string' ? id : id?._id?.toString() ?? id?.toString()
                    return idStr !== productId
                })
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setAddresses, setWishlist, setOrders, toggleWishlistItem, setLoading } = accountSlice.actions
export default accountSlice.reducer
