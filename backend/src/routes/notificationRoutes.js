const express = require('express')
const { param } = require('express-validator')
const {
  listNotifications,
  markRead,
  markAllRead,
  checkDeadlines,
} = require('../controllers/notificationController')
const validateRequest = require('../middleware/validateRequest')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.get('/', listNotifications)
router.patch('/read-all', markAllRead)
router.post('/check-deadlines', checkDeadlines)
router.patch(
  '/:id/read',
  [param('id').isMongoId().withMessage('Invalid notification id')],
  validateRequest,
  markRead,
)

module.exports = router
