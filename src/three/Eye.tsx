import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer } from '../lib/pointer'
import { irisTexture } from './textures'

type Props = {
  position?: [number, number, number]
  scale?: number
  /** phase offset so a pair of eyes doesn't blink in lockstep with other pairs */
  seed?: number
  /** transmission + heavy materials are desktop-only */
  quality?: 'high' | 'low'
}

const dummy = new THREE.Object3D()
const worldTarget = new THREE.Vector3()
const localTarget = new THREE.Vector3()

/**
 * One eyeball that tracks the cursor.
 *
 * The ball rotates, the cornea and specular highlights do not — that's what
 * sells the gloss, since a real highlight is a reflection of the room, not
 * something painted on the eye.
 */
export default function Eye({ position = [0, 0, 0], scale = 1, seed = 0, quality = 'high' }: Props) {
  const ball = useRef<THREE.Group>(null!)
  const lid = useRef<THREE.Group>(null!)
  const pupil = useRef<THREE.Mesh>(null!)
  const rings = useRef<THREE.Group>(null!)
  const glow = useRef<THREE.Mesh>(null!)

  const iris = useMemo(() => irisTexture(), [])
  const state = useRef({ nextBlink: 2 + seed, blinkAt: -1, sacX: 0, sacY: 0, nextSac: 0, dilate: 0 })

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime
    const st = state.current
    const k = 1 - Math.exp(-6 * dt) // frame-rate independent damping

    // ---- where is the eye looking -------------------------------------
    const idle = pointer.touch || performance.now() - pointer.lastMove > 2600
    let tx: number
    let ty: number
    if (idle) {
      // slow lissajous wander so the eye never looks dead
      tx = Math.sin(t * 0.31 + seed) * 0.75 + Math.sin(t * 0.13) * 0.25
      ty = Math.sin(t * 0.24 + 1.7 + seed) * 0.45
    } else {
      tx = pointer.sx
      ty = pointer.sy
    }

    // micro-saccades: eyes never hold perfectly still
    if (t > st.nextSac) {
      st.nextSac = t + 0.25 + Math.abs(Math.sin(t * 91.3 + seed)) * 0.9
      st.sacX = (Math.sin(t * 311.7 + seed) * 0.5) * 0.06
      st.sacY = (Math.sin(t * 197.3 + seed * 2) * 0.5) * 0.05
    }

    worldTarget.set(tx * 5.2 + st.sacX, ty * 3.1 + st.sacY, 8.5)

    localTarget.copy(worldTarget)
    ball.current.parent!.worldToLocal(localTarget)
    dummy.position.copy(ball.current.position)
    dummy.lookAt(localTarget)
    ball.current.quaternion.slerp(dummy.quaternion, k)

    // ---- pupil: dilates on press, breathes otherwise -------------------
    const want = (pointer.down ? 1.45 : 1) + Math.sin(t * 0.9 + seed) * 0.05
    st.dilate = THREE.MathUtils.damp(st.dilate || 1, want, 5, dt)
    pupil.current.scale.setScalar(st.dilate)
    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial
      m.opacity = 0.16 + (st.dilate - 1) * 0.35
    }

    // ---- blink ---------------------------------------------------------
    if (st.blinkAt < 0 && t > st.nextBlink) st.blinkAt = t
    if (st.blinkAt >= 0) {
      const p = (t - st.blinkAt) / 0.17
      if (p >= 1) {
        st.blinkAt = -1
        st.nextBlink = t + 2.6 + Math.abs(Math.sin(t * 53.1 + seed)) * 4.5
        lid.current.scale.y = 1
      } else {
        lid.current.scale.y = 1 - Math.sin(p * Math.PI) * 0.95
      }
    }

    // ---- orbiting rings -------------------------------------------------
    if (rings.current) {
      rings.current.rotation.z = t * 0.25 + seed
      rings.current.rotation.x = Math.sin(t * 0.2) * 0.35
      rings.current.rotation.y = Math.cos(t * 0.17) * 0.35
    }
  })

  return (
    <group position={position} scale={scale}>
      <group ref={lid}>
        {/* rotating eyeball */}
        <group ref={ball}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[1, 64, 64]} />
            <meshPhysicalMaterial
              color="#f7f4ee"
              roughness={0.22}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.12}
              sheen={0.5}
              sheenColor="#f0dcc6"
            />
          </mesh>

          {/* iris */}
          <mesh rotation-x={Math.PI / 2}>
            <sphereGeometry args={[1.002, 64, 48, 0, Math.PI * 2, 0, 0.44]} />
            <meshPhysicalMaterial
              map={iris}
              roughness={0.25}
              metalness={0.35}
              clearcoat={1}
              clearcoatRoughness={0.06}
              emissive="#5a2f12"
              emissiveIntensity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* pupil */}
          <mesh ref={pupil} rotation-x={Math.PI / 2}>
            <sphereGeometry args={[1.006, 48, 32, 0, Math.PI * 2, 0, 0.17]} />
            <meshBasicMaterial color="#0a0603" side={THREE.DoubleSide} />
          </mesh>

          {/* inner glow around the pupil */}
          <mesh ref={glow} rotation-x={Math.PI / 2} position-z={0.001}>
            <sphereGeometry args={[1.01, 48, 32, 0, Math.PI * 2, 0.17, 0.1]} />
            <meshBasicMaterial
              color="#d2a06a"
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>

        {/* cornea — static, so highlights read as reflections */}
        {quality === 'high' ? (
          <mesh>
            <sphereGeometry args={[1.035, 64, 64]} />
            <meshPhysicalMaterial
              transmission={1}
              thickness={0.45}
              roughness={0.03}
              ior={1.42}
              transparent
              clearcoat={1}
              specularIntensity={1}
              color="#ffffff"
              attenuationColor="#e8d8c4"
              attenuationDistance={2.5}
            />
          </mesh>
        ) : (
          <mesh>
            <sphereGeometry args={[1.035, 32, 32]} />
            <meshPhysicalMaterial
              color="#ffffff"
              transparent
              opacity={0.16}
              roughness={0.05}
              metalness={0}
              clearcoat={1}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* specular highlights */}
        <mesh position={[-0.36, 0.42, 0.94]} scale={0.11}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <mesh position={[0.3, -0.26, 0.95]} scale={0.05}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color="#f0dcc6" toneMapped={false} transparent opacity={0.7} />
        </mesh>
      </group>

      <group ref={rings}>
        <mesh rotation-x={Math.PI / 2.6}>
          <torusGeometry args={[1.45, 0.012, 8, 128]} />
          <meshBasicMaterial color="#b87a4b" toneMapped={false} transparent opacity={0.55} />
        </mesh>
        <mesh rotation-y={Math.PI / 3}>
          <torusGeometry args={[1.62, 0.006, 8, 128]} />
          <meshBasicMaterial color="#d9c3a6" toneMapped={false} transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  )
}
