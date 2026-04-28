import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://payoutbackend-production.up.railway.app/api/v1' })

export default api
