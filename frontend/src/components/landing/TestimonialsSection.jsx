import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const testimonials = [
  {
    quote:
      'NEXORA replaced three tools for us. The board feels alive, and standup prep dropped to minutes.',
    name: 'Aisha Rahman',
    role: 'Product Lead, Orbit Labs',
  },
  {
    quote:
      'The visual polish is rare for project software. Our designers and engineers finally share one source of truth.',
    name: 'Marcus Chen',
    role: 'Engineering Manager, Northline',
  },
  {
    quote:
      'Deadlines, comments, and alerts in one flow. We shipped two releases last month without losing context.',
    name: 'Elena Voss',
    role: 'Founder, Brightstack',
  },
]

export default function TestimonialsSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="testimonials" className="relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by teams who ship."
          subtitle="Early adopters use NEXORA to keep momentum visible across every sprint."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.name}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-6"
            >
              <p className="flex-1 text-sm leading-relaxed text-nexora-muted">
                “{item.quote}”
              </p>
              <footer className="mt-6 border-t border-white/5 pt-4">
                <p className="font-display text-sm font-semibold text-nexora-text">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-nexora-muted">{item.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
