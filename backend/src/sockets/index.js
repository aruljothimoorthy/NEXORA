const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const { clientOrigins, jwtSecret } = require('../config/env')
const User = require('../models/User')

let io = null

/**
 * Initialize Socket.IO on the HTTP server.
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: clientOrigins,
      credentials: true,
    },
  })

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '')

      if (!token) {
        return next(new Error('Unauthorized'))
      }

      const decoded = jwt.verify(token, jwtSecret)
      const user = await User.findById(decoded.id).select('_id name email')
      if (!user || !user.isActive) {
        return next(new Error('Unauthorized'))
      }

      socket.user = user
      return next()
    } catch (error) {
      return next(new Error('Unauthorized'))
    }
  })

  io.on('connection', (socket) => {
    const userId = String(socket.user._id)
    socket.join(`user:${userId}`)

    socket.on('project:join', (projectId) => {
      if (projectId) {
        socket.join(`project:${projectId}`)
      }
    })

    socket.on('project:leave', (projectId) => {
      if (projectId) {
        socket.leave(`project:${projectId}`)
      }
    })

    socket.on('disconnect', () => {})
  })

  console.log('Socket.IO initialized')
  return io
}

const getIO = () => io

const emitToUser = (userId, event, payload) => {
  if (!io) return
  io.to(`user:${String(userId)}`).emit(event, payload)
}

const emitToProject = (projectId, event, payload) => {
  if (!io) return
  io.to(`project:${String(projectId)}`).emit(event, payload)
}

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToProject,
}
