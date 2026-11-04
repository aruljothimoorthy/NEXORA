const express = require('express')
const rateLimit = require('express-rate-limit')
const {
  register,
  login,
  logout,
  getMe,
} = require('../controllers/authController')
const { registerValidator, loginValidator } = require('../validators/authValidators')
const validateRequest = require('../middleware/validateRequest')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts. Please try again later.',
  },
})

router.post('/register', authLimiter, registerValidator, validateRequest, register)
router.post('/login', authLimiter, loginValidator, validateRequest, login)
router.post('/logout', logout)
router.get('/me', protect, getMe)

module.exports = router
