const express = require('express')
const { body, param } = require('express-validator')
const {
  listComments,
  createComment,
  deleteComment,
} = require('../controllers/commentController')
const validateRequest = require('../middleware/validateRequest')
const { protect } = require('../middleware/authMiddleware')

const taskCommentRouter = express.Router({ mergeParams: true })
taskCommentRouter.use(protect)

taskCommentRouter.get('/', listComments)
taskCommentRouter.post(
  '/',
  [
    body('body')
      .trim()
      .notEmpty()
      .withMessage('Comment cannot be empty')
      .isLength({ max: 2000 }),
  ],
  validateRequest,
  createComment,
)

const commentRouter = express.Router()
commentRouter.use(protect)
commentRouter.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid comment id')],
  validateRequest,
  deleteComment,
)

module.exports = {
  taskCommentRouter,
  commentRouter,
}
