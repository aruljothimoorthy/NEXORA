const jwt = require('jsonwebtoken')
const User = require('../models/User')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const { jwtSecret } = require('../config/env')

/**
 * Protect routes — requires valid JWT from cookie or Authorization header.
 * Tokens issued before a password change are rejected.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies?.nexora_token) {
    token = req.cookies.nexora_token
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized. Please log in.')
  }

  try {
    const decoded = jwt.verify(token, jwtSecret)
    const user = await User.findById(decoded.id)

    if (!user || !user.isActive) {
      throw new ApiError(401, 'Not authorized. User not found.')
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      throw new ApiError(401, 'Password was changed recently. Please log in again.')
    }

    req.user = user
    next()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(401, 'Not authorized. Token invalid or expired.')
  }
})

module.exports = { protect }
