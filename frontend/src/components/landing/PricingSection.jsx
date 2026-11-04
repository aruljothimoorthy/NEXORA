import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Button from '../ui/Button'
import SectionHeading from './SectionHeading'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../utils/cn'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    blurb: 'For solo builders validating an idea.',
    features: ['3 projects', 'Basic Kanban', 'Task comments', 'Email support'],
    cta: 'Start free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/seat',
    blurb: 'For growing product and engineering teams.',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Realtime notifications',
      'Role-based access',
      'Priority support',
    ],
    cta: 'Go Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    blurb: 'Security, scale, and dedicated onboarding.',
    features: [
      'SSO-ready architecture',
      'Audit-friendly activity logs',
      'Custom SLAs',
      'Dedicated success manager',
    ],
    cta: 'Talk to us',
    highlighted: false,
  },
]

export default function PricingSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="pricing" className="relative scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple plans. Serious velocity."
          subtitle="Start free, upgrade when your team needs deeper collaboration and insights."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.article
              key={plan.name}
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className={cn(
                'relative flex flex-col rounded-3xl border p-6 sm:p-7',
                plan.highlighted
                  ? 'border-nexora-primary/50 bg-gradient-to-b from-nexora-primary/15 to-white/[0.03] shadow-[0_0_50px_rgba(139,92,246,0.2)]'
                  : 'border-white/8 bg-white/[0.03]',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full neon-gradient px-3 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
              <p className="mt-2 text-sm text-nexora-muted">{plan.blurb}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="pb-1 text-sm text-nexora-muted">{plan.period}</span>
                )}
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-nexora-muted">
                    <Check size={16} className="mt-0.5 shrink-0 text-nexora-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                to="/register"
                variant={plan.highlighted ? 'primary' : 'secondary'}
                className="mt-8 w-full"
              >
                {plan.cta}
              </Button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
