import { setError, setLoading, setUser, clearUser } from "../state/auth.slice"
import { register, login, getMe, logout } from "../service/auth.api"
import { useDispatch } from "react-redux"
import { setCart } from "../../cart/state/cart.slice"



export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {

        const data = await register({ email, contact, password, fullname, isSeller })

        dispatch(setUser(data.user))
        return data.user
    }

    async function handleLogin({ email, password }) {

        const data = await login({ email, password })
        dispatch(setUser(data.user))
        return data.user
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
            dispatch(setLoading(false))
        } catch (err){
            console.warn('[useAuth] /me failed — are you logged in?', err?.response?.status, err?.response?.data?.message)
            dispatch(setLoading(false))
        }
    }

    function handleLogout() {
        logout()                                // remove token from localStorage
        dispatch(clearUser())                   // clear user from Redux
        dispatch(setCart({ items: [], totalPrice: 0, currency: null }))  // clear cart
    }

    return { handleRegister, handleLogin, handleGetMe, handleLogout }

}