import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

const variants = {
  primary:
    'neon-gradient text-white shadow-[0_0_28px_rgba(139,92,246,0.35)] hover:brightness-110',
  secondary:
    'glass text-nexora-text hover:border-nexora-primary/40 hover:bg-white/5',
  ghost: 'bg-transparent text-nexora-muted hover:text-nexora-text',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className,
  type = 'button',
  ...props
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexora-secondary/60 disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
