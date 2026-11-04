const express = require('express')
const rateLimit = require('express-rate-limit')
const { body } = require('express-validator')
const {
  getProfile,
  updateProfile,
  changePassword,
  updateSettings,
  deactivateAccount,
} = require('../controllers/userController')
const validateRequest = require('../middleware/validateRequest')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password attempts. Please try again later.',
  },
})

router.use(protect)

router.get('/me', getProfile)

router.put(
  '/me',
  [
    body('name').optional().trim().isLength({ min: 2, max: 80 }),
    body('email').optional().trim().isEmail().normalizeEmail(),
    body('bio').optional().isString().isLength({ max: 300 }),
    body('avatar').optional().isString().isLength({ max: 500000 }),
  ],
  validateRequest,
  updateProfile,
)

router.put(
  '/me/password',
  passwordLimiter,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('confirmPassword').notEmpty().withMessage('Please confirm your password'),
  ],
  validateRequest,
  changePassword,
)

router.put(
  '/me/settings',
  [
    body('theme').optional().isIn(['dark', 'light']),
    body('emailNotifications').optional().isBoolean(),
    body('pushNotifications').optional().isBoolean(),
    body('deadlineReminders').optional().isBoolean(),
  ],
  validateRequest,
  updateSettings,
)

router.post(
  '/me/deactivate',
  passwordLimiter,
  [body('password').notEmpty().withMessage('Password is required')],
  validateRequest,
  deactivateAccount,
)

module.exports = router
