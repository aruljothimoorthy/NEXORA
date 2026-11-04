import api from './api'

export const listNotificationsRequest = () => api.get('/notifications')

export const markNotificationReadRequest = (id) =>
  api.patch(`/notifications/${id}/read`)

export const markAllNotificationsReadRequest = () =>
  api.patch('/notifications/read-all')

export const checkDeadlinesRequest = () =>
  api.post('/notifications/check-deadlines')
