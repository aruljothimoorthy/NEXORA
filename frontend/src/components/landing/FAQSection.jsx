import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../utils/cn'

const faqs = [
  {
    q: 'Is NEXORA free to try?',
    a: 'Yes. The Starter plan is free for individuals exploring projects and Kanban workflows. Upgrade when you need analytics and team roles.',
  },
  {
    q: 'Can I invite my whole team?',
    a: 'Absolutely. Invite members, assign roles, and control who can edit projects, tasks, and settings.',
  },
  {
    q: 'Does it support real-time updates?',
    a: 'Yes. Notifications and collaboration events use Socket.IO so assignment alerts and invites arrive instantly.',
  },
  {
    q: 'Will it work on mobile?',
    a: 'The full experience is responsive across desktop, tablet, and mobile, with lighter visuals on smaller screens for performance.',
  },
  {
    q: 'How is my data secured?',
    a: 'Passwords are hashed with bcrypt, routes are JWT-protected, and the API uses Helmet, CORS, validation, and rate limiting.',
  },
]

function FAQItem({ item, open, onToggle, reduced }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-sm font-semibold text-nexora-text sm:text-base">
          {item.q}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            'shrink-0 text-nexora-muted transition-transform duration-300',
            open && 'rotate-180 text-nexora-secondary',
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-nexora-muted">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const reduced = usePrefersReducedMotion()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Answers before you dive in."
          subtitle="Quick clarity on plans, collaboration, realtime, and security."
        />

        <div className="mt-10 space-y-3">
          {faqs.map((item, index) => (
            <FAQItem
              key={item.q}
              item={item}
              reduced={reduced}
              open={openIndex === index}
              onToggle={() => setOpenIndex((prev) => (prev === index ? -1 : index))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
