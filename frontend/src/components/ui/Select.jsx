import { cn } from '../../utils/cn'

export default function Select({
  id,
  label,
  error,
  options = [],
  className,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-nexora-text">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'w-full rounded-xl border bg-white/[0.03] px-3.5 py-2.5 text-sm text-nexora-text outline-none transition',
          error
            ? 'border-nexora-accent/60 focus:border-nexora-accent'
            : 'border-white/10 focus:border-nexora-secondary/50',
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[color:var(--nexora-surface)] text-[color:var(--nexora-text)]"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-nexora-accent">{error}</p>}
    </div>
  )
}
