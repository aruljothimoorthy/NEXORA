import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Bell } from 'lucide-react'
import {
  fetchNotifications,
  markNotificationRead,
  selectNotifications,
} from '../../store/slices/notificationsSlice'

export default function NotificationBell() {
  const dispatch = useDispatch()
  const { items, unreadCount } = useSelector(selectNotifications)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const recent = items.slice(0, 6)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          dispatch(fetchNotifications())
        }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-nexora-muted transition hover:text-nexora-text"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-nexora-accent px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1020] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <Link
              to="/app/notifications"
              onClick={() => setOpen(false)}
              className="text-xs text-nexora-secondary hover:text-nexora-text"
            >
              View all
            </Link>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {!recent.length ? (
              <li className="px-4 py-8 text-center text-sm text-nexora-muted">
                You’re all caught up.
              </li>
            ) : (
              recent.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left transition hover:bg-white/5 ${
                      item.read ? 'opacity-70' : ''
                    }`}
                    onClick={() => {
                      if (!item.read) dispatch(markNotificationRead(item.id))
                      setOpen(false)
                    }}
                  >
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-nexora-muted">{item.message}</p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
