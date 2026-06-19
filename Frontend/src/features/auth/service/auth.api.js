import api from "../../../app/axiosInstance"

export async function register({ email, contact, password, fullname, isSeller }) {
    const response = await api.post("/api/auth/register", {
        email,
        contact,
        password,
        fullname,
        isSeller
    })
    if (response.data.token) {
        localStorage.setItem("token", response.data.token)
    }
    return response.data
}

export async function login({ email, password }) {
    const response = await api.post("/api/auth/login", { email, password })
    if (response.data.token) {
        localStorage.setItem("token", response.data.token)
    }
    return response.data
}

export async function getMe() {
    const response = await api.get("/api/auth/me")
    return response.data
}

export function logout() {
    localStorage.removeItem("token")
}