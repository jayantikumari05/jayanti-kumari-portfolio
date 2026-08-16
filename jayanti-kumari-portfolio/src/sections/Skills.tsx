import Section from '../components/Section'
import { skills } from '../data/content'

export default function Skills() {
  return (
    <Section id="skills" index={2} className="flex min-h-[100dvh] flex-col justify-center py-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div data-reveal="left">
          <p className="font-mono text-[11px] tracking-[0.3em] text-clay uppercase">02 — Skills</p>
          <h2 className="mt-4 font-display text-5xl leading-[0.95] md:text-6xl">
            What I <span className="italic text-bone/50">work with</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-bone/55" data-reveal="right">
          Languages from coursework, web work from building things, and the habits that carry
          across both.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <div
            key={group.title}
            data-reveal="scale"
            data-reveal-delay={0.07 * i}
            className="group relative overflow-hidden rounded-2xl border border-bone/12 bg-ink-2/70 p-7 backdrop-blur-sm transition-colors duration-500 hover:border-bone/30 hover:bg-ink-2"
          >
            <span className="font-mono text-[10px] tracking-widest text-bone/35">
              0{i + 1}
            </span>
            <h3 className="mt-3 font-display text-2xl">{group.title}</h3>
            <ul className="mt-5 space-y-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-bone/65 transition-colors duration-300 group-hover:text-bone/90"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-clay" />
                  {item}
                </li>
              ))}
            </ul>
            <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-clay to-sand transition-transform duration-500 group-hover:scale-x-100" />
          </div>
        ))}
      </div>
    </Section>
  )
}
