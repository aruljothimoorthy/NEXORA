import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const HeroCanvas = lazy(() => import('../3d/HeroCanvas'))

function StaticHeroBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,_rgba(139,92,246,0.28),_transparent_55%),radial-gradient(ellipse_at_20%_80%,_rgba(6,182,212,0.18),_transparent_50%),radial-gradient(ellipse_at_90%_10%,_rgba(236,72,153,0.16),_transparent_40%),#080B18]"
    >
      <div className="absolute left-[12%] top-[28%] h-40 w-40 rounded-full bg-nexora-primary/30 blur-3xl" />
      <div className="absolute right-[18%] top-[35%] h-48 w-48 rounded-full bg-nexora-secondary/25 blur-3xl" />
      <div className="absolute bottom-[20%] left-[40%] h-36 w-36 rounded-full bg-nexora-accent/20 blur-3xl" />
    </div>
  )
}

export default function HeroSection() {
  const reducedMotion = usePrefersReducedMotion()
  const [enable3d, setEnable3d] = useState(false)

  useEffect(() => {
    if (reducedMotion) {
      setEnable3d(false)
      return undefined
    }

    const mobileQuery = window.matchMedia('(max-width: 640px)')
    const update = () => setEnable3d(!mobileQuery.matches)
    update()
    mobileQuery.addEventListener('change', update)
    return () => mobileQuery.removeEventListener('change', update)
  }, [reducedMotion])

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      {enable3d ? (
        <Suspense fallback={<StaticHeroBackdrop />}>
          <HeroCanvas />
        </Suspense>
      ) : (
        <StaticHeroBackdrop />
      )}

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-gradient">NEXORA</span>
          </h1>
          <p className="mt-5 font-display text-2xl font-semibold text-nexora-text sm:text-3xl lg:text-4xl">
            Manage projects at the speed of your team.
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-nexora-muted sm:text-lg">
            Plan work, assign tasks, and collaborate on a living Kanban board —
            with analytics and alerts that keep every sprint on track.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button to="/register" size="lg">
              Get Started
              <ArrowRight size={18} />
            </Button>
            <Button href="#features" variant="secondary" size="lg">
              Explore features
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
