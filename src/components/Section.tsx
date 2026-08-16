import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  id: string
  index: number
  children: ReactNode
  className?: string
}

/**
 * A page section that reveals any descendant marked `data-reveal` as it
 * scrolls into view. `data-reveal="left" | "right" | "scale"` picks the
 * direction; the default rises from below.
 */
export default function Section({ id, index, children, className = '' }: Props) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const arm = (el: HTMLElement) => {
        if (el.dataset.revealArmed) return
        el.dataset.revealArmed = '1'

        const kind = el.dataset.reveal
        const from: gsap.TweenVars = { opacity: 0 }
        if (kind === 'left') from.x = -60
        else if (kind === 'right') from.x = 60
        else if (kind === 'scale') from.scale = 0.92
        else from.y = 48

        // fromTo, not from: the CSS start state is opacity 0, which a `from`
        // tween would happily animate back to.
        gsap.fromTo(el, from, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          delay: Number(el.dataset.revealDelay ?? 0),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      }

      const scan = () =>
        ref.current?.querySelectorAll<HTMLElement>('[data-reveal]').forEach(arm)

      scan()
      // Cards can arrive long after mount (the Work grid waits on GitHub).
      // Without this they would sit at the CSS opacity: 0 start state forever.
      const mo = new MutationObserver(scan)
      mo.observe(ref.current!, { childList: true, subtree: true })
      return () => mo.disconnect()
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id={id}
      ref={ref}
      data-section={index}
      className={`relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-12 ${className}`}
    >
      {children}
    </section>
  )
}
