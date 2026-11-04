import { CalendarClock } from 'lucide-react'

const priorityStyles = {
  low: 'text-nexora-muted',
  medium: 'text-nexora-secondary',
  high: 'text-nexora-primary',
  urgent: 'text-nexora-accent',
}

export default function UpcomingDeadlines({ items = [] }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarClock size={18} className="text-nexora-secondary" />
        <h2 className="font-display text-lg font-semibold">Upcoming deadlines</h2>
      </div>

      {!items.length ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-nexora-muted">
          No upcoming deadlines. You’re clear for now.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-white/5 bg-[#0B1020]/70 px-3.5 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-nexora-text">
                    {item.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-nexora-muted">
                    {item.project?.name || 'Project'}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-[11px] font-semibold tracking-wide uppercase ${priorityStyles[item.priority] || priorityStyles.medium}`}
                >
                  {item.priority}
                </span>
              </div>
              <p className="mt-2 text-xs text-nexora-muted">
                Due{' '}
                {item.dueDate
                  ? new Date(item.dueDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })
                  : '—'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
