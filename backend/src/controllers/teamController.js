const User = require('../models/User')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const logActivity = require('../utils/logActivity')
const { createNotification } = require('../utils/createNotification')
const {
  getProjectOrFail,
  getMemberRole,
  canManageTeam,
} = require('../utils/projectAccess')
const { emitToProject } = require('../sockets')

const formatMembers = (project) =>
  (project.members || []).map((member) => {
    const user = member.user
    return {
      role: member.role,
      user: user
        ? {
            id: user._id || user.id || user,
            name: user.name,
            email: user.email,
            avatar: user.avatar || '',
          }
        : null,
    }
  })

/**
 * GET /api/projects/:projectId/team
 */
const listTeam = asyncHandler(async (req, res) => {
  const project = await getProjectOrFail(req.params.projectId, req.user._id)
  await project.populate('members.user', 'name email avatar')
  await project.populate('owner', 'name email avatar')

  res.status(200).json({
    success: true,
    data: {
      owner: {
        id: project.owner._id,
        name: project.owner.name,
        email: project.owner.email,
      },
      members: formatMembers(project),
      yourRole: getMemberRole(project, req.user._id),
      canManage: canManageTeam(project, req.user._id),
    },
  })
})

/**
 * POST /api/projects/:projectId/team/invite
 * Invite an existing NEXORA user by email.
 */
const inviteMember = asyncHandler(async (req, res) => {
  const { email, role = 'member' } = req.body
  const allowedRoles = ['admin', 'member', 'viewer']

  if (!email) {
    throw new ApiError(400, 'Email is required')
  }
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, 'Invalid role')
  }

  const project = await getProjectOrFail(req.params.projectId, req.user._id, {
    requireManageTeam: true,
  })

  const invitee = await User.findOne({ email: email.toLowerCase().trim() })
  if (!invitee) {
    throw new ApiError(
      404,
      'No NEXORA account found for that email. Ask them to register first.',
    )
  }

  if (String(invitee._id) === String(project.owner)) {
    throw new ApiError(400, 'Project owner is already on the team')
  }

  const already = project.members.some(
    (m) => String(m.user) === String(invitee._id),
  )
  if (already) {
    throw new ApiError(409, 'User is already a project member')
  }

  project.members.push({ user: invitee._id, role })
  await project.save()

  await logActivity({
    user: req.user._id,
    type: 'member_added',
    message: `Invited ${invitee.name} as ${role}`,
    project: project._id,
  })

  await createNotification({
    recipient: invitee._id,
    sender: req.user._id,
    type: 'project_invite',
    title: 'Project invitation',
    message: `${req.user.name} added you to “${project.name}” as ${role}`,
    link: `/app/projects/${project._id}`,
    project: project._id,
  })

  await project.populate('members.user', 'name email avatar')

  const payload = {
    projectId: project._id,
    members: formatMembers(project),
  }
  emitToProject(project._id, 'team:updated', payload)

  res.status(201).json({
    success: true,
    message: 'Member invited',
    data: payload,
  })
})

/**
 * PATCH /api/projects/:projectId/team/:userId
 */
const updateMemberRole = asyncHandler(async (req, res) => {
  const { role } = req.body
  const allowedRoles = ['admin', 'member', 'viewer']
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, 'Invalid role')
  }

  const project = await getProjectOrFail(req.params.projectId, req.user._id, {
    requireManageTeam: true,
  })

  if (String(project.owner) === String(req.params.userId)) {
    throw new ApiError(400, 'Cannot change the owner role this way')
  }

  const member = project.members.find(
    (m) => String(m.user) === String(req.params.userId),
  )
  if (!member) {
    throw new ApiError(404, 'Member not found on this project')
  }

  member.role = role
  await project.save()

  await logActivity({
    user: req.user._id,
    type: 'project_updated',
    message: `Updated member role to ${role}`,
    project: project._id,
  })

  await createNotification({
    recipient: req.params.userId,
    sender: req.user._id,
    type: 'role_updated',
    title: 'Role updated',
    message: `Your role on “${project.name}” is now ${role}`,
    link: `/app/projects/${project._id}`,
    project: project._id,
  })

  await project.populate('members.user', 'name email avatar')
  const payload = {
    projectId: project._id,
    members: formatMembers(project),
  }
  emitToProject(project._id, 'team:updated', payload)

  res.status(200).json({
    success: true,
    message: 'Member role updated',
    data: payload,
  })
})

/**
 * DELETE /api/projects/:projectId/team/:userId
 */
const removeMember = asyncHandler(async (req, res) => {
  const project = await getProjectOrFail(req.params.projectId, req.user._id, {
    requireManageTeam: true,
  })

  if (String(project.owner) === String(req.params.userId)) {
    throw new ApiError(400, 'Cannot remove the project owner')
  }

  const before = project.members.length
  project.members = project.members.filter(
    (m) => String(m.user) !== String(req.params.userId),
  )

  if (project.members.length === before) {
    throw new ApiError(404, 'Member not found on this project')
  }

  await project.save()

  await logActivity({
    user: req.user._id,
    type: 'project_updated',
    message: 'Removed a team member',
    project: project._id,
  })

  await createNotification({
    recipient: req.params.userId,
    sender: req.user._id,
    type: 'member_removed',
    title: 'Removed from project',
    message: `You were removed from “${project.name}”`,
    link: '/app/projects',
    project: project._id,
  })

  await project.populate('members.user', 'name email avatar')
  const payload = {
    projectId: project._id,
    members: formatMembers(project),
  }
  emitToProject(project._id, 'team:updated', payload)

  res.status(200).json({
    success: true,
    message: 'Member removed',
    data: payload,
  })
})

module.exports = {
  listTeam,
  inviteMember,
  updateMemberRole,
  removeMember,
}
