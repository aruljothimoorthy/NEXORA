const express = require('express')
const { body, param } = require('express-validator')
const {
  listTeam,
  inviteMember,
  updateMemberRole,
  removeMember,
} = require('../controllers/teamController')
const validateRequest = require('../middleware/validateRequest')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router({ mergeParams: true })

router.use(protect)

router.get('/', listTeam)

router.post(
  '/invite',
  [
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('role')
      .optional()
      .isIn(['admin', 'member', 'viewer'])
      .withMessage('Invalid role'),
  ],
  validateRequest,
  inviteMember,
)

router.patch(
  '/:userId',
  [
    param('userId').isMongoId().withMessage('Invalid user id'),
    body('role').isIn(['admin', 'member', 'viewer']).withMessage('Invalid role'),
  ],
  validateRequest,
  updateMemberRole,
)

router.delete(
  '/:userId',
  [param('userId').isMongoId().withMessage('Invalid user id')],
  validateRequest,
  removeMember,
)

module.exports = router
