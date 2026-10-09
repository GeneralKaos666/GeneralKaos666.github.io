# GeneralKaos666.github.io

Personal landing page for [GeneralKaos666](https://github.com/GeneralKaos666) (Ron Sloan).

Live at **https://generalkaos666.github.io/**

## What it is

A single-page, zero-build static site. Plain HTML, CSS, and JavaScript — no bundler, no
dependencies, no install step. It deploys straight from the default branch via GitHub Pages.

Cyberpunk neon aesthetic shared with the profile README: cyan, magenta, and green on a dark
background, with an animated aurora backdrop, scanlines, a glitch title, a typing role line,
and scroll reveals.

## Progressive enhancement

Every section ships its content in `index.html`, so the page works with JavaScript disabled or
offline. When JavaScript is available, `assets/app.js` adds:

- the typing effect and scroll reveals (`prefers-reduced-motion` is honored)
- live star counts on the project cards
- a live "Currently working on" list from the GitHub API, with curated fallback copy
- animated counters for public repos, stars earned, and followers

If the GitHub API is unavailable or rate-limited, the page silently keeps its static content.

## Files

| Path | Purpose |
| :--- | :--- |
| `index.html` | The page: hero, about, projects, working on, stats, contact |
| `assets/styles.css` | All styling, motion, and responsive rules |
| `assets/app.js` | Progressive enhancement and live GitHub data |
| `404.html` | Not-found page |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |
| `docs/superpowers/specs/2026-10-08-github-pages-links-site-design.md` | Design brief and implementation notes |

## Local preview

No server needed for the markup, but the live data fetch works best over `http`:

```sh
python -m http.server 8000
# then open http://localhost:8000
```

## Deploying

Push to `main`. GitHub Pages serves the repository root. No CI, no build artifacts.
