import { cn } from '../../utils/cn'

export default function Input({
  id,
  label,
  error,
  className,
  type = 'text',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-nexora-text">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={cn(
          'w-full rounded-xl border bg-white/[0.03] px-3.5 py-2.5 text-sm text-nexora-text outline-none transition placeholder:text-nexora-muted/70',
          error
            ? 'border-nexora-accent/60 focus:border-nexora-accent focus:ring-2 focus:ring-nexora-accent/20'
            : 'border-white/10 focus:border-nexora-secondary/50 focus:ring-2 focus:ring-nexora-secondary/20',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-nexora-accent">{error}</p>}
    </div>
  )
}
