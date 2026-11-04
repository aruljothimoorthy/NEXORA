import axios from 'axios'

/**
 * Shared Axios instance for NEXORA API calls.
 * Base URL comes from VITE_API_URL (never hardcode production hosts).
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexora_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || ''
      const isAuthRoute =
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/me')

      if (!isAuthRoute) {
        localStorage.removeItem('nexora_token')
      }
    }
    return Promise.reject(error)
  },
)

export default api
