import { motion } from 'framer-motion'
import {
  BarChart3,
  BellRing,
  KanbanSquare,
  MessageSquareText,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import SectionHeading from './SectionHeading'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const features = [
  {
    icon: KanbanSquare,
    title: 'Living Kanban boards',
    copy: 'Drag tasks across To Do, In Progress, Review, and Done with clear ownership.',
    glow: 'from-nexora-primary/30',
  },
  {
    icon: UsersRound,
    title: 'Team collaboration',
    copy: 'Invite members, assign roles, and keep every project permission-aware.',
    glow: 'from-nexora-secondary/30',
  },
  {
    icon: BarChart3,
    title: 'Progress analytics',
    copy: 'See velocity, deadlines, and completion trends without leaving the dashboard.',
    glow: 'from-nexora-accent/30',
  },
  {
    icon: MessageSquareText,
    title: 'Task conversations',
    copy: 'Comment in context so decisions stay attached to the work that matters.',
    glow: 'from-nexora-primary/25',
  },
  {
    icon: BellRing,
    title: 'Realtime alerts',
    copy: 'Get notified for assignments, invites, and approaching deadlines instantly.',
    glow: 'from-nexora-secondary/25',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by design',
    copy: 'JWT auth, hashed passwords, validated inputs, and hardened Express middleware.',
    glow: 'from-nexora-success/25',
  },
]

export default function FeaturesSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="features" className="relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 h-64 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.12),_transparent_70%)]"
      />
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Features"
          title="Everything a modern delivery team needs."
          subtitle="From first brief to final ship — one workspace that stays fast and beautiful."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.article
                key={feature.title}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                whileHover={reduced ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-6"
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${feature.glow} to-transparent blur-2xl transition group-hover:opacity-100`}
                />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-nexora-secondary">
                  <Icon size={20} />
                </div>
                <h3 className="relative mt-5 font-display text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-nexora-muted">
                  {feature.copy}
                </p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
