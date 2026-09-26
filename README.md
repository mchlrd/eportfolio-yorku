# ePortfolio — Mykhailo Rud

Professional ePortfolio for **LE/COOP 2100** (Professional Development for Co-op Students),
Lassonde School of Engineering, York University.

Static site: plain HTML, CSS, and JavaScript. **No build step, no dependencies, no framework.**

## Design

The interface imitates the tools I actually work in — a code editor. File tree on the left, a
line-number gutter, and a status bar across the bottom.

Three rules hold the design together:

1. **Monospace only.** One size (`14px`) and one line-height (`19px`) everywhere. Hierarchy comes
   from colour, whitespace and structure — never from type size.
2. **A strict 19px vertical grid.** Every block sits on it, which is what keeps the gutter line
   numbers aligned with the text. Vertical space is expressed as blank lines (`<div class="sp">`)
   rather than margins.
3. **Colour as meaning.** Bright cream is a page title, sage is a heading, muted teal is body copy,
   dim grey is de-emphasised. Pink is a link.

The line numbers are generated at runtime from the rendered document height, so they always match
the real line count.

## Structure

| File | Section |
| --- | --- |
| `index.html` | Index / README — purpose, hyperlinked contents, status, competencies |
| `about.html` | **A** — About Me (biography, program, goals, languages, interests) |
| `career.html` | **B** — Education, courses, all experience, skills, résumé |
| `goals.html` | **C** — Three career goals, each gathering evidence in portfolios |
| `reflections.html` | **D** — Reflections framework and the index of all eight |
| `projects.html` | **E** — Five competency-tagged artifacts with full reflections |
| `assets/style.css` | The whole design system (tokens, grid, editor chrome, print) |
| `assets/main.js` | Editor chrome: tree, gutter, particle field, keyboard nav |

## Accessibility and resilience

- **Works without JavaScript.** Reflections use native `<details>`, navigation is a list of real
  links, and every page reads top to bottom. The script only adds chrome.
- Semantic landmarks (`header`, `aside`, `main`, `footer`), a skip link, and `aria-expanded` on
  every disclosure.
- Honours `prefers-reduced-motion` — the particle field and the typed tagline are disabled.
- Keyboard: `←` / `→` move between pages, `Esc` closes the mobile drawer.

## Running locally

The pages share `assets/` and cross-link to one another, so serve them over HTTP rather than
opening a single file directly. Any static server works:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8000/index.html>.

To print or save the r&#233;sum&#233; as a PDF, open `career.html#resume` and use its
**print / save as PDF** control. Print styles strip the editor chrome and render a clean document.

## Deploying

Zero-configuration static hosting (Vercel, GitHub Pages, Netlify):

- **Framework preset:** Other / None
- **Build command:** none
- **Output directory:** repository root
- **Entry point:** `index.html`

## Public-safety notes

This site is intentionally public-facing. It excludes a phone number, home address, personal dates,
and any classification or handling markings from placement work. Sensitive placement material is
described by its nature rather than by naming specific systems, clients, or datasets. Group work and
third-party images are not published without permission.

## Outstanding

Items still awaiting content are marked in the UI with an amber `todo` badge rather than quietly
omitted — see the **Status** section on the home page. Currently waiting on: high school details,
courses completed, other employment, volunteer and co-curricular roles, assessment results
(interests/skills and EQ), a photograph, and academic course projects.
