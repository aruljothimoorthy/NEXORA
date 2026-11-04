const Task = require('../models/Task')
const Project = require('../models/Project')

/**
 * Recalculate project progress from task completion ratio.
 */
const syncProjectProgress = async (projectId) => {
  const [total, completed] = await Promise.all([
    Task.countDocuments({ project: projectId }),
    Task.countDocuments({ project: projectId, status: 'completed' }),
  ])

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

  await Project.findByIdAndUpdate(projectId, { progress })
  return progress
}

module.exports = syncProjectProgress
