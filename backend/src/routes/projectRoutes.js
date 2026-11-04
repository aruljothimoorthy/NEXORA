const express = require('express')
const {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController')
const {
  listTasks,
  createTask,
} = require('../controllers/taskController')
const {
  createProjectValidator,
  updateProjectValidator,
  projectIdValidator,
  listProjectsValidator,
} = require('../validators/projectValidators')
const {
  createTaskValidator,
  projectIdParamValidator,
} = require('../validators/taskValidators')
const teamRoutes = require('./teamRoutes')
const validateRequest = require('../middleware/validateRequest')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.get('/', listProjectsValidator, validateRequest, listProjects)
router.post('/', createProjectValidator, validateRequest, createProject)

router.use('/:projectId/team', teamRoutes)

router.get(
  '/:projectId/tasks',
  projectIdParamValidator,
  validateRequest,
  listTasks,
)
router.post(
  '/:projectId/tasks',
  createTaskValidator,
  validateRequest,
  createTask,
)

router.get('/:id', projectIdValidator, validateRequest, getProject)
router.put('/:id', updateProjectValidator, validateRequest, updateProject)
router.delete('/:id', projectIdValidator, validateRequest, deleteProject)

module.exports = router

