import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Stars } from '@react-three/drei'
import * as THREE from 'three'

function FloatingShape({
  position,
  color,
  geometry = 'icosahedron',
  scale = 1,
  speed = 1,
}) {
  const mesh = useRef(null)

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime * speed
    mesh.current.rotation.x = t * 0.35
    mesh.current.rotation.y = t * 0.45
    const pointer = state.pointer
    mesh.current.position.x = position[0] + pointer.x * 0.35 * speed
    mesh.current.position.y = position[1] + pointer.y * 0.2 * speed
  })

  const geo = useMemo(() => {
    if (geometry === 'torus') return <torusGeometry args={[0.7, 0.22, 24, 48]} />
    if (geometry === 'octahedron') return <octahedronGeometry args={[0.85, 0]} />
    return <icosahedronGeometry args={[0.9, 0]} />
  }, [geometry])

  return (
    <Float speed={1.4 + speed * 0.4} rotationIntensity={0.6} floatIntensity={1.1}>
      <mesh ref={mesh} position={position} scale={scale}>
        {geo}
        <MeshDistortMaterial
          color={color}
          roughness={0.15}
          metalness={0.55}
          distort={0.28}
          speed={1.6}
          emissive={color}
          emissiveIntensity={0.35}
        />
      </mesh>
    </Float>
  )
}

function ParticleField({ count = 120 }) {
  const points = useRef(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 14
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!points.current) return
    points.current.rotation.y = state.clock.elapsedTime * 0.02
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#94A3B8"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function GradientOrb() {
  const ref = useRef(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      state.pointer.x * 1.2,
      0.04,
    )
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      state.pointer.y * 0.6,
      0.04,
    )
  })

  return (
    <mesh ref={ref} position={[0, 0, -1.5]} scale={2.4}>
      <sphereGeometry args={[1, 48, 48]} />
      <MeshDistortMaterial
        color="#8B5CF6"
        attach="material"
        distort={0.45}
        speed={1.2}
        roughness={0.4}
        metalness={0.2}
        transparent
        opacity={0.35}
        emissive="#06B6D4"
        emissiveIntensity={0.25}
      />
    </mesh>
  )
}

export default function HeroScene({ dense = false }) {
  return (
    <>
      <color attach="background" args={['#080B18']} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 5, 2]} intensity={1.2} color="#F8FAFC" />
      <pointLight position={[-4, -2, 2]} intensity={1.4} color="#8B5CF6" />
      <pointLight position={[3, 1, 3]} intensity={1.1} color="#06B6D4" />
      <pointLight position={[0, -3, 1]} intensity={0.8} color="#EC4899" />

      <Stars
        radius={40}
        depth={30}
        count={dense ? 1800 : 900}
        factor={3}
        saturation={0}
        fade
        speed={0.4}
      />

      <GradientOrb />
      <ParticleField count={dense ? 160 : 90} />

      <FloatingShape position={[-2.4, 0.6, 0]} color="#8B5CF6" geometry="icosahedron" scale={1.05} />
      <FloatingShape position={[2.2, -0.2, 0.4]} color="#06B6D4" geometry="torus" scale={0.95} speed={1.2} />
      <FloatingShape position={[0.2, 1.4, -0.6]} color="#EC4899" geometry="octahedron" scale={0.7} speed={0.85} />
      {dense && (
        <FloatingShape
          position={[-1.2, -1.3, 0.8]}
          color="#22C55E"
          geometry="icosahedron"
          scale={0.45}
          speed={1.4}
        />
      )}
    </>
  )
}
