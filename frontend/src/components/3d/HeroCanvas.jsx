import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei'
import HeroScene from './HeroScene'

function CanvasFallback() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.25),_transparent_60%),radial-gradient(ellipse_at_80%_20%,_rgba(6,182,212,0.2),_transparent_45%),#080B18]" />
  )
}

export default function HeroCanvas() {
  const [dense, setDense] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setDense(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <div className="absolute inset-0">
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6.5], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <HeroScene dense={dense} />
          <Preload all />
        </Canvas>
      </Suspense>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080B18]/25 via-transparent to-[#080B18]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080B18]/70 via-transparent to-[#080B18]/55"
      />
    </div>
  )
}
