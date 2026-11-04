const http = require('http')
const mongoose = require('mongoose')
const app = require('./app')
const connectDB = require('./config/db')
const { port, nodeEnv } = require('./config/env')
const { initSocket } = require('./sockets')

const startServer = async () => {
  let memoryServer

  try {
    if (process.env.USE_MEMORY_MONGO === 'true') {
      const startMemoryMongo = require('./config/memoryMongo')
      const memory = await startMemoryMongo()
      memoryServer = memory.mongod
      process.env.MONGODB_URI = memory.uri
    }

    await connectDB()
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)

    if (nodeEnv === 'production') {
      process.exit(1)
    }

    if (!memoryServer && process.env.USE_MEMORY_MONGO !== 'true') {
      console.warn(
        'Tip: set USE_MEMORY_MONGO=true in backend/.env for local auth testing without Atlas.',
      )
      console.warn(
        'Or set MONGODB_URI to your MongoDB Atlas connection string.',
      )
    }

    console.warn(
      'Starting API without database (development only). Auth routes will fail until MongoDB is connected.',
    )
  }

  const server = http.createServer(app)
  initSocket(server)

  server.listen(port, () => {
    console.log(`NEXORA API listening on port ${port} (${nodeEnv})`)
    console.log(
      `Database: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`,
    )
  })

  const shutdown = async () => {
    await mongoose.connection.close().catch(() => {})
    if (memoryServer) {
      await memoryServer.stop()
    }
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

startServer()
