import api from './api'

export const listCommentsRequest = (taskId) =>
  api.get(`/tasks/${taskId}/comments`)

export const createCommentRequest = (taskId, body) =>
  api.post(`/tasks/${taskId}/comments`, { body })

export const deleteCommentRequest = (id) => api.delete(`/comments/${id}`)
