import api from './api'

export const listProjectsRequest = (params = {}) =>
  api.get('/projects', { params })

export const createProjectRequest = (payload) => api.post('/projects', payload)

export const getProjectRequest = (id) => api.get(`/projects/${id}`)

export const updateProjectRequest = (id, payload) =>
  api.put(`/projects/${id}`, payload)

export const deleteProjectRequest = (id) => api.delete(`/projects/${id}`)
