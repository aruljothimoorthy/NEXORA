/**
 * Centralized Express error handler.
 * Does not leak stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
  }

  if (err.name === 'CastError') {
    statusCode = 400
    message = `Invalid ${err.path || 'id'}`
  }

  if (err.code === 11000) {
    statusCode = 409
    const field = Object.keys(err.keyPattern || {})[0] || 'field'
    message = `An account with this ${field} already exists`
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Not authorized. Token invalid or expired.'
  }

  if (message.startsWith('CORS blocked')) {
    statusCode = 403
  }

  // Never expose internal driver details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error'
  }

  const code = statusCode >= 400 && statusCode < 600 ? statusCode : 500

  res.status(code).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorHandler
