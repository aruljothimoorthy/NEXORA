const express = require('express')
const mongoose = require('mongoose')

const router = express.Router()

/**
 * GET /api/health
 * Confirms API is up and reports MongoDB connection state.
 */
router.get('/', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting']
  const dbState = states[mongoose.connection.readyState] || 'unknown'

  res.status(200).json({
    success: true,
    message: 'NEXORA API is running',
    data: {
      service: 'nexora-api',
      environment: process.env.NODE_ENV || 'development',
      database: dbState,
      timestamp: new Date().toISOString(),
    },
  })
})

module.exports = router
