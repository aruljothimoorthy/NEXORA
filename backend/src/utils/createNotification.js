const Notification = require('../models/Notification')
const User = require('../models/User')
const { emitToUser } = require('../sockets')

const formatNotification = (doc) => ({
  id: doc._id,
  type: doc.type,
  title: doc.title,
  message: doc.message,
  link: doc.link || '',
  project: doc.project,
  task: doc.task,
  read: doc.read,
  sender: doc.sender,
  createdAt: doc.createdAt,
})

/**
 * Persist a notification and push it over Socket.IO when possible.
 */
const createNotification = async ({
  recipient,
  sender = null,
  type = 'system',
  title,
  message,
  link = '',
  project = null,
  task = null,
}) => {
  if (!recipient) return null
  if (sender && String(recipient) === String(sender)) return null

  const recipientUser = await User.findById(recipient).select('settings isActive')
  if (!recipientUser || !recipientUser.isActive) return null

  if (
    type !== 'system' &&
    recipientUser.settings?.pushNotifications === false
  ) {
    // Still store for inbox history, but skip realtime push
  }

  const notification = await Notification.create({
    recipient,
    sender,
    type,
    title,
    message,
    link,
    project,
    task,
  })

  const populated = await Notification.findById(notification._id)
    .populate('sender', 'name email')
    .lean()

  const payload = {
    ...formatNotification(populated),
    sender: populated.sender
      ? {
          id: populated.sender._id,
          name: populated.sender.name,
          email: populated.sender.email,
        }
      : null,
  }

  if (recipientUser.settings?.pushNotifications !== false) {
    emitToUser(recipient, 'notification:new', payload)
  }

  return payload
}

module.exports = {
  createNotification,
  formatNotification,
}
