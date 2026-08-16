import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Scene from './three/Scene'
import Nav from './components/Nav'
import Loader from './components/Loader'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import { bindPointer, scroll } from './lib/pointer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(0)
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768,
  )

  useEffect(() => bindPointer(), [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setMobile(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Native scrolling — no smooth-scroll library. Anything that damps the wheel
  // makes the page feel slower than every other page the visitor uses.
  useEffect(() => {
    let last = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const limit = document.documentElement.scrollHeight - window.innerHeight
      scroll.y = y
      scroll.progress = limit > 0 ? y / limit : 0
      scroll.velocity = Math.max(-1, Math.min(1, (y - last) / 60))
      last = y
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // which section owns the viewport — drives the nav and the eye placement
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return
          const i = Number((en.target as HTMLElement).dataset.section)
          scroll.section = i
          setActive(i)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // sections mount before the loader finishes; re-measure once it's gone
  useEffect(() => {
    if (!ready) return
    const id = setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => clearTimeout(id)
  }, [ready])

  return (
    <div className="grain relative min-h-[100dvh] overflow-x-clip">
      {/* backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-ink">
        <div className="absolute -top-1/4 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-clay/10 blur-[140px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[60vh] w-[60vh] rounded-full bg-cocoa/14 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,8,7,0)_0%,rgba(10,8,7,0.55)_70%,#0a0807_100%)]" />
      </div>

      <Scene />

      {/* The hero gives the 3D the stage; every later section needs the text
          to win, so a scrim slides over the canvas once you scroll past it. */}
      <div
        className="pointer-events-none fixed inset-0 z-[5] bg-ink transition-opacity duration-700 ease-out"
        style={{ opacity: active === 0 ? 0 : mobile ? 0.72 : 0.55 }}
      />

      <Loader onDone={() => setReady(true)} />
      <Nav active={active} />

      <main className="relative z-10">
        <Hero ready={ready} />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  )
}
