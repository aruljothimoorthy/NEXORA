const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '../../.env') })

const required = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL']

required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: environment variable ${key} is not set`)
  }
})

const nodeEnv = process.env.NODE_ENV || 'development'
const primaryClientUrl = process.env.CLIENT_URL || 'http://localhost:5173'

/** Support comma-separated CLIENT_URL values + common Vite ports in development. */
const clientOrigins = Array.from(
  new Set([
    ...primaryClientUrl.split(',').map((origin) => origin.trim()).filter(Boolean),
    ...(nodeEnv === 'development'
      ? ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']
      : []),
  ]),
)

module.exports = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: primaryClientUrl,
  clientOrigins,
  cookieSecure: process.env.COOKIE_SECURE === 'true',
}
