/**
 * Global pointer + scroll state.
 *
 * Kept outside React on purpose: the 3D scene samples this every frame, so
 * routing it through state would re-render the tree 60 times a second.
 */
export const pointer = {
  /** -1..1, left to right */
  x: 0,
  /** -1..1, bottom to top */
  y: 0,
  /** smoothed copies, written by the scene each frame */
  sx: 0,
  sy: 0,
  /** ms timestamp of the last real pointer movement */
  lastMove: 0,
  /** true while the user is pressing */
  down: false,
  /** true once a touch/coarse pointer is detected */
  touch: false,
}

export const scroll = {
  /** 0..1 across the whole page */
  progress: 0,
  /** pixels */
  y: 0,
  /** normalized scroll velocity, clamped */
  velocity: 0,
  /** index of the section currently in view */
  section: 0,
}

export const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let bound = false

export function bindPointer() {
  if (bound || typeof window === 'undefined') return () => {}
  bound = true

  const set = (cx: number, cy: number) => {
    pointer.x = (cx / window.innerWidth) * 2 - 1
    pointer.y = -((cy / window.innerHeight) * 2 - 1)
    pointer.lastMove = performance.now()
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') pointer.touch = true
    set(e.clientX, e.clientY)
  }
  const onDown = (e: PointerEvent) => {
    pointer.down = true
    if (e.pointerType === 'touch') pointer.touch = true
    set(e.clientX, e.clientY)
  }
  const onUp = () => {
    pointer.down = false
  }
  const onTouch = (e: TouchEvent) => {
    pointer.touch = true
    const t = e.touches[0]
    if (t) set(t.clientX, t.clientY)
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  window.addEventListener('pointerup', onUp, { passive: true })
  window.addEventListener('pointercancel', onUp, { passive: true })
  window.addEventListener('touchmove', onTouch, { passive: true })

  if (isTouchDevice()) pointer.touch = true

  return () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    window.removeEventListener('touchmove', onTouch)
    bound = false
  }
}
