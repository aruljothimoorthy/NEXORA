import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAuth } from '../store/slices/authSlice'
import { pushNotification } from '../store/slices/notificationsSlice'
import { connectSocket, disconnectSocket, getSocket } from '../services/socket'

/**
 * Keeps Socket.IO connected for authenticated users and listens for notifications.
 */
export default function useSocket() {
  const dispatch = useDispatch()
  const { token, user } = useSelector(selectAuth)

  useEffect(() => {
    if (!token || !user) {
      disconnectSocket()
      return undefined
    }

    const socket = connectSocket(token)

    const onNotification = (payload) => {
      dispatch(pushNotification(payload))
    }

    socket?.on('notification:new', onNotification)

    return () => {
      socket?.off('notification:new', onNotification)
    }
  }, [token, user, dispatch])

  return getSocket()
}

export function joinProjectRoom(projectId) {
  const socket = getSocket()
  if (socket && projectId) {
    socket.emit('project:join', projectId)
  }
}

export function leaveProjectRoom(projectId) {
  const socket = getSocket()
  if (socket && projectId) {
    socket.emit('project:leave', projectId)
  }
}
