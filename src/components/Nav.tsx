import { useEffect, useState } from 'react'
import { sections, profile } from '../data/content'
import { scrollToId } from '../lib/scroll'

export default function Nav({ active }: { active: number }) {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid ? 'backdrop-blur-md' : ''
        }`}
      >
        <nav className="mx-auto flex h-[var(--nav-h)] max-w-[1400px] items-center justify-between px-6 md:px-12">
          <button
            onClick={() => go('home')}
            className="group flex items-center gap-2 font-display text-2xl tracking-tight"
            aria-label="Back to top"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-clay transition-transform duration-300 group-hover:scale-150" />
            {profile.first}
            <span className="text-bone/40">{profile.last}</span>
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {sections.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => go(s.id)}
                  className={`relative rounded-full px-4 py-2 font-mono text-xs tracking-widest uppercase transition-colors duration-300 ${
                    active === i ? 'text-ink' : 'text-bone/60 hover:text-bone'
                  }`}
                >
                  {active === i && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-bone transition-all" />
                  )}
                  {s.label}
                </button>
              </li>
            ))}
            <li className="ml-2">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-bone/25 px-4 py-2 font-mono text-xs tracking-widest text-bone/80 uppercase transition-colors duration-300 hover:border-clay hover:text-clay"
              >
                Resume
              </a>
            </li>
          </ul>

          <button
            onClick={() => setOpen((v) => !v)}
            className="glass flex h-11 w-11 items-center justify-center rounded-full md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 block h-px w-5 bg-bone transition-all duration-300 ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-5 bg-bone transition-all duration-300 ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* mobile sheet */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-ink/92 px-8 backdrop-blur-xl transition-all duration-500 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <ul className="space-y-2">
          {sections.map((s, i) => (
            <li key={s.id}>
              <button
                onClick={() => go(s.id)}
                className="flex w-full items-baseline gap-4 border-b border-bone/10 py-4 text-left"
                style={{
                  transform: open ? 'translateY(0)' : 'translateY(20px)',
                  opacity: open ? 1 : 0,
                  transition: `all 420ms cubic-bezier(.2,.8,.2,1) ${i * 60}ms`,
                }}
              >
                <span className="font-mono text-xs text-clay">0{i + 1}</span>
                <span className="font-display text-5xl">{s.label}</span>
              </button>
            </li>
          ))}
          <li>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex w-full items-baseline gap-4 border-b border-bone/10 py-4 text-left"
              style={{
                transform: open ? 'translateY(0)' : 'translateY(20px)',
                opacity: open ? 1 : 0,
                transition: `all 420ms cubic-bezier(.2,.8,.2,1) ${sections.length * 60}ms`,
              }}
            >
              <span className="font-mono text-xs text-clay">0{sections.length + 1}</span>
              <span className="font-display text-5xl">Resume</span>
            </a>
          </li>
        </ul>
        <p className="mt-10 font-mono text-xs tracking-widest text-bone/40 uppercase">
          {profile.location} — available for work
        </p>
      </div>
    </>
  )
}
