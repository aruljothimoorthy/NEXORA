import api from './api'

export const getDashboardRequest = () => api.get('/dashboard')

export const seedDemoDashboardRequest = () => api.post('/dashboard/seed-demo')
