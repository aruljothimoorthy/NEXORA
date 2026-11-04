import { cn } from '../../utils/cn'

export default function StatCard({ label, value, icon: Icon, tone = 'primary' }) {
  const tones = {
    primary: 'text-nexora-primary bg-nexora-primary/15',
    secondary: 'text-nexora-secondary bg-nexora-secondary/15',
    accent: 'text-nexora-accent bg-nexora-accent/15',
    success: 'text-nexora-success bg-nexora-success/15',
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-white/15">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-nexora-muted uppercase">
            {label}
          </p>
          <p className="mt-3 font-display text-3xl font-bold tracking-tight">{value}</p>
        </div>
        {Icon && (
          <span
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl',
              tones[tone],
            )}
          >
            <Icon size={18} />
          </span>
        )}
      </div>
    </div>
  )
}
