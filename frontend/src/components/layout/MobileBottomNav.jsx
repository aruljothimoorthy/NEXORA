import { NavLink } from 'react-router-dom'
import {
  Bell,
  FolderKanban,
  LayoutDashboard,
  Settings,
  UserRound,
} from 'lucide-react'
import { cn } from '../../utils/cn'

const items = [
  { to: '/app/dashboard', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/app/projects', label: 'Projects', icon: FolderKanban },
  { to: '/app/notifications', label: 'Alerts', icon: Bell },
  { to: '/app/profile', label: 'Profile', icon: UserRound },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export default function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[color:var(--nexora-bg)]/95 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition',
                    isActive
                      ? 'text-nexora-secondary'
                      : 'text-nexora-muted hover:text-nexora-text',
                  )
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
