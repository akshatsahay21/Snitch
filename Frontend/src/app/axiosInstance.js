import axios from "axios"

// Shared axios instance — always attaches the JWT from localStorage
const api = axios.create({
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
})

export default api
