import api from './api'

export const listTeamRequest = (projectId) =>
  api.get(`/projects/${projectId}/team`)

export const inviteMemberRequest = (projectId, payload) =>
  api.post(`/projects/${projectId}/team/invite`, payload)

export const updateMemberRoleRequest = (projectId, userId, role) =>
  api.patch(`/projects/${projectId}/team/${userId}`, { role })

export const removeMemberRequest = (projectId, userId) =>
  api.delete(`/projects/${projectId}/team/${userId}`)
