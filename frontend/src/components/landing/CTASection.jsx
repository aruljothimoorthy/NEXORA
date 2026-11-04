import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export default function CTASection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-nexora-primary/30 bg-gradient-to-br from-nexora-primary/20 via-[#0B1020] to-nexora-secondary/15 px-6 py-14 text-center sm:px-12"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-nexora-accent/20 blur-3xl"
        />
        <h2 className="relative font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to run projects the NEXORA way?
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-nexora-muted">
          Create your account and launch a board your whole team can move on today.
        </p>
        <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button to="/register" size="lg">
            Get Started
            <ArrowRight size={18} />
          </Button>
          <Button to="/login" variant="secondary" size="lg">
            Log in
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
