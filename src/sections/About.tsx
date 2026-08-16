import Section from '../components/Section'
import { about, education, profile, stats } from '../data/content'

export default function About() {
  return (
    <Section id="about" index={1} className="flex min-h-[100dvh] flex-col justify-center py-28">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4" data-reveal="left">
          <p className="font-mono text-[11px] tracking-[0.3em] text-clay uppercase">01 — About</p>
          <h2 className="mt-4 font-display text-5xl leading-[0.95] md:text-6xl">
            The person
            <br />
            behind the
            <br />
            <span className="italic text-bone/50">pixels</span>
          </h2>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <p className="text-xl leading-relaxed text-bone/85 md:text-2xl" data-reveal>
            {profile.blurb}
          </p>

          {about.map((p, i) => (
            <p
              key={i}
              className="mt-6 leading-relaxed text-bone/60"
              data-reveal
              data-reveal-delay={0.08 * (i + 1)}
            >
              {p}
            </p>
          ))}

          <div className="mt-10 border-t border-bone/10 pt-8" data-reveal>
            <p className="font-mono text-[10px] tracking-[0.3em] text-bone/40 uppercase">
              Education
            </p>
            <h3 className="mt-3 font-display text-2xl leading-snug md:text-3xl">
              {education.degree}
            </h3>
            <p className="mt-2 text-bone/60">{education.school}</p>
            <p className="mt-1 font-mono text-xs tracking-widest text-bone/45 uppercase">
              {education.years} — CGPA {education.cgpa}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-bone/10 pt-8">
            {stats.map((s, i) => (
              <div key={s.label} data-reveal data-reveal-delay={0.06 * i}>
                <div className="font-display text-4xl md:text-5xl">{s.value}</div>
                <div className="mt-1 font-mono text-[10px] leading-snug tracking-widest text-bone/45 uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
