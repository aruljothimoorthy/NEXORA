import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function PasswordInput({
  id,
  label,
  error,
  className,
  ...props
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-nexora-text">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={cn(
            'w-full rounded-xl border bg-white/[0.03] px-3.5 py-2.5 pr-11 text-sm text-nexora-text outline-none transition placeholder:text-nexora-muted/70',
            error
              ? 'border-nexora-accent/60 focus:border-nexora-accent focus:ring-2 focus:ring-nexora-accent/20'
              : 'border-white/10 focus:border-nexora-secondary/50 focus:ring-2 focus:ring-nexora-secondary/20',
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-nexora-muted transition hover:text-nexora-text"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-nexora-accent">{error}</p>}
    </div>
  )
}
