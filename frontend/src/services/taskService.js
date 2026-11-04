import api from './api'

export const listTasksRequest = (projectId) =>
  api.get(`/projects/${projectId}/tasks`)

export const createTaskRequest = (projectId, payload) =>
  api.post(`/projects/${projectId}/tasks`, payload)

export const updateTaskRequest = (id, payload) => api.put(`/tasks/${id}`, payload)

export const moveTaskRequest = (id, payload) =>
  api.patch(`/tasks/${id}/move`, payload)

export const deleteTaskRequest = (id) => api.delete(`/tasks/${id}`)
