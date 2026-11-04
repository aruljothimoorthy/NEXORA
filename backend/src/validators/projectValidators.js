const { body, param, query } = require('express-validator')

const projectStatuses = ['planning', 'active', 'on_hold', 'completed']
const priorities = ['low', 'medium', 'high', 'urgent']

const createProjectValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ max: 120 })
    .withMessage('Project name cannot exceed 120 characters'),
  body('description').optional().isString().isLength({ max: 2000 }),
  body('status').optional().isIn(projectStatuses).withMessage('Invalid status'),
  body('priority').optional().isIn(priorities).withMessage('Invalid priority'),
  body('startDate').optional({ nullable: true }).isISO8601().toDate(),
  body('dueDate').optional({ nullable: true }).isISO8601().toDate(),
  body('color').optional().isString().isLength({ max: 20 }),
]

const updateProjectValidator = [
  param('id').isMongoId().withMessage('Invalid project id'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty')
    .isLength({ max: 120 }),
  body('description').optional().isString().isLength({ max: 2000 }),
  body('status').optional().isIn(projectStatuses),
  body('priority').optional().isIn(priorities),
  body('startDate').optional({ nullable: true }).isISO8601().toDate(),
  body('dueDate').optional({ nullable: true }).isISO8601().toDate(),
  body('color').optional().isString().isLength({ max: 20 }),
]

const projectIdValidator = [
  param('id').isMongoId().withMessage('Invalid project id'),
]

const listProjectsValidator = [
  query('search').optional().isString(),
  query('status').optional().isIn([...projectStatuses, 'all']),
  query('priority').optional().isIn([...priorities, 'all']),
]

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  projectIdValidator,
  listProjectsValidator,
}
