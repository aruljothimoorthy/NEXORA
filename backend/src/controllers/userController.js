const User = require('../models/User')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const formatUser = require('../utils/formatUser')
const { clearAuthCookie } = require('../utils/setAuthCookie')

/**
 * GET /api/users/me
 */
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: formatUser(req.user) },
  })
})

/**
 * PUT /api/users/me
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, bio, avatar } = req.body
  const user = await User.findById(req.user._id)

  if (!user || !user.isActive) {
    throw new ApiError(404, 'User not found')
  }

  if (typeof name === 'string') {
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      throw new ApiError(400, 'Name must be at least 2 characters')
    }
    user.name = trimmed
  }

  if (typeof bio === 'string') {
    if (bio.length > 300) {
      throw new ApiError(400, 'Bio cannot exceed 300 characters')
    }
    user.bio = bio.trim()
  }

  if (typeof avatar === 'string') {
    if (avatar.length > 500000) {
      throw new ApiError(400, 'Avatar image is too large')
    }
    user.avatar = avatar.trim()
  }

  if (typeof email === 'string') {
    const nextEmail = email.toLowerCase().trim()
    if (!/^\S+@\S+\.\S+$/.test(nextEmail)) {
      throw new ApiError(400, 'Please provide a valid email')
    }
    if (nextEmail !== user.email) {
      const exists = await User.findOne({ email: nextEmail })
      if (exists) {
        throw new ApiError(409, 'An account with this email already exists')
      }
      user.email = nextEmail
    }
  }

  await user.save()

  res.status(200).json({
    success: true,
    message: 'Profile updated',
    data: { user: formatUser(user) },
  })
})

/**
 * PUT /api/users/me/password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current and new password are required')
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, 'Passwords do not match')
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters')
  }

  if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
    throw new ApiError(400, 'Password must include a letter and a number')
  }

  if (currentPassword === newPassword) {
    throw new ApiError(400, 'New password must be different from the current password')
  }

  const user = await User.findById(req.user._id).select('+password')
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  const matches = await user.comparePassword(currentPassword)
  if (!matches) {
    throw new ApiError(401, 'Current password is incorrect')
  }

  user.password = newPassword
  await user.save()

  clearAuthCookie(res)

  res.status(200).json({
    success: true,
    message: 'Password updated. Please log in again.',
    data: { requireReauth: true },
  })
})

/**
 * PUT /api/users/me/settings
 */
const updateSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  if (!user.settings) {
    user.settings = {}
  }

  const { theme, emailNotifications, pushNotifications, deadlineReminders } =
    req.body

  if (theme !== undefined) {
    if (!['dark', 'light'].includes(theme)) {
      throw new ApiError(400, 'Theme must be dark or light')
    }
    user.settings.theme = theme
  }

  if (typeof emailNotifications === 'boolean') {
    user.settings.emailNotifications = emailNotifications
  }
  if (typeof pushNotifications === 'boolean') {
    user.settings.pushNotifications = pushNotifications
  }
  if (typeof deadlineReminders === 'boolean') {
    user.settings.deadlineReminders = deadlineReminders
  }

  await user.save()

  res.status(200).json({
    success: true,
    message: 'Settings updated',
    data: { user: formatUser(user) },
  })
})

/**
 * POST /api/users/me/deactivate
 */
const deactivateAccount = asyncHandler(async (req, res) => {
  const { password } = req.body
  if (!password) {
    throw new ApiError(400, 'Password is required to deactivate your account')
  }

  const user = await User.findById(req.user._id).select('+password')
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  const matches = await user.comparePassword(password)
  if (!matches) {
    throw new ApiError(401, 'Password is incorrect')
  }

  user.isActive = false
  await user.save()
  clearAuthCookie(res)

  res.status(200).json({
    success: true,
    message: 'Account deactivated',
  })
})

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateSettings,
  deactivateAccount,
}
