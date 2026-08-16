# Jayanti Kumari — Portfolio

Personal portfolio website of Jayanti Kumari, a Computer Science and Engineering
student at New Horizon College of Engineering, Bengaluru.

Live: _add deployment URL_

## About

- B.E. Computer Science and Engineering, 2023 — 2027, CGPA 8.70
- Languages: Python, Java, C, C++, JavaScript
- Web: HTML, CSS
- Tools: Git, GitHub
- Email: [mailjayantikumari@gmail.com](mailto:mailjayantikumari@gmail.com)
- GitHub: [jayantikumari05](https://github.com/jayantikumari05)
- LinkedIn: [jayanti-kumari-2030462a0](https://www.linkedin.com/in/jayanti-kumari-2030462a0)

## Built with

React 19, TypeScript, Vite, Three.js with React Three Fiber, GSAP, Tailwind CSS.

The site renders a WebGL scene behind the content: a pair of eyes that follow the
cursor, blink, and drift on their own when the pointer is idle. Sections reveal on
scroll. Layout, effects, and render quality adapt to screen size and to
`prefers-reduced-motion`.

## Setup

```bash
npm install
npm run dev      # development server
npm run build    # production build in dist/
npm run preview  # serve the production build
```

## Editing content

All text lives in `src/data/content.ts`:

| Export | Section |
| --- | --- |
| `profile` | name, role, tagline, email, location, resume link |
| `education` | degree, college, years, CGPA |
| `stats`, `about` | About |
| `skills` | Skills |
| `projects` | Work |
| `socials` | Contact |

Project entries take `title`, `summary`, `tags`, `year`, `live`, `code`, and an
optional `image`. Images go in `public/` and are referenced by path, for example
`/projects/name.jpg`. The current project entries are placeholders.

## Project structure

```text
src/
  App.tsx              page composition, scroll and section tracking
  components/          navigation, loader, scroll-reveal section wrapper
  sections/            Hero, About, Skills, Projects, Contact
  three/               WebGL scene, eye component, generated iris texture
  lib/                 pointer and scroll helpers
  data/content.ts      all site content
```

## Deployment

The build output in `dist/` is static and can be hosted on Vercel, Netlify,
GitHub Pages, or any static host.

Vercel settings are committed in `vercel.json`. Step-by-step instructions —
GitHub import, CLI deploy, custom domain, rollback — are in
[DEPLOY.md](DEPLOY.md).
