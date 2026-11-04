const Task = require('../models/Task')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const logActivity = require('../utils/logActivity')
const syncProjectProgress = require('../utils/syncProjectProgress')
const { createNotification } = require('../utils/createNotification')
const { getProjectOrFail, isProjectMember } = require('../utils/projectAccess')

const formatTask = (task) => {
  const doc = task.toObject ? task.toObject() : task
  return {
    id: doc._id,
    title: doc.title,
    description: doc.description,
    project: doc.project?._id || doc.project,
    status: doc.status,
    priority: doc.priority,
    assignee: doc.assignee
      ? {
          id: doc.assignee._id || doc.assignee,
          name: doc.assignee.name,
          email: doc.assignee.email,
        }
      : null,
    createdBy: doc.createdBy,
    dueDate: doc.dueDate,
    completedAt: doc.completedAt,
    order: doc.order,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

const applyCompletionTimestamp = (task, nextStatus) => {
  if (nextStatus === 'completed' && task.status !== 'completed') {
    task.completedAt = new Date()
  }
  if (nextStatus !== 'completed') {
    task.completedAt = null
  }
  task.status = nextStatus
}

/**
 * GET /api/projects/:projectId/tasks
 */
const listTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id
  await getProjectOrFail(req.params.projectId, userId)

  const tasks = await Task.find({ project: req.params.projectId })
    .populate('assignee', 'name email')
    .populate('createdBy', 'name email')
    .sort({ order: 1, createdAt: 1 })

  const board = {
    todo: [],
    in_progress: [],
    review: [],
    completed: [],
  }

  tasks.forEach((task) => {
    const formatted = formatTask(task)
    if (board[formatted.status]) {
      board[formatted.status].push(formatted)
    }
  })

  res.status(200).json({
    success: true,
    data: {
      tasks: tasks.map(formatTask),
      board,
    },
  })
})

/**
 * POST /api/projects/:projectId/tasks
 */
const createTask = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const project = await getProjectOrFail(req.params.projectId, userId, {
    requireEdit: true,
  })

  const {
    title,
    description = '',
    status = 'todo',
    priority = 'medium',
    assignee = null,
    dueDate = null,
  } = req.body

  if (assignee && !isProjectMember(project, assignee)) {
    throw new ApiError(400, 'Assignee must be a project member')
  }

  const last = await Task.findOne({ project: project._id, status })
    .sort({ order: -1 })
    .select('order')

  const task = await Task.create({
    title,
    description,
    project: project._id,
    status,
    priority,
    assignee: assignee || null,
    dueDate: dueDate || undefined,
    createdBy: userId,
    order: last ? last.order + 1 : 0,
    completedAt: status === 'completed' ? new Date() : null,
  })

  await syncProjectProgress(project._id)
  await logActivity({
    user: userId,
    type: 'task_created',
    message: `Created task “${task.title}”`,
    project: project._id,
    task: task._id,
  })

  if (task.assignee) {
    await createNotification({
      recipient: task.assignee,
      sender: userId,
      type: 'task_assigned',
      title: 'Task assigned',
      message: `${req.user.name} assigned you “${task.title}”`,
      link: `/app/projects/${project._id}`,
      project: project._id,
      task: task._id,
    })
  }

  const populated = await Task.findById(task._id).populate(
    'assignee',
    'name email',
  )

  res.status(201).json({
    success: true,
    message: 'Task created',
    data: { task: formatTask(populated) },
  })
})

/**
 * GET /api/tasks/:id
 */
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignee', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name color members owner')

  if (!task) {
    throw new ApiError(404, 'Task not found')
  }

  await getProjectOrFail(task.project._id || task.project, req.user._id)

  res.status(200).json({
    success: true,
    data: { task: formatTask(task) },
  })
})

/**
 * PUT /api/tasks/:id
 */
