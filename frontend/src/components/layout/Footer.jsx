import { Link } from 'react-router-dom'
import { Globe, MessageCircle, Share2 } from 'lucide-react'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Kanban', href: '#how-it-works' },
      { label: 'Analytics', href: '#features' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#testimonials' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: 'mailto:hello@nexora.app' },
    ],
  },
  {
    title: 'Get started',
    links: [
      { label: 'Create account', to: '/register' },
      { label: 'Sign in', to: '/login' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#060815]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexora-primary/50 to-transparent"
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl neon-gradient font-display text-sm font-bold text-white">
              N
            </span>
            <span className="font-display text-lg font-bold">NEXORA</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-nexora-muted">
            Smart project management for modern teams — plan work, collaborate in
            real time, and ship with clarity.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: Share2, label: 'Share NEXORA' },
              { Icon: Globe, label: 'Visit website' },
              { Icon: MessageCircle, label: 'Contact' },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-nexora-muted transition hover:border-nexora-secondary/40 hover:text-nexora-text"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-sm font-semibold tracking-wide text-nexora-text">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link
                      to={link.to}
                      className="text-sm text-nexora-muted transition hover:text-nexora-text"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-nexora-muted transition hover:text-nexora-text"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-nexora-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} NEXORA. All rights reserved.</p>
          <p>Built for portfolio · MERN · Production-ready SaaS</p>
        </div>
      </div>
    </footer>
  )
}
