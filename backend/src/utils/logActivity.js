const Activity = require('../models/Activity')

const logActivity = async ({
  user,
  type = 'system',
  message,
  project = null,
  task = null,
}) => {
  try {
    await Activity.create({
      user,
      type,
      message,
      project,
      task,
    })
  } catch (error) {
    console.error('Failed to log activity:', error.message)
  }
}

module.exports = logActivity
