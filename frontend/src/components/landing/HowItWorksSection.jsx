import { motion } from 'framer-motion'
import SectionHeading from './SectionHeading'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const steps = [
  {
    step: '01',
    title: 'Create your workspace',
    copy: 'Sign up in seconds and spin up your first project with priorities and dates.',
  },
  {
    step: '02',
    title: 'Invite the team',
    copy: 'Add members, assign roles, and share ownership across boards and tasks.',
  },
  {
    step: '03',
    title: 'Ship with visibility',
    copy: 'Move work on Kanban, comment in context, and track progress with live analytics.',
  },
]

export default function HowItWorksSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="how-it-works" className="relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="Three steps from idea to delivery."
          subtitle="NEXORA keeps setup light so your team can focus on execution."
        />

        <div className="relative mt-14 grid gap-6 lg:grid-cols-3">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[8%] right-[8%] top-10 hidden h-px bg-gradient-to-r from-nexora-primary via-nexora-secondary to-nexora-accent lg:block"
          />
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative rounded-2xl border border-white/8 bg-[#0B1020]/70 p-6"
            >
              <span className="font-display text-4xl font-bold text-gradient">{item.step}</span>
              <h3 className="mt-4 font-display text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-nexora-muted">{item.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
