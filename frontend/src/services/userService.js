import api from './api'

export const updateProfileRequest = (payload) => api.put('/users/me', payload)

export const changePasswordRequest = (payload) =>
  api.put('/users/me/password', payload)

export const updateSettingsRequest = (payload) =>
  api.put('/users/me/settings', payload)

export const deactivateAccountRequest = (payload) =>
  api.post('/users/me/deactivate', payload)
