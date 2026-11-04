const User = require('../models/User')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const generateToken = require('../utils/generateToken')
const formatUser = require('../utils/formatUser')
const { setAuthCookie, clearAuthCookie } = require('../utils/setAuthCookie')

const buildAuthPayload = (user, token) => ({
  user: formatUser(user),
  token,
})

/**
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existing = await User.findOne({ email })
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists')
  }

  const user = await User.create({ name, email, password })
  const token = generateToken(user._id, '7d')
  setAuthCookie(res, token, false)

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: buildAuthPayload(user, token),
  })
})

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe = false } = req.body

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password')
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated')
  }

  const expiresIn = rememberMe ? '30d' : '7d'
  const token = generateToken(user._id, expiresIn)
  setAuthCookie(res, token, Boolean(rememberMe))

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: buildAuthPayload(user, token),
  })
})

/**
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res)
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
})

/**
 * GET /api/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: formatUser(req.user),
    },
  })
})

module.exports = {
  register,
  login,
  logout,
  getMe,
}
