const Project = require('../models/Project')
const Task = require('../models/Task')
const Activity = require('../models/Activity')
const asyncHandler = require('../utils/asyncHandler')
const { getAccessibleProjectIds } = require('../utils/projectAccess')

const dayKey = (date) => date.toISOString().slice(0, 10)

/**
 * GET /api/dashboard
 * Aggregated analytics for the authenticated user.
 */
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const projectIds = await getAccessibleProjectIds(userId)

  const now = new Date()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const weekAgo = new Date(startOfToday)
  weekAgo.setDate(weekAgo.getDate() - 6)

  const [
    totalProjects,
    activeProjects,
    completedTasks,
    pendingTasks,
    projects,
    upcomingTasks,
    recentActivities,
    completedRecently,
  ] = await Promise.all([
    Project.countDocuments({
      $or: [{ owner: userId }, { 'members.user': userId }],
    }),
    Project.countDocuments({
      status: 'active',
      $or: [{ owner: userId }, { 'members.user': userId }],
    }),
    projectIds.length
      ? Task.countDocuments({ project: { $in: projectIds }, status: 'completed' })
      : Promise.resolve(0),
    projectIds.length
      ? Task.countDocuments({
          project: { $in: projectIds },
          status: { $ne: 'completed' },
        })
      : Promise.resolve(0),
    Project.find({
      $or: [{ owner: userId }, { 'members.user': userId }],
    })
      .select('name progress status priority dueDate color')
      .sort({ updatedAt: -1 })
      .limit(8)
      .lean(),
    projectIds.length
      ? Task.find({
          project: { $in: projectIds },
          status: { $ne: 'completed' },
          dueDate: { $ne: null, $gte: startOfToday },
        })
          .populate('project', 'name color')
          .populate('assignee', 'name')
          .sort({ dueDate: 1 })
          .limit(6)
          .lean()
      : Promise.resolve([]),
    Activity.find({ user: userId })
      .populate('project', 'name')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean(),
    projectIds.length
      ? Task.find({
          project: { $in: projectIds },
          status: 'completed',
          completedAt: { $gte: weekAgo },
        })
          .select('completedAt')
          .lean()
      : Promise.resolve([]),
  ])

  const productivityMap = {}
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    productivityMap[dayKey(d)] = 0
  }

  completedRecently.forEach((task) => {
    if (!task.completedAt) return
    const key = dayKey(new Date(task.completedAt))
    if (Object.prototype.hasOwnProperty.call(productivityMap, key)) {
      productivityMap[key] += 1
    }
  })

  const productivityChart = Object.entries(productivityMap).map(([date, count]) => ({
    date,
    label: new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      weekday: 'short',
    }),
    completed: count,
  }))

  const projectProgress = projects.map((project) => ({
    id: project._id,
    name: project.name,
    progress: project.progress ?? 0,
    status: project.status,
    priority: project.priority,
    color: project.color || '#8B5CF6',
  }))

  const upcomingDeadlines = upcomingTasks.map((task) => ({
    id: task._id,
    title: task.title,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    project: task.project
      ? { id: task.project._id, name: task.project.name, color: task.project.color }
      : null,
    assignee: task.assignee ? { id: task.assignee._id, name: task.assignee.name } : null,
  }))

  const activities = recentActivities.map((item) => ({
    id: item._id,
    type: item.type,
    message: item.message,
    createdAt: item.createdAt,
    project: item.project ? { id: item.project._id, name: item.project.name } : null,
  }))

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalProjects,
        activeProjects,
        completedTasks,
        pendingTasks,
      },
      productivityChart,
      projectProgress,
      upcomingDeadlines,
      recentActivities: activities,
    },
  })
})

/**
 * POST /api/dashboard/seed-demo
 * Creates sample projects/tasks/activities for empty dashboards (Phase 4 showcase).
 */
const seedDemoDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const existingCount = await Project.countDocuments({ owner: userId })

  if (existingCount > 0) {
    return res.status(200).json({
      success: true,
      message: 'Demo data already exists for this account',
      data: { seeded: false },
    })
  }

  const now = new Date()
  const addDays = (n) => {
    const d = new Date(now)
    d.setDate(d.getDate() + n)
    return d
  }

  const projects = await Project.insertMany([
    {
      name: 'NEXORA Launch',
      description: 'Ship the core SaaS experience for portfolio demos.',
      status: 'active',
      priority: 'high',
      startDate: addDays(-14),
      dueDate: addDays(10),
      progress: 68,
      owner: userId,
      members: [{ user: userId, role: 'owner' }],
      color: '#8B5CF6',
    },
    {
      name: 'Marketing Site Refresh',
      description: 'Update landing visuals and conversion paths.',
      status: 'active',
      priority: 'medium',
      startDate: addDays(-7),
      dueDate: addDays(18),
      progress: 42,
      owner: userId,
      members: [{ user: userId, role: 'owner' }],
      color: '#06B6D4',
    },
    {
      name: 'Mobile Polish',
      description: 'Responsive QA and reduced-motion fallbacks.',
      status: 'planning',
      priority: 'medium',
      startDate: now,
      dueDate: addDays(30),
      progress: 15,
      owner: userId,
      members: [{ user: userId, role: 'owner' }],
      color: '#EC4899',
    },
  ])

  const [launch, marketing, mobile] = projects

  const taskDocs = [
    {
      title: 'Finalize auth flows',
      project: launch._id,
      status: 'completed',
      priority: 'high',
      createdBy: userId,
      assignee: userId,
      dueDate: addDays(-2),
      completedAt: addDays(-1),
    },
    {
      title: 'Dashboard analytics API',
      project: launch._id,
      status: 'completed',
      priority: 'high',
      createdBy: userId,
      assignee: userId,
      dueDate: addDays(-1),
      completedAt: now,
    },
    {
      title: 'Kanban drag and drop',
      project: launch._id,
      status: 'in_progress',
      priority: 'urgent',
      createdBy: userId,
      assignee: userId,
      dueDate: addDays(3),
    },
    {
      title: 'Team invite emails',
      project: launch._id,
      status: 'todo',
      priority: 'medium',
      createdBy: userId,
      assignee: userId,
      dueDate: addDays(7),
    },
    {
      title: 'Hero performance pass',
      project: marketing._id,
      status: 'review',
      priority: 'medium',
      createdBy: userId,
      assignee: userId,
      dueDate: addDays(2),
    },
    {
      title: 'Pricing copy A/B',
      project: marketing._id,
      status: 'todo',
      priority: 'low',
      createdBy: userId,
      dueDate: addDays(5),
    },
    {
      title: 'Tablet breakpoint QA',
      project: mobile._id,
      status: 'todo',
      priority: 'medium',
      createdBy: userId,
      assignee: userId,
      dueDate: addDays(12),
    },
    {
      title: 'Chart responsiveness',
      project: launch._id,
      status: 'completed',
      priority: 'medium',
      createdBy: userId,
      assignee: userId,
      completedAt: addDays(-3),
      dueDate: addDays(-3),
    },
  ]

  const tasks = await Task.insertMany(taskDocs)

  await Activity.insertMany([
    {
      user: userId,
      type: 'project_created',
      message: 'Created project “NEXORA Launch”',
      project: launch._id,
    },
    {
      user: userId,
      type: 'task_completed',
      message: 'Completed “Dashboard analytics API”',
      project: launch._id,
      task: tasks[1]._id,
    },
    {
      user: userId,
      type: 'task_created',
      message: 'Added “Kanban drag and drop”',
      project: launch._id,
      task: tasks[2]._id,
    },
    {
      user: userId,
      type: 'project_created',
      message: 'Created project “Marketing Site Refresh”',
      project: marketing._id,
    },
    {
      user: userId,
      type: 'task_updated',
      message: 'Moved “Hero performance pass” to Review',
      project: marketing._id,
      task: tasks[4]._id,
    },
  ])

  res.status(201).json({
    success: true,
    message: 'Demo dashboard data created',
    data: {
      seeded: true,
      projects: projects.length,
      tasks: tasks.length,
    },
  })
})

module.exports = {
  getDashboard,
  seedDemoDashboard,
}
