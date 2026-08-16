import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { profile } from '../data/content'

export default function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)
  const [gone, setGone] = useState(false)

  // held in a ref so a parent re-render can't restart the intro
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    if (!root.current) return
    const counter = { v: 0 }
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          onComplete: () => {
            setGone(true)
            done.current()
          },
        })
        .to(counter, {
          v: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => setN(Math.round(counter.v)),
        })
        .to('.loader-word', { y: '-170%', duration: 0.6, stagger: 0.06, ease: 'power3.in' }, '-=0.2')
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.25')
    }, root)

    return () => ctx.revert()
  }, [])

  if (gone) return null

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink px-6 py-8 md:px-12"
    >
      <div className="overflow-hidden">
        <div className="loader-word font-mono text-xs tracking-[0.3em] text-bone/50 uppercase">
          Loading portfolio
        </div>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="-mx-[0.1em] -my-[0.25em] overflow-hidden px-[0.1em] py-[0.25em] text-[13vw] md:text-[8vw]">
          <h1 className="loader-word font-display text-[1em] leading-[0.95]">
            {profile.first}
            <span className="text-clay">.</span>
          </h1>
        </div>
        <div className="overflow-hidden">
          <div className="loader-word font-mono text-4xl tabular-nums md:text-6xl">
            {String(n).padStart(3, '0')}
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-bone/15">
        <div
          className="h-px bg-gradient-to-r from-clay to-sand transition-[width] duration-100"
          style={{ width: `${n}%` }}
        />
      </div>
    </div>
  )
}
