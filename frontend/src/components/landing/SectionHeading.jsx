import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const reduced = usePrefersReducedMotion()
  const alignClass = align === 'left' ? 'text-left' : 'mx-auto text-center'

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55 }}
      className={`max-w-2xl ${alignClass}`}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold tracking-[0.28em] text-nexora-secondary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-nexora-text sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-nexora-muted sm:text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
