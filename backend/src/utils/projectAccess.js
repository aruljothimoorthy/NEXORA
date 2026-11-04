const Project = require('../models/Project')
const ApiError = require('./ApiError')

/**
 * Project IDs the user owns or is a member of.
 */
const getAccessibleProjectIds = async (userId) => {
  const projects = await Project.find({
    $or: [{ owner: userId }, { 'members.user': userId }],
  }).select('_id')

  return projects.map((p) => p._id)
}

const isProjectMember = (project, userId) => {
  const id = String(userId)
  if (String(project.owner) === id || String(project.owner?._id) === id) {
    return true
  }
  return (project.members || []).some(
    (m) => String(m.user) === id || String(m.user?._id) === id,
  )
}

const getMemberRole = (project, userId) => {
  const id = String(userId)
  if (String(project.owner) === id || String(project.owner?._id) === id) {
    return 'owner'
  }
  const member = (project.members || []).find(
    (m) => String(m.user) === id || String(m.user?._id) === id,
  )
  return member?.role || null
}

const canEditProject = (project, userId) => {
  const role = getMemberRole(project, userId)
  return role === 'owner' || role === 'admin' || role === 'member'
}

const canManageTeam = (project, userId) => {
  const role = getMemberRole(project, userId)
  return role === 'owner' || role === 'admin'
}

/**
 * Load project and ensure the user can access it.
 */
const getProjectOrFail = async (
  projectId,
  userId,
  { requireEdit = false, requireManageTeam = false } = {},
) => {
  const project = await Project.findById(projectId)
  if (!project) {
    throw new ApiError(404, 'Project not found')
  }

  if (!isProjectMember(project, userId)) {
    throw new ApiError(403, 'You do not have access to this project')
  }

  if (requireEdit && !canEditProject(project, userId)) {
    throw new ApiError(403, 'You do not have permission to edit this project')
  }

  if (requireManageTeam && !canManageTeam(project, userId)) {
    throw new ApiError(403, 'Only owners and admins can manage the team')
  }

  return project
}

module.exports = {
  getAccessibleProjectIds,
  isProjectMember,
  getMemberRole,
  canEditProject,
  canManageTeam,
  getProjectOrFail,
}
