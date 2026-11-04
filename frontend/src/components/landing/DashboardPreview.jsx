import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, FolderKanban, Users } from 'lucide-react'
import SectionHeading from './SectionHeading'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const stats = [
  { label: 'Active projects', value: '12', icon: FolderKanban, tone: 'text-nexora-primary' },
  { label: 'Team online', value: '8', icon: Users, tone: 'text-nexora-secondary' },
  { label: 'Done this week', value: '47', icon: CheckCircle2, tone: 'text-nexora-success' },
  { label: 'Due soon', value: '5', icon: Clock3, tone: 'text-nexora-accent' },
]

const columns = [
  {
    title: 'To Do',
    color: 'bg-nexora-muted',
    tasks: ['Wireframe onboarding', 'Invite design partners'],
  },
  {
    title: 'In Progress',
    color: 'bg-nexora-secondary',
    tasks: ['Realtime notifications', 'Sprint analytics chart'],
  },
  {
    title: 'Review',
    color: 'bg-nexora-accent',
    tasks: ['Kanban drag polish'],
  },
  {
    title: 'Done',
    color: 'bg-nexora-success',
    tasks: ['Auth + JWT cookies', 'Project CRUD API'],
  },
]

export default function DashboardPreview() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="preview" className="relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Live preview"
          title="A command center your team will actually open."
          subtitle="Projects, deadlines, and board progress in one cinematic workspace."
        />

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="glass glow-primary relative mt-12 overflow-hidden rounded-3xl p-4 sm:p-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-nexora-primary/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 left-10 h-40 w-40 rounded-full bg-nexora-secondary/20 blur-3xl"
          />

          <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-nexora-muted">{stat.label}</p>
                    <Icon size={16} className={stat.tone} />
                  </div>
                  <p className="mt-2 font-display text-2xl font-bold">{stat.value}</p>
                </div>
              )
            })}
          </div>

          <div className="relative mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {columns.map((col) => (
              <div
                key={col.title}
                className="rounded-2xl border border-white/5 bg-[#0B1020]/80 p-3"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${col.color}`} />
                  <p className="text-sm font-semibold">{col.title}</p>
                </div>
                <div className="space-y-2">
                  {col.tasks.map((task) => (
                    <div
                      key={task}
                      className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm text-nexora-muted"
                    >
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
