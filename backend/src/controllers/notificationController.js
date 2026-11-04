const Notification = require('../models/Notification')
const Task = require('../models/Task')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const { formatNotification, createNotification } = require('../utils/createNotification')
const { getAccessibleProjectIds } = require('../utils/projectAccess')

/**
 * GET /api/notifications
 */
const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'name email')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()

  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    read: false,
  })

  res.status(200).json({
    success: true,
    data: {
      unreadCount,
      notifications: notifications.map((n) => ({
        ...formatNotification(n),
        sender: n.sender
          ? { id: n.sender._id, name: n.sender.name, email: n.sender.email }
          : null,
      })),
    },
  })
})

/**
 * PATCH /api/notifications/:id/read
 */
const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  })

  if (!notification) {
    throw new ApiError(404, 'Notification not found')
  }

  notification.read = true
  await notification.save()

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: { notification: formatNotification(notification) },
  })
})

/**
 * PATCH /api/notifications/read-all
 */
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { $set: { read: true } },
  )

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  })
})

/**
 * POST /api/notifications/check-deadlines
 * Creates deadline reminder notifications for tasks due within 48 hours.
 */
const checkDeadlines = asyncHandler(async (req, res) => {
  if (req.user.settings?.deadlineReminders === false) {
    return res.status(200).json({
      success: true,
      data: { created: 0, skipped: true },
    })
  }

  const projectIds = await getAccessibleProjectIds(req.user._id)
  if (!projectIds.length) {
    return res.status(200).json({
      success: true,
      data: { created: 0 },
    })
  }

  const now = new Date()
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000)

  const dueSoon = await Task.find({
    project: { $in: projectIds },
    status: { $ne: 'completed' },
    dueDate: { $gte: now, $lte: in48h },
    $or: [{ assignee: req.user._id }, { createdBy: req.user._id }],
  }).limit(20)

  let created = 0

  for (const task of dueSoon) {
    const exists = await Notification.findOne({
      recipient: req.user._id,
      task: task._id,
      type: 'deadline_reminder',
      createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
    })

    if (exists) continue

    await createNotification({
      recipient: req.user._id,
      type: 'deadline_reminder',
      title: 'Deadline approaching',
      message: `“${task.title}” is due soon`,
      link: `/app/projects/${task.project}`,
      project: task.project,
      task: task._id,
    })
    created += 1
  }

  res.status(200).json({
    success: true,
    data: { created },
  })
})

module.exports = {
  listNotifications,
  markRead,
  markAllRead,
  checkDeadlines,
}
