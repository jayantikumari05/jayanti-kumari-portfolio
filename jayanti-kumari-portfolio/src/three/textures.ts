import * as THREE from 'three'

/** Deterministic hash-noise so the iris looks the same on every load. */
const noise = (n: number) => {
  const s = Math.sin(n * 127.1) * 43758.5453
  return s - Math.floor(s)
}

let irisCache: THREE.CanvasTexture | null = null

/**
 * Procedural iris: radial fibers + limbal ring, drawn once into a canvas.
 * UVs on the sphere cap run around the eye in `u`, outward in `v`, so
 * vertical stripes here become fibers radiating from the pupil.
 */
export function irisTexture(base = '#7a4a26', rim = '#2a1608', hot = '#d2a06a') {
  if (irisCache) return irisCache

  const w = 512
  const h = 256
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!

  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#150a03')
  grad.addColorStop(0.18, hot)
  grad.addColorStop(0.55, base)
  grad.addColorStop(0.88, rim)
  grad.addColorStop(1, '#0d0602')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // fibers
  ctx.globalCompositeOperation = 'overlay'
  for (let i = 0; i < 360; i++) {
    const x = (i / 360) * w
    const n = noise(i)
    const n2 = noise(i * 3.7)
    ctx.strokeStyle = `rgba(${n > 0.5 ? '255,255,255' : '0,0,0'},${0.05 + n2 * 0.35})`
    ctx.lineWidth = 0.6 + n2 * 2.2
    ctx.beginPath()
    ctx.moveTo(x, h * (0.12 + n2 * 0.1))
    ctx.lineTo(x + (n - 0.5) * 10, h * (0.7 + n * 0.3))
    ctx.stroke()
  }

  // limbal ring
  ctx.globalCompositeOperation = 'source-over'
  const ring = ctx.createLinearGradient(0, h * 0.82, 0, h)
  ring.addColorStop(0, 'rgba(13,6,2,0)')
  ring.addColorStop(1, 'rgba(13,6,2,0.95)')
  ctx.fillStyle = ring
  ctx.fillRect(0, h * 0.82, w, h * 0.18)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.anisotropy = 4
  irisCache = tex
  return tex
}
