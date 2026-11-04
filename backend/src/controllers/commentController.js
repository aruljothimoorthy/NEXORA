const Comment = require('../models/Comment')
const Task = require('../models/Task')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const logActivity = require('../utils/logActivity')
const { createNotification } = require('../utils/createNotification')
const { getProjectOrFail, getMemberRole } = require('../utils/projectAccess')
const { emitToProject } = require('../sockets')

const formatComment = (comment) => {
  const doc = comment.toObject ? comment.toObject() : comment
  return {
    id: doc._id,
    body: doc.body,
    task: doc.task,
    project: doc.project,
    author: doc.author
      ? {
          id: doc.author._id || doc.author,
          name: doc.author.name,
          email: doc.author.email,
          avatar: doc.author.avatar || '',
        }
      : null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

/**
 * GET /api/tasks/:taskId/comments
 */
const listComments = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.taskId)
  if (!task) throw new ApiError(404, 'Task not found')

  await getProjectOrFail(task.project, req.user._id)

  const comments = await Comment.find({ task: task._id })
    .populate('author', 'name email avatar')
    .sort({ createdAt: 1 })

  res.status(200).json({
    success: true,
    data: { comments: comments.map(formatComment) },
  })
})

/**
 * POST /api/tasks/:taskId/comments
 */
const createComment = asyncHandler(async (req, res) => {
  const { body } = req.body
  if (!body?.trim()) {
    throw new ApiError(400, 'Comment cannot be empty')
  }

  const task = await Task.findById(req.params.taskId)
  if (!task) throw new ApiError(404, 'Task not found')

  await getProjectOrFail(task.project, req.user._id, { requireEdit: true })

  const comment = await Comment.create({
    task: task._id,
    project: task.project,
    author: req.user._id,
    body: body.trim(),
  })

  await logActivity({
    user: req.user._id,
    type: 'comment_added',
    message: `Commented on “${task.title}”`,
    project: task.project,
    task: task._id,
  })

  if (task.assignee && String(task.assignee) !== String(req.user._id)) {
    await createNotification({
      recipient: task.assignee,
      sender: req.user._id,
      type: 'task_comment',
      title: 'New comment',
      message: `${req.user.name} commented on “${task.title}”`,
      link: `/app/projects/${task.project}`,
      project: task.project,
      task: task._id,
    })
  }

  const populated = await Comment.findById(comment._id).populate(
    'author',
    'name email avatar',
  )
  const formatted = formatComment(populated)

  emitToProject(task.project, 'comment:new', {
    taskId: String(task._id),
    comment: formatted,
  })

  res.status(201).json({
    success: true,
    message: 'Comment added',
    data: { comment: formatted },
  })
})

/**
 * DELETE /api/comments/:id
 */
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)
  if (!comment) throw new ApiError(404, 'Comment not found')

  const project = await getProjectOrFail(comment.project, req.user._id)
  const isAuthor = String(comment.author) === String(req.user._id)
  const role = getMemberRole(project, req.user._id)
  const canModerate = role === 'owner' || role === 'admin'

  if (!isAuthor && !canModerate) {
    throw new ApiError(403, 'You can only delete your own comments')
  }

  const taskId = String(comment.task)
  const projectId = String(comment.project)
  const commentId = String(comment._id)
  await comment.deleteOne()

  emitToProject(projectId, 'comment:deleted', { taskId, commentId })

  res.status(200).json({
    success: true,
    message: 'Comment deleted',
  })
})

module.exports = {
  listComments,
  createComment,
  deleteComment,
}
