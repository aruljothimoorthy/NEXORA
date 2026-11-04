import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { BellRing } from 'lucide-react'
import Button from '../../components/ui/Button'
import {
  checkDeadlineReminders,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  selectNotifications,
} from '../../store/slices/notificationsSlice'

export default function NotificationsPage() {
  const dispatch = useDispatch()
  const { items, unreadCount, status } = useSelector(selectNotifications)

  useEffect(() => {
    dispatch(fetchNotifications())
    dispatch(checkDeadlineReminders())
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.28em] text-nexora-secondary uppercase">
            Notifications
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Stay in the loop
          </h1>
          <p className="mt-2 text-nexora-muted">
            Invites, assignments, comments, and deadline reminders — realtime via Socket.IO.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={!unreadCount}
          onClick={() => dispatch(markAllNotificationsRead())}
        >
          Mark all read
        </Button>
      </div>

      {status === 'loading' && !items.length ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : !items.length ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
          <BellRing className="mx-auto text-nexora-secondary" size={28} />
          <p className="mt-4 font-display text-lg font-semibold">No notifications yet</p>
          <p className="mt-2 text-sm text-nexora-muted">
            Invite teammates or assign tasks to see realtime alerts here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`rounded-2xl border px-4 py-4 ${
                item.read
                  ? 'border-white/5 bg-white/[0.02]'
                  : 'border-nexora-primary/30 bg-nexora-primary/10'
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-nexora-muted">{item.message}</p>
                  <p className="mt-2 text-xs text-nexora-muted">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {item.link && (
                    <Link
                      to={item.link}
                      onClick={() => {
                        if (!item.read) dispatch(markNotificationRead(item.id))
                      }}
                      className="rounded-xl border border-white/10 px-3 py-2 text-sm text-nexora-secondary hover:text-nexora-text"
                    >
                      Open
                    </Link>
                  )}
                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => dispatch(markNotificationRead(item.id))}
                      className="rounded-xl border border-white/10 px-3 py-2 text-sm text-nexora-muted hover:text-nexora-text"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
