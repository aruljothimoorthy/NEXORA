import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuth } from '../store/slices/authSlice'

export default function ProtectedRoute() {
  const location = useLocation()
  const { user, initialized, status, token } = useSelector(selectAuth)

  if (!initialized || (token && status === 'loading' && !user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nexora-bg text-nexora-muted">
        Checking your session…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
