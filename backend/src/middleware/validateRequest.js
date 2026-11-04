const { validationResult } = require('express-validator')
const ApiError = require('../utils/ApiError')

/**
 * Run after express-validator chains. Returns 400 with first error message.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const message = errors.array()[0]?.msg || 'Validation failed'
    throw new ApiError(400, message)
  }

  next()
}

module.exports = validateRequest