const updateTask = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const task = await Task.findById(req.params.id)

  if (!task) {
    throw new ApiError(404, 'Task not found')
  }

  const project = await getProjectOrFail(task.project, userId, {
    requireEdit: true,
  })

  const prevStatus = task.status
  const prevAssignee = task.assignee ? String(task.assignee) : null

  if (Object.prototype.hasOwnProperty.call(req.body, 'title')) {
    task.title = req.body.title
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'description')) {
    task.description = req.body.description
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'priority')) {
    task.priority = req.body.priority
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'dueDate')) {
    task.dueDate = req.body.dueDate
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'order')) {
    task.order = req.body.order
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'assignee')) {
    if (req.body.assignee && !isProjectMember(project, req.body.assignee)) {
      throw new ApiError(400, 'Assignee must be a project member')
    }
    task.assignee = req.body.assignee || null
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'status')) {
    applyCompletionTimestamp(task, req.body.status)
  }

  await task.save()
  await syncProjectProgress(project._id)

  const type =
    task.status === 'completed' && prevStatus !== 'completed'
      ? 'task_completed'
      : 'task_updated'

  await logActivity({
    user: userId,
    type,
    message:
      type === 'task_completed'
        ? `Completed “${task.title}”`
        : `Updated task “${task.title}”`,
    project: project._id,
    task: task._id,
  })

  const nextAssignee = task.assignee ? String(task.assignee) : null
  if (nextAssignee && nextAssignee !== prevAssignee) {
    await createNotification({
      recipient: task.assignee,
      sender: userId,
      type: 'task_assigned',
      title: 'Task assigned',
      message: `${req.user.name} assigned you “${task.title}”`,
      link: `/app/projects/${project._id}`,
      project: project._id,
      task: task._id,
    })
  }

  const populated = await Task.findById(task._id).populate(
    'assignee',
    'name email',
  )

  res.status(200).json({
    success: true,
    message: 'Task updated',
    data: { task: formatTask(populated) },
  })
})

/**
 * PATCH /api/tasks/:id/move
 * Optimized for Kanban drag-and-drop.
 */
const moveTask = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const task = await Task.findById(req.params.id)

  if (!task) {
    throw new ApiError(404, 'Task not found')
  }

  const project = await getProjectOrFail(task.project, userId, {
    requireEdit: true,
  })

  const { status, order = 0 } = req.body
  const prevStatus = task.status

  applyCompletionTimestamp(task, status)
  task.order = order
  await task.save()

  // Re-index sibling cards in the destination column for stable order
  const siblings = await Task.find({
    project: project._id,
    status,
    _id: { $ne: task._id },
  }).sort({ order: 1, createdAt: 1 })

  const updates = siblings.map((sibling, index) => {
    const nextOrder = index >= order ? index + 1 : index
    if (sibling.order !== nextOrder) {
      sibling.order = nextOrder
      return sibling.save()
    }
    return null
  })

  await Promise.all(updates.filter(Boolean))
  await syncProjectProgress(project._id)

  if (status === 'completed' && prevStatus !== 'completed') {
    await logActivity({
      user: userId,
      type: 'task_completed',
      message: `Completed “${task.title}”`,
      project: project._id,
      task: task._id,
    })
  } else if (prevStatus !== status) {
    await logActivity({
      user: userId,
      type: 'task_updated',
      message: `Moved “${task.title}” to ${status.replace('_', ' ')}`,
      project: project._id,
      task: task._id,
    })
  }

  const populated = await Task.findById(task._id).populate(
    'assignee',
    'name email',
  )

  res.status(200).json({
    success: true,
    message: 'Task moved',
    data: { task: formatTask(populated) },
  })
})

/**
 * DELETE /api/tasks/:id
 */
const deleteTask = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const task = await Task.findById(req.params.id)

  if (!task) {
    throw new ApiError(404, 'Task not found')
  }

  const project = await getProjectOrFail(task.project, userId, {
    requireEdit: true,
  })

  const title = task.title
  const projectId = project._id
  await task.deleteOne()
  await syncProjectProgress(projectId)

  await logActivity({
    user: userId,
    type: 'task_updated',
    message: `Deleted task “${title}”`,
    project: projectId,
  })

  res.status(200).json({
    success: true,
    message: 'Task deleted',
  })
})

module.exports = {
  listTasks,
  createTask,
  getTask,
  updateTask,
  moveTask,
  deleteTask,
}
