import { useEffect, useRef, useState } from 'react'
import Section from '../components/Section'
import { github, projects as pinned, type Project } from '../data/content'

type Repo = {
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics?: string[]
  fork: boolean
  archived: boolean
  stargazers_count: number
  forks_count: number
  pushed_at: string
}

const CACHE_KEY = `repos:${github.user}`
const MIN_CARDS = 4

/** GitHub repo -> the shape the cards render. */
function toProject(r: Repo): Project {
  const tags = [r.language, ...(r.topics ?? [])].filter(Boolean).slice(0, 4) as string[]
  if (r.fork) tags.push('Fork')
  return {
    title: r.name.replace(/[-_]/g, ' '),
    summary: r.description ?? 'No description on the repository yet.',
    tags,
    year: r.pushed_at.slice(0, 4),
    live: r.homepage || undefined,
    code: r.html_url,
    // GitHub renders a social card per repo — free preview image, no assets to host
    image: `https://opengraph.githubassets.com/1/${r.full_name}`,
  }
}

function Card({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLElement>(null)

  // pointer tilt — skipped on touch, where there is no hover to speak of
  const tilt = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateY(-6px)`
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`)
  }
  const reset = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <article
      ref={ref}
      onPointerMove={tilt}
      onPointerLeave={reset}
      data-reveal="scale"
      data-reveal-delay={0.06 * i}
      className="group relative overflow-hidden rounded-3xl border border-bone/12 bg-ink-2/70 p-7 backdrop-blur-md transition-[transform,border-color,box-shadow] duration-300 ease-out will-change-transform hover:border-bone/30 md:p-9"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(168,106,61,0.20), transparent 60%)',
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] tracking-widest text-bone/40">
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className="font-mono text-[10px] tracking-widest text-bone/40">{p.year}</span>
      </div>

      {p.image ? (
        <a
          href={p.code}
          target="_blank"
          rel="noreferrer"
          className="relative mt-6 block aspect-[2/1] overflow-hidden rounded-2xl border border-bone/10 bg-ink"
        >
          <img
            src={p.image}
            alt={`${p.title} repository preview`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </a>
      ) : (
        <div className="relative mt-6 grid aspect-[2/1] place-items-center rounded-2xl border border-dashed border-bone/15">
          <span className="font-mono text-[10px] tracking-[0.3em] text-bone/35 uppercase">
            Preview soon
          </span>
        </div>
      )}

      <h3 className="relative mt-6 font-display text-3xl capitalize md:text-4xl">{p.title}</h3>
      <p className="relative mt-3 text-sm leading-relaxed text-bone/60">{p.summary}</p>

      {p.tags.length > 0 && (
        <div className="relative mt-5 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-bone/15 px-3 py-1 font-mono text-[10px] tracking-widest text-bone/55 uppercase"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="relative mt-7 flex items-center gap-5 border-t border-bone/10 pt-5">
        {p.live && (
          <a
            href={p.live}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs tracking-widest text-bone/80 uppercase transition-colors hover:text-clay"
          >
            Live ↗
          </a>
        )}
        {p.code && (
          <a
            href={p.code}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs tracking-widest text-bone/80 uppercase transition-colors hover:text-clay"
          >
            Repository ↗
          </a>
        )}
      </div>
    </article>
  )
}

/** Placeholder card, so the grid holds its shape until more repos exist. */
function Empty({ i }: { i: number }) {
  return (
    <article
      data-reveal="scale"
      data-reveal-delay={0.06 * i}
      className="relative flex flex-col rounded-3xl border border-dashed border-bone/12 bg-ink-2/35 p-7 md:p-9"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-[10px] tracking-widest text-bone/30">
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className="font-mono text-[10px] tracking-widest text-bone/30">—</span>
      </div>
      <div className="mt-6 grid aspect-[2/1] place-items-center rounded-2xl border border-dashed border-bone/12">
        <span className="font-mono text-[10px] tracking-[0.3em] text-bone/30 uppercase">
          Currently not available
        </span>
      </div>
      <h3 className="mt-6 font-display text-3xl text-bone/35 md:text-4xl">Project slot</h3>
      <p className="mt-3 text-sm leading-relaxed text-bone/35">
        More work is on the way. New public repositories appear here automatically.
      </p>
    </article>
  )
}

function Skeleton({ i }: { i: number }) {
  return (
    <div
      className="animate-pulse rounded-3xl border border-bone/10 bg-ink-2/50 p-7 md:p-9"
      style={{ animationDelay: `${i * 120}ms` }}
    >
      <div className="aspect-[2/1] rounded-2xl bg-bone/5" />
      <div className="mt-6 h-7 w-1/2 rounded bg-bone/10" />
      <div className="mt-4 h-3 w-full rounded bg-bone/5" />
      <div className="mt-2 h-3 w-2/3 rounded bg-bone/5" />
    </div>
  )
}

export default function Projects() {
  const [repos, setRepos] = useState<Project[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      setRepos(JSON.parse(cached) as Project[])
      return
    }

    const ac = new AbortController()
    fetch(`https://api.github.com/users/${github.user}/repos?per_page=100&sort=pushed`, {
      signal: ac.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: Repo[]) => {
        const list = data
          .filter((r) => !r.archived && !github.hide.includes(r.name))
          .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
          .map(toProject)
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(list))
        setRepos(list)
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setFailed(true)
      })
    return () => ac.abort()
  }, [])

  const all = [...pinned, ...(repos ?? [])]
  const loading = repos === null && !failed
  // the grid always reads as a grid — short accounts get "not available" cards
  const fillers = loading ? 0 : Math.max(0, MIN_CARDS - all.length)

  return (
    <Section id="work" index={3} className="flex min-h-[100dvh] flex-col justify-center py-28">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div data-reveal="left">
          <p className="font-mono text-[11px] tracking-[0.3em] text-clay uppercase">03 — Work</p>
          <h2 className="mt-4 font-display text-5xl leading-[0.95] md:text-6xl">
            Selected <span className="italic text-bone/50">projects</span>
          </h2>
        </div>
        <a
          href={github.profile}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] tracking-widest text-bone/45 uppercase transition-colors hover:text-bone"
          data-reveal="right"
        >
          Pulled live from github.com/{github.user} ↗
        </a>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {loading && [0, 1, 2, 3].map((i) => <Skeleton key={i} i={i} />)}
        {all.map((p, i) => (
          <Card key={p.code ?? p.title} p={p} i={i} />
        ))}
        {Array.from({ length: fillers }, (_, i) => (
          <Empty key={`empty-${i}`} i={all.length + i} />
        ))}
      </div>

      {failed && (
        <p className="mt-6 font-mono text-[11px] tracking-widest text-bone/40 uppercase">
          GitHub could not be reached — the API rate limit may be in effect.
        </p>
      )}
    </Section>
  )
}
