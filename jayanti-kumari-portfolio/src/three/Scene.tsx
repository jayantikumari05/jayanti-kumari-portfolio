import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Lightformer, Sparkles, PerformanceMonitor } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import Eye from './Eye'
import { pointer, scroll, prefersReducedMotion } from '../lib/pointer'

/** Where the eye pair sits for each section — [x, y, z, scale]. */
const DESKTOP: [number, number, number, number][] = [
  [2.05, 0.1, 0, 0.86],
  [-3.6, -1.9, -3.2, 0.45],
  [3.7, -1.8, -3.5, 0.42],
  [3.6, 1.9, -3.5, 0.4],
  [3.8, 1.6, -3.5, 0.42],
]

const MOBILE: [number, number, number, number][] = [
  [0, 1.35, 0, 0.4],
  [1.0, 1.9, -3, 0.3],
  [-1.0, 1.9, -3, 0.28],
  [1.0, 2.0, -3.4, 0.26],
  [0, 1.9, -2.6, 0.32],
]

function Rig({ quality }: { quality: 'high' | 'low' }) {
  const group = useRef<THREE.Group>(null!)
  const { size, camera } = useThree()
  const mobile = size.width < 768
  const reduced = useMemo(prefersReducedMotion, [])
  const cur = useRef(new THREE.Vector4(0, 0, 0, 1))

  useFrame((_s, dt) => {
    // one place smooths the raw pointer; every eye reads the smoothed value
    const rate = reduced ? 20 : 7
    pointer.sx = THREE.MathUtils.damp(pointer.sx, pointer.x, rate, dt)
    pointer.sy = THREE.MathUtils.damp(pointer.sy, pointer.y, rate, dt)

    const layout = mobile ? MOBILE : DESKTOP
    const t = layout[Math.min(scroll.section, layout.length - 1)]
    cur.current.x = THREE.MathUtils.damp(cur.current.x, t[0], 2.4, dt)
    cur.current.y = THREE.MathUtils.damp(cur.current.y, t[1], 2.4, dt)
    cur.current.z = THREE.MathUtils.damp(cur.current.z, t[2], 2.4, dt)
    cur.current.w = THREE.MathUtils.damp(cur.current.w, t[3], 2.4, dt)

    group.current.position.set(cur.current.x, cur.current.y, cur.current.z)
    group.current.scale.setScalar(cur.current.w)
    group.current.rotation.z = THREE.MathUtils.damp(
      group.current.rotation.z,
      pointer.sx * 0.06 + scroll.velocity * 0.05,
      3,
      dt,
    )

    // camera parallax
    if (!reduced) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.sx * 0.55, 2.5, dt)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.sy * 0.35, 2.5, dt)
      camera.lookAt(0, 0, 0)
    }
  })

  const gap = 1.18

  return (
    <group ref={group}>
      <Eye position={[-gap, 0, 0]} seed={0} quality={quality} />
      <Eye position={[gap, 0, 0]} seed={1.7} quality={quality} />
    </group>
  )
}

function Decor({ mobile }: { mobile: boolean }) {
  const knot = useRef<THREE.Mesh>(null!)
  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (knot.current) {
      knot.current.rotation.x = t * 0.12
      knot.current.rotation.y = t * 0.17
    }
  })

  return (
    <>
      <Sparkles
        count={mobile ? 60 : 160}
        scale={[16, 10, 10]}
        size={mobile ? 2 : 3}
        speed={0.25}
        opacity={0.5}
        color="#d9c3a6"
      />

      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh ref={knot} position={[-7.6, -3.9, -10]} scale={mobile ? 0.45 : 0.95}>
          <torusKnotGeometry args={[0.7, 0.16, 128, 24]} />
          <meshStandardMaterial
            color="#1a120b"
            emissive="#8a5a34"
            emissiveIntensity={0.4}
            roughness={0.25}
            metalness={0.9}
            wireframe
          />
        </mesh>
      </Float>

      <Float speed={0.9} rotationIntensity={1} floatIntensity={1.6}>
        <mesh position={[5.9, -2.6, -7]} scale={mobile ? 0.5 : 0.95}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#3b2517"
            emissive="#a9764a"
            emissiveIntensity={0.35}
            roughness={0.15}
            metalness={0.95}
            flatShading
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1}>
        <mesh position={[4.8, 3.4, -8]} rotation={[0.5, 0.3, 0]} scale={mobile ? 0.45 : 0.8}>
          <torusGeometry args={[1, 0.05, 12, 96]} />
          <meshBasicMaterial color="#d9c3a6" toneMapped={false} transparent opacity={0.55} />
        </mesh>
      </Float>
    </>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 6]} intensity={2.4} color="#fff6e8" />
      <pointLight position={[-5, 2, 3]} intensity={38} color="#b87a4b" distance={22} />
      <pointLight position={[5, -3, 2]} intensity={30} color="#d9c3a6" distance={22} />
      <pointLight position={[0, 0, -6]} intensity={22} color="#7a5030" distance={20} />

      {/* procedural environment — no network fetch, still gives real reflections */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[-4, 3, 4]} scale={[8, 8, 1]} color="#d2a06a" />
        <Lightformer form="rect" intensity={2.2} position={[5, -2, 3]} scale={[7, 7, 1]} color="#efe3d3" />
        <Lightformer form="circle" intensity={4} position={[0, 5, 2]} scale={[5, 5, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={2} position={[0, -4, -3]} scale={[6, 6, 1]} color="#8a5a34" />
      </Environment>
    </>
  )
}

export default function Scene() {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  const quality: 'high' | 'low' = mobile ? 'low' : 'high'
  const dprRef = useRef<[number, number]>([1, mobile ? 1.6 : 2])

  return (
    // scene-layer forces pointer-events/touch-action off in CSS: R3F stamps
    // touch-action: none on the canvas, which would swallow page swipes.
    <div className="scene-layer pointer-events-none fixed inset-0 z-0 h-[100dvh] w-full">
      <Canvas
        dpr={dprRef.current}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 9], fov: 35, near: 0.1, far: 60 }}
      >
        <Suspense fallback={null}>
          <PerformanceMonitor onDecline={() => (dprRef.current = [1, 1])} />
          <Lights />
          <Rig quality={quality} />
          <Decor mobile={mobile} />
          {/* Bloom and vignette only — chromatic aberration fringes everything
              blue-violet, which is the look this palette is avoiding. */}
          {!mobile && (
            <EffectComposer enableNormalPass={false}>
              <Bloom intensity={0.5} luminanceThreshold={0.5} luminanceSmoothing={0.3} mipmapBlur />
              <Vignette eskil={false} offset={0.3} darkness={0.8} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}
