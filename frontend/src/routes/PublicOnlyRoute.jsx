import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuth } from '../store/slices/authSlice'

/** Redirect authenticated users away from login/register. */
export default function PublicOnlyRoute() {
  const { user, initialized } = useSelector(selectAuth)

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nexora-bg text-nexora-muted">
        Loading…
      </div>
    )
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}
