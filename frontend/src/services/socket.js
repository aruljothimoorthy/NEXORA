import { io } from 'socket.io-client'

let socket = null

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  return apiUrl.replace(/\/api\/?$/, '')
}

export const connectSocket = (token) => {
  if (!token) return null

  if (socket?.connected) {
    return socket
  }

  if (socket) {
    socket.auth = { token }
    socket.connect()
    return socket
  }

  socket = io(getSocketUrl(), {
    auth: { token },
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true,
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket
