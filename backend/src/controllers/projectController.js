const Project = require('../models/Project')
const Task = require('../models/Task')
const Activity = require('../models/Activity')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const logActivity = require('../utils/logActivity')
const { getProjectOrFail, getMemberRole } = require('../utils/projectAccess')

const formatMember = (member) => {
  const user = member.user
  if (!user) {
    return { role: member.role, user: null }
  }
  if (typeof user === 'string' || user._bsontype === 'ObjectId') {
    return { role: member.role, user: { id: user } }
  }
  return {
    role: member.role,
    user: {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || '',
    },
  }
}

const formatProject = (project, userId) => {
  const doc = project.toObject ? project.toObject() : project
  const owner =
    doc.owner && typeof doc.owner === 'object'
      ? {
          id: doc.owner._id || doc.owner.id,
          name: doc.owner.name,
          email: doc.owner.email,
        }
      : { id: doc.owner }

  return {
    id: doc._id,
    name: doc.name,
    description: doc.description,
    status: doc.status,
    priority: doc.priority,
    startDate: doc.startDate,
    dueDate: doc.dueDate,
    progress: doc.progress,
    color: doc.color,
    owner,
    members: (doc.members || []).map(formatMember),
    role: userId ? getMemberRole(doc, userId) : undefined,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

/**
 * GET /api/projects
 */
const listProjects = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const { search = '', status = 'all', priority = 'all' } = req.query

  const filter = {
    $or: [{ owner: userId }, { 'members.user': userId }],
  }

  if (status && status !== 'all') {
    filter.status = status
  }
  if (priority && priority !== 'all') {
    filter.priority = priority
  }
  if (search.trim()) {
    filter.$and = [
      {
        $or: [
          { name: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
        ],
      },
    ]
  }

  const projects = await Project.find(filter)
    .populate('owner', 'name email')
    .populate('members.user', 'name email')
    .sort({ updatedAt: -1 })

  res.status(200).json({
    success: true,
    data: {
      projects: projects.map((p) => formatProject(p, userId)),
    },
  })
})

/**
 * POST /api/projects
 */
const createProject = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const {
    name,
    description = '',
    status = 'planning',
    priority = 'medium',
    startDate,
    dueDate,
    color = '#8B5CF6',
  } = req.body

  const project = await Project.create({
    name,
    description,
    status,
    priority,
    startDate: startDate || new Date(),
    dueDate: dueDate || undefined,
    color,
    owner: userId,
    members: [{ user: userId, role: 'owner' }],
  })

  await logActivity({
    user: userId,
    type: 'project_created',
    message: `Created project “${project.name}”`,
    project: project._id,
  })

  const populated = await Project.findById(project._id)
    .populate('owner', 'name email')
    .populate('members.user', 'name email')

  res.status(201).json({
    success: true,
    message: 'Project created',
    data: { project: formatProject(populated, userId) },
  })
})

/**
 * GET /api/projects/:id
 */
const getProject = asyncHandler(async (req, res) => {
  const userId = req.user._id
  await getProjectOrFail(req.params.id, userId)

  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar')

  const [taskStats, recentActivities, recentTasks] = await Promise.all([
    Task.aggregate([
      { $match: { project: project._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Activity.find({ project: project._id })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate('user', 'name')
      .lean(),
    Task.find({ project: project._id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('assignee', 'name email')
      .lean(),
  ])

  const stats = {
    todo: 0,
    in_progress: 0,
    review: 0,
    completed: 0,
    total: 0,
  }

  taskStats.forEach((row) => {
    stats[row._id] = row.count
    stats.total += row.count
  })

  res.status(200).json({
    success: true,
    data: {
      project: formatProject(project, userId),
      taskStats: stats,
      recentActivities: recentActivities.map((a) => ({
        id: a._id,
        type: a.type,
        message: a.message,
        createdAt: a.createdAt,
        user: a.user ? { id: a.user._id, name: a.user.name } : null,
      })),
      recentTasks: recentTasks.map((t) => ({
        id: t._id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        assignee: t.assignee
          ? { id: t.assignee._id, name: t.assignee.name }
          : null,
      })),
    },
  })
})

/**
 * PUT /api/projects/:id
 */
const updateProject = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const project = await getProjectOrFail(req.params.id, userId, {
    requireEdit: true,
  })

  const fields = [
    'name',
    'description',
    'status',
    'priority',
    'startDate',
    'dueDate',
    'color',
  ]

  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      project[field] = req.body[field]
    }
  })

  await project.save()

  await logActivity({
    user: userId,
    type: 'project_updated',
    message: `Updated project “${project.name}”`,
    project: project._id,
  })

  const populated = await Project.findById(project._id)
    .populate('owner', 'name email')
    .populate('members.user', 'name email')

  res.status(200).json({
    success: true,
    message: 'Project updated',
    data: { project: formatProject(populated, userId) },
  })
})

/**
 * DELETE /api/projects/:id
 */
const deleteProject = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const project = await getProjectOrFail(req.params.id, userId)

  if (getMemberRole(project, userId) !== 'owner') {
    throw new ApiError(403, 'Only the project owner can delete this project')
  }

  await Task.deleteMany({ project: project._id })
  await Activity.deleteMany({ project: project._id })
  await project.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Project deleted',
  })
})

module.exports = {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
}
