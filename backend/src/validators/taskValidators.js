const { body, param } = require('express-validator')

const taskStatuses = ['todo', 'in_progress', 'review', 'completed']
const priorities = ['low', 'medium', 'high', 'urgent']

const createTaskValidator = [
  param('projectId').isMongoId().withMessage('Invalid project id'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 }),
  body('description').optional().isString().isLength({ max: 5000 }),
  body('status').optional().isIn(taskStatuses),
  body('priority').optional().isIn(priorities),
  body('assignee').optional({ nullable: true }).isMongoId(),
  body('dueDate').optional({ nullable: true }).isISO8601().toDate(),
]

const updateTaskValidator = [
  param('id').isMongoId().withMessage('Invalid task id'),
  body('title').optional().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().isString().isLength({ max: 5000 }),
  body('status').optional().isIn(taskStatuses),
  body('priority').optional().isIn(priorities),
  body('assignee').optional({ nullable: true }).isMongoId(),
  body('dueDate').optional({ nullable: true }).isISO8601().toDate(),
  body('order').optional().isInt({ min: 0 }),
]

const moveTaskValidator = [
  param('id').isMongoId().withMessage('Invalid task id'),
  body('status').isIn(taskStatuses).withMessage('Invalid status'),
  body('order').optional().isInt({ min: 0 }),
]

const taskIdValidator = [
  param('id').isMongoId().withMessage('Invalid task id'),
]

const projectIdParamValidator = [
  param('projectId').isMongoId().withMessage('Invalid project id'),
]

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  moveTaskValidator,
  taskIdValidator,
  projectIdParamValidator,
}
