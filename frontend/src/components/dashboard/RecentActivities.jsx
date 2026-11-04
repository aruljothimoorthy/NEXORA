import { Activity } from 'lucide-react'

export default function RecentActivities({ items = [] }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity size={18} className="text-nexora-primary" />
        <h2 className="font-display text-lg font-semibold">Recent activity</h2>
      </div>

      {!items.length ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-nexora-muted">
          Activity will appear as you create projects and complete tasks.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-nexora-secondary" />
              <div className="min-w-0">
                <p className="text-sm text-nexora-text">{item.message}</p>
                <p className="mt-1 text-xs text-nexora-muted">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })
                    : ''}
                  {item.project?.name ? ` · ${item.project.name}` : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
