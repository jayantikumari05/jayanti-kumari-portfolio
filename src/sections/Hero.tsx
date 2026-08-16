import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { profile } from '../data/content'
import { scrollToId } from '../lib/scroll'

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ready) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('.hero-anim', { opacity: 1, y: 0 })
        return
      }
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        // 170%, not 100%: the clip window is padded out past the line box so
        // ascenders and descenders survive, so the text has further to travel.
        .fromTo('.hero-line span', { yPercent: 170 }, { yPercent: 0, duration: 1.3, stagger: 0.1 })
        .fromTo(
          '.hero-anim',
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.09 },
          '-=0.85',
        )
    }, root)
    return () => ctx.revert()
  }, [ready])

  const go = (id: string) => scrollToId(id)

  return (
    <section
      id="home"
      ref={root}
      data-section={0}
      className="relative z-10 flex min-h-[100dvh] w-full flex-col justify-end pb-10 md:justify-center md:pb-0"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 pt-[46vh] md:px-12 md:pt-0">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7 lg:col-span-6">
            <div className="hero-anim flex items-center gap-3 opacity-0">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sand opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sand" />
              </span>
              <span className="font-mono text-[11px] tracking-[0.28em] text-bone/60 uppercase">
                {profile.available ? 'Open to work' : 'Currently booked'} — {profile.location}
              </span>
            </div>

            {/* The reveal needs overflow-hidden, and Instrument Serif's
                ascenders + italic swashes overshoot their line box — so the
                clip window is padded out and pulled back with -m. */}
            <h1 className="mt-5 font-display tracking-tight">
              {/* the size class lives on the clip wrapper too, so its em-based
                  padding resolves against the display size, not the 16px root */}
              <span className="hero-line -mx-[0.14em] -my-[0.28em] block overflow-hidden px-[0.14em] py-[0.28em] text-[19vw] md:text-[10.5vw] lg:text-[9vw]">
                <span className="block text-[1em] leading-[0.9]">{profile.first}</span>
              </span>
              <span className="hero-line -mx-[0.16em] -my-[0.28em] block overflow-hidden px-[0.16em] py-[0.28em] text-[19vw] md:text-[10.5vw] lg:text-[9vw]">
                <span className="text-gradient block text-[1em] leading-[0.9] italic">
                  {profile.last}
                </span>
              </span>
            </h1>

            <p className="hero-anim mt-6 max-w-md text-base leading-relaxed text-bone/70 opacity-0 md:text-lg">
              <span className="text-bone">{profile.role}.</span> {profile.tagline}
            </p>

            <div className="hero-anim mt-8 flex flex-wrap items-center gap-3 opacity-0">
              <button
                onClick={() => go('work')}
                className="group relative overflow-hidden rounded-full bg-bone px-7 py-3.5 font-mono text-xs tracking-widest text-ink uppercase"
              >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-bone">
                  See the work
                </span>
                <span className="absolute inset-0 translate-y-full bg-clay transition-transform duration-400 ease-out group-hover:translate-y-0" />
              </button>
              <button
                onClick={() => go('contact')}
                className="rounded-full border border-bone/25 px-7 py-3.5 font-mono text-xs tracking-widest text-bone/80 uppercase transition-colors duration-300 hover:border-bone hover:text-bone"
              >
                Get in touch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="hero-anim mx-auto mt-12 flex w-full max-w-[1400px] items-center justify-between gap-6 px-6 opacity-0 md:absolute md:bottom-8 md:left-1/2 md:mt-0 md:-translate-x-1/2 md:px-12">
        <span className="font-mono text-[10px] tracking-[0.3em] text-bone/40 uppercase">
          Scroll
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-bone/25 to-transparent" />
        <span className="hidden font-mono text-[10px] tracking-[0.3em] text-bone/40 uppercase md:block">
          Move your cursor — it follows
        </span>
      </div>
    </section>
  )
}
