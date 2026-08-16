import Section from '../components/Section'
import { profile, socials } from '../data/content'
import { scrollToTop } from '../lib/scroll'

export default function Contact() {
  return (
    <Section id="contact" index={4} className="flex min-h-[100dvh] flex-col justify-center py-28">
      <div data-reveal>
        <p className="font-mono text-[11px] tracking-[0.3em] text-clay uppercase">
          04 — Contact
        </p>
      </div>

      <h2
        className="mt-6 font-display text-[13vw] leading-[0.85] md:text-[8vw]"
        data-reveal="scale"
      >
        Let's make
        <br />
        <span className="text-gradient italic">something</span>
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-10 border-t border-bone/10 pt-10 md:grid-cols-12">
        <div className="md:col-span-6" data-reveal>
          <p className="font-mono text-[10px] tracking-[0.3em] text-bone/40 uppercase">Email</p>
          <a
            href={`mailto:${profile.email}`}
            className="group mt-3 inline-flex items-center gap-3 font-display text-3xl break-all md:text-4xl"
          >
            {profile.email}
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              ↗
            </span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone/50">
            Freelance, full-time, or a half-formed idea you want a second opinion on — the inbox
            is open.
          </p>
        </div>

        <div className="md:col-span-4 md:col-start-9" data-reveal data-reveal-delay={0.1}>
          <p className="font-mono text-[10px] tracking-[0.3em] text-bone/40 uppercase">Elsewhere</p>
          <ul className="mt-3 space-y-1">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between border-b border-bone/10 py-3 text-lg transition-colors hover:text-clay"
                >
                  {s.label}
                  <span className="translate-x-0 opacity-40 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="mt-20 flex flex-col gap-3 border-t border-bone/10 pt-6 font-mono text-[10px] tracking-[0.25em] text-bone/35 uppercase sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {profile.first} {profile.last}
        </span>
        <span>Built with React, Three.js &amp; GSAP</span>
        <button
          onClick={scrollToTop}
          className="text-left transition-colors hover:text-bone sm:text-right"
        >
          Back to top ↑
        </button>
      </footer>
    </Section>
  )
}
