const { cookieSecure, nodeEnv } = require('../config/env')

/**
 * Set httpOnly JWT cookie. Longer maxAge when rememberMe is true.
 */
const setAuthCookie = (res, token, rememberMe = false) => {
  const maxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 7 * 24 * 60 * 60 * 1000

  res.cookie('nexora_token', token, {
    httpOnly: true,
    secure: cookieSecure || nodeEnv === 'production',
    sameSite: nodeEnv === 'production' ? 'none' : 'lax',
    maxAge,
    path: '/',
  })
}

const clearAuthCookie = (res) => {
  res.clearCookie('nexora_token', {
    httpOnly: true,
    secure: cookieSecure || nodeEnv === 'production',
    sameSite: nodeEnv === 'production' ? 'none' : 'lax',
    path: '/',
  })
}

module.exports = { setAuthCookie, clearAuthCookie }
