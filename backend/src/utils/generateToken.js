const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/env')

/**
 * Create a signed JWT for the given user id.
 * @param {string} userId
 * @param {string} expiresIn
 */
const generateToken = (userId, expiresIn = '7d') => {
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign({ id: userId }, jwtSecret, { expiresIn })
}

module.exports = generateToken
