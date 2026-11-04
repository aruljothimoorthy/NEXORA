const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

/**
 * GET /api/health
 * Confirms API is up and reports MongoDB connection state.
 * Returns 503 in production when the database is not connected (Render health checks).
 */
router.get('/', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
  const dbState = states[mongoose.connection.readyState] || 'unknown'
  const dbOk = mongoose.connection.readyState === 1
  const isProduction = process.env.NODE_ENV === 'production'
  const status = isProduction && !dbOk ? 503 : 200

  res.status(status).json({
    success: dbOk || !isProduction,
    message: dbOk ? 'NEXORA API is running' : 'NEXORA API is up but database is unavailable',
    data: {
      service: 'nexora-api',
      environment: process.env.NODE_ENV || 'development',
      database: dbState,
      timestamp: new Date().toISOString(),
    },
  })
})

module.exports = router
