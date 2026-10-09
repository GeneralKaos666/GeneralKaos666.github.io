# Design & plan — generalkaos666.github.io

Date: 2026-10-08
Status: built

## Brief

A personal landing page for GeneralKaos666 (Ron Sloan), replacing an empty "website" profile
field with a real page. Audience: people who arrive from the GitHub profile or a shared link
and want to see what Ron builds and how to reach him.

Success means: the page loads fast on a phone, shows the current projects without manual edits,
matches the cyberpunk identity of the profile README, and reads cleanly with JavaScript off.

## Decisions

| Decision | Choice | Why |
| :--- | :--- | :--- |
| Location | New repo `GeneralKaos666.github.io` | Cleanest URL, standard user Pages site. |
| Stack | Vanilla HTML/CSS/JS, no build | Termux-friendly, nothing to install, deploys from `main`. |
| Style | Cyberpunk neon + motion | Matches the profile; requested direction. |
| Data | Static content + live JS fetch | Works with JS off; stays current when JS is on. |
| Fonts | Orbitron (display), Fira Code (body) | Orbitron carries the neon display; Fira Code matches the terminal motif. |

## Structure

```
index.html                 hero, about, projects, working on, stats, contact
assets/styles.css          theme, layout, motion, responsive, reduced-motion
assets/app.js              typing, reveals, live GitHub data, counters
404.html                   not-found page
.nojekyll                  serve files as-is on Pages
README.md                  repo docs
docs/superpowers/specs/    this document
```

## Sections

1. **Hero** — glitch title, typing role line, tagline, GitHub + Projects calls to action.
2. **01 About** — short bio, a terminal card, and a neon chip stack.
3. **02 Featured projects** — the eight curated repos as cards; star counts hydrate from the API.
4. **03 Currently working on** — five recently pushed repos; replaced live, curated fallback.
5. **04 Stats** — live counters (repos, stars, followers) plus GitHub stats and streak cards.
6. **05 Contact** — GitHub, all repositories, email.

## Motion

Animated aurora backdrop, scanline overlay, glitch title (CSS pseudo-elements), blinking caret,
scroll reveals via `IntersectionObserver`, neon hover lifts, pulsing status dots, and count-up
stats. Every animation is disabled under `prefers-reduced-motion: reduce`.

## Accessibility

Skip link, semantic landmarks and headings, `aria-label` on navigation, `sr-only` text for the
decorative typing line, alt text on every image, visible `:focus-visible` outlines, and a
reduced-motion path. Body text (`#d7e0ea`) sits on `#05070d` for high contrast.

## Data flow

`app.js` calls `GET /users/GeneralKaos666` and `/users/GeneralKaos666/repos?sort=pushed`. It fills
star badges, updates the counters and the `uptime` line, and rebuilds the working-on list from
non-fork, non-archived repos. Any failure (offline, rate limit) leaves the static HTML in place.

## Verification

- `node --check assets/app.js` — no syntax errors.
- Every local asset referenced by the HTML exists.
- Live widget URLs return `image/svg+xml`.
- Repository / user links resolve.
- HTML tag balance and a `prefers-reduced-motion` code path review.
- After deploy: fetch the live URL and confirm HTTP 200.

## Out of scope

Blog, CMS, analytics, dark/light toggle, build pipeline, custom domain.
