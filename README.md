# ePortfolio — Mykhailo Rud

Professional ePortfolio for **LE/COOP 2100** (Professional Development for Co-op Students),
Lassonde School of Engineering, York University.

Static site: plain HTML, CSS, and JavaScript. **No build step, no dependencies, no framework.**

## Structure

| File | Section |
| --- | --- |
| `index.html` | Index / Navigation — purpose statement and hyperlinked table of contents |
| `about.html` | **A** — About Me |
| `career.html` | **B** — Education, Experience, Technical Skills, Résumé |
| `goals.html` | **C** — Goal *Discover Myself* and its four portfolios |
| `reflections.html` | **D** — Reflections (Retell / Relate / Reflect) and the reflection index |
| `projects.html` | **E** — Course Projects & Work Samples |
| `assets/style.css` | Shared stylesheet (design tokens, layout, hover states, print styles) |
| `assets/main.js` | Shared behaviour (navigation, scroll progress, reveal, disclosures) |

Every page carries the shared toolbar, a home button, and a footer with name, email, and last-updated
date. Every artifact is tagged with at least one Lassonde undergraduate competency and paired with a
reflection that explains the connection.

## Running locally

The pages share `assets/` and cross-link to one another, so serve them over HTTP rather than opening
a single file directly. Any static server works:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000/index.html>.

To print or save the résumé as a PDF, open `career.html#resume` and use its
**Print / Save as PDF** button.

## Deploying

Designed for a zero-configuration static host such as Vercel or GitHub Pages:

- **Framework preset:** Other / None
- **Build command:** none
- **Output directory:** repository root
- **Entry point:** `index.html`

## Public-safety notes

This site is intentionally public-facing. It excludes a phone number, home address, personal dates,
and any classification or handling markings from placement work. Sensitive placement material is
described by its nature rather than by naming specific systems, clients, or datasets. Group work and
third-party images are not published without permission.
