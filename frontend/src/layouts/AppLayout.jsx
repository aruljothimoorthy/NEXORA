import { useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Bell,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from 'lucide-react'
import {
  logoutUser,
  selectAuth,
} from '../store/slices/authSlice'
import {
  checkDeadlineReminders,
  fetchNotifications,
} from '../store/slices/notificationsSlice'
import NotificationBell from '../components/notifications/NotificationBell'
import MobileBottomNav from '../components/layout/MobileBottomNav'
import useSocket from '../hooks/useSocket'
import { disconnectSocket } from '../services/socket'
import { getInitials } from '../utils/avatar'
import { cn } from '../utils/cn'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/projects', label: 'Projects', icon: FolderKanban },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
  { to: '/app/profile', label: 'Profile', icon: UserRound },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export default function AppLayout() {
  const dispatch = useDispatch()
  const { user } = useSelector(selectAuth)
  useSocket()

  useEffect(() => {
    dispatch(fetchNotifications())
    if (user?.settings?.deadlineReminders !== false) {
      dispatch(checkDeadlineReminders())
    }
  }, [dispatch, user?.settings?.deadlineReminders])

  const onLogout = () => {
    disconnectSocket()
    dispatch(logoutUser())
  }

  return (
    <div className="min-h-screen bg-nexora-bg text-nexora-text">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/5 p-5 md:flex">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl neon-gradient font-display text-sm font-bold text-white">
                N
              </span>
              <span className="font-display text-lg font-bold">NEXORA</span>
            </div>
            <NotificationBell />
          </div>

          <nav className="mt-10 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/app/dashboard'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                      isActive
                        ? 'bg-white/5 text-nexora-text'
                        : 'text-nexora-muted hover:bg-white/[0.03] hover:text-nexora-text',
                    )
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-auto pt-10">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    loading="lazy"
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl neon-gradient text-xs font-bold text-white">
                    {getInitials(user?.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user?.name}</p>
                  <p className="mt-0.5 truncate text-xs text-nexora-muted">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-nexora-muted transition hover:text-nexora-accent"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-[color:var(--nexora-bg)]/90 px-4 py-3 backdrop-blur-xl sm:px-6 md:hidden">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg neon-gradient font-display text-xs font-bold text-white">
                N
              </span>
              <span className="font-display font-bold">NEXORA</span>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-2.5 py-2 text-sm text-nexora-muted"
                aria-label="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 pb-24 sm:px-6 md:pb-8 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  )
}
