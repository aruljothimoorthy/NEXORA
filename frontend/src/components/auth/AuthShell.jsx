import { Link } from 'react-router-dom'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center px-4 pb-16 pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(139,92,246,0.22),_transparent_45%),radial-gradient(ellipse_at_80%_70%,_rgba(6,182,212,0.14),_transparent_40%)]"
      />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0B1020]/80 shadow-[0_0_60px_rgba(139,92,246,0.12)] lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-nexora-primary/30 via-[#0B1020] to-nexora-secondary/20 p-10 lg:flex">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl neon-gradient font-display text-sm font-bold text-white">
              N
            </span>
            <span className="font-display text-lg font-bold">NEXORA</span>
          </Link>
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight">
              Ship faster with a board your whole team trusts.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-nexora-muted">
              Secure JWT authentication, encrypted passwords, and a workspace built
              for real collaboration.
            </p>
          </div>
          <p className="text-xs text-nexora-muted">Phase 3 · Authentication online</p>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl neon-gradient font-display text-sm font-bold text-white">
                N
              </span>
              <span className="font-display text-lg font-bold">NEXORA</span>
            </Link>
          </div>

          <h1 className="font-display text-2xl font-bold sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-nexora-muted">{subtitle}</p>}

          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-nexora-muted">{footer}</div>}
        </div>
      </div>
    </section>
  )
}
