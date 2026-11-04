const express = require('express')
const {
  getTask,
  updateTask,
  moveTask,
  deleteTask,
} = require('../controllers/taskController')
const {
  updateTaskValidator,
  moveTaskValidator,
  taskIdValidator,
} = require('../validators/taskValidators')
const { taskCommentRouter } = require('./commentRoutes')
const validateRequest = require('../middleware/validateRequest')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.use('/:taskId/comments', taskCommentRouter)

router.get('/:id', taskIdValidator, validateRequest, getTask)
router.put('/:id', updateTaskValidator, validateRequest, updateTask)
router.patch('/:id/move', moveTaskValidator, validateRequest, moveTask)
router.delete('/:id', taskIdValidator, validateRequest, deleteTask)

module.exports = router

