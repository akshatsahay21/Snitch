import { useDispatch } from "react-redux"
import {
    getProfileApi, updateProfileApi, addAddressApi, deleteAddressApi,
    toggleWishlistApi, getWishlistApi, getMyOrdersApi
} from "../service/account.api"
import { setAddresses, setWishlist, setOrders, toggleWishlistItem, setLoading } from "../state/account.slice"

export const useAccount = () => {
    const dispatch = useDispatch()

    async function handleGetProfile() {
        const data = await getProfileApi()
        dispatch(setAddresses(data.user.addresses ?? []))
        dispatch(setWishlist(data.user.wishlist ?? []))
        return data.user
    }

    async function handleUpdateProfile({ fullname, contact }) {
        const data = await updateProfileApi({ fullname, contact })
        return data.user
    }

    async function handleAddAddress(addressData) {
        const data = await addAddressApi(addressData)
        dispatch(setAddresses(data.addresses))
        return data.addresses
    }

    async function handleDeleteAddress(addressId) {
        const data = await deleteAddressApi(addressId)
        dispatch(setAddresses(data.addresses))
    }

    async function handleToggleWishlist(productId) {
        const data = await toggleWishlistApi(productId)
        dispatch(toggleWishlistItem({ productId, wishlisted: data.wishlisted }))
        return data.wishlisted
    }

    async function handleGetWishlist() {
        dispatch(setLoading(true))
        const data = await getWishlistApi()
        dispatch(setWishlist(data.wishlist))
        dispatch(setLoading(false))
        return data.wishlist
    }

    async function handleGetOrders() {
        dispatch(setLoading(true))
        const data = await getMyOrdersApi()
        dispatch(setOrders(data.orders))
        dispatch(setLoading(false))
        return data.orders
    }

    return {
        handleGetProfile,
        handleUpdateProfile,
        handleAddAddress,
        handleDeleteAddress,
        handleToggleWishlist,
        handleGetWishlist,
        handleGetOrders,
    }
}
