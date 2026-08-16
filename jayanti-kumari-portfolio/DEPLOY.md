# Deploying to Vercel

This site is a static Vite + React build. Vercel runs `npm ci && npm run build` and
serves the `dist/` folder. No server, no database, no environment variables.

Everything Vercel needs is already committed in [vercel.json](vercel.json):

| Setting | Value |
| --- | --- |
| Framework | Vite |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| SPA rewrite | all paths → `/index.html` |
| Asset caching | `/assets/*` cached for one year, immutable |

Pick one of the two paths below. **Path A (GitHub)** is recommended — every push
redeploys automatically. **Path B (CLI)** deploys straight from this folder.

---

## Before you start

1. A [Vercel account](https://vercel.com/signup) — sign up with GitHub so both
   paths work.
2. Node.js 22 or newer locally (`node -v`).
3. A clean local build, so you find errors before Vercel does:

   ```bash
   npm ci
   npm run build
   npm run preview   # opens http://localhost:4173 — check the site loads
   ```

   If `npm run build` fails locally, it will fail on Vercel too. Fix it first.

---

## Path A — deploy from GitHub (recommended)

### 1. Put the project on GitHub

From the project folder:

```bash
git init
git add .
git commit -m "Portfolio site"
```

Create an empty repository on GitHub (no README, no .gitignore — this project has
both), then:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

> `node_modules/` and `dist/` are already in [.gitignore](.gitignore), so they
> stay out of the repo. Vercel installs and builds them itself.

### 2. Import the repository into Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub account if prompted, and grant access to the repository.
3. Find the repository in the list and click **Import**.

### 3. Confirm the project settings

Vercel reads [vercel.json](vercel.json) and fills these in automatically. Check
they match, then leave them alone:

- **Framework Preset:** Vite
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm ci`
- **Environment Variables:** none needed

### 4. Deploy

Click **Deploy**. The first build takes roughly one to two minutes. When it
finishes you get a live URL like `https://<repo-name>.vercel.app`.

Open it and check that the WebGL eyes render and follow the cursor — that is the
heaviest part of the page and the fastest way to confirm the build shipped intact.

### 5. Automatic deploys from here on

- Push to `main` → new **production** deploy.
- Push to any other branch, or open a pull request → **preview** deploy with its
  own URL, so you can review changes before they go live.

```bash
git add .
git commit -m "Update project descriptions"
git push
```

---

## Path B — deploy from the CLI

Use this if you do not want a GitHub repository. Note that CLI deploys are
one-off: there is no automatic redeploy on change, you rerun the command.

```bash
npm i -g vercel      # install the CLI once
vercel login         # opens the browser to authenticate
```

From the project folder:

```bash
vercel               # first run: creates the project, deploys a preview
```

Answer the prompts:

| Prompt | Answer |
| --- | --- |
| Set up and deploy? | `y` |
| Which scope? | your personal account |
| Link to existing project? | `n` |
| Project name? | `jayanti-kumari` (or anything) |
| In which directory is your code located? | `./` |
| Want to modify settings? | `n` — [vercel.json](vercel.json) has them |

That gives a preview URL. To publish to the production domain:

```bash
vercel --prod
```

Rerun `vercel --prod` after any change you want live.

---

## Adding a custom domain

1. In the Vercel dashboard open the project → **Settings** → **Domains**.
2. Enter the domain, e.g. `jayantikumari.dev`, and click **Add**.
3. Vercel shows the DNS records to create. At your domain registrar:
   - Apex domain (`example.com`) → `A` record pointing to `76.76.21.21`
   - Subdomain (`www.example.com`) → `CNAME` record pointing to
     `cname.vercel-dns.com`
4. Wait for DNS to propagate — usually minutes, up to 48 hours. Vercel issues the
   HTTPS certificate on its own once the records resolve.

After the domain is live, update the `Live:` line in [README.md](README.md).

---

## Troubleshooting

**Build fails with a TypeScript error.** `npm run build` runs `tsc -b` before
Vite, so any type error stops the deploy. Run `npm run build` locally, fix what it
prints, push again.

**Build fails with `npm ci` errors.** `npm ci` needs
[package-lock.json](package-lock.json) to match [package.json](package.json).
If you edited dependencies by hand, run `npm install` locally and commit the
updated lockfile.

**Page loads blank, console shows 404s for `/assets/...`.** The output directory
is wrong. It must be `dist` — check Settings → Build & Development Settings.

**Fonts do not load.** [index.html](index.html) pulls Instrument Serif, Space
Grotesk, and JetBrains Mono from Google Fonts at runtime. The site needs an
outbound connection to `fonts.googleapis.com`; if that is blocked, the layout
falls back to system fonts.

**Build warns about a chunk larger than 500 kB.** Expected. Three.js and the
postprocessing stack are bundled into one file (~390 kB gzipped). It is a warning,
not an error, and the deploy still succeeds. Reducing it would mean code-splitting
the WebGL scene behind a dynamic `import()`.

**Old version still showing.** Hard-reload (`Cmd+Shift+R`). Hashed asset
filenames change every build, so a stale `index.html` in the browser cache is the
usual cause.

---

## Rolling back

Dashboard → project → **Deployments**. Every past deploy is kept. Open a working
one, click the **⋯** menu, and choose **Promote to Production**. The rollback is
instant — no rebuild.
