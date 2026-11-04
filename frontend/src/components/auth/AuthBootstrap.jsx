import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchCurrentUser,
  markAuthInitialized,
  selectAuth,
} from '../../store/slices/authSlice'

/**
 * Restores session from JWT on app load.
 */
export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch()
  const { token, initialized } = useSelector(selectAuth)

  useEffect(() => {
    if (initialized) return

    if (token) {
      dispatch(fetchCurrentUser())
    } else {
      dispatch(markAuthInitialized())
    }
  }, [dispatch, token, initialized])

  return children
}
