---
name: create-html-project
description: >-
  Build the full write-up for a portfolio project page in this repo
  (JimenaSCurto.github.io) — it locates the correct projects/<slug>.html file and
  fills its blank body with a three-act story: Context & Objective, a detailed
  Methodology written for both ML experts and non-technical readers, and Findings
  presented as flowing paragraphs with pop-up insight cards and interactive
  visualizations. Use this skill WHENEVER Jimena hands over project materials
  (datasets, results, notebooks, figures, a paper, an abstract, model outputs) and
  wants them turned into a project page, or says things like "make the page for the
  Congress project", "write up this analysis for my portfolio", "turn these results
  into a project", "build the Lady Macbeth page", or gives style directions for an
  existing project page. This is the skill for authoring the *body* of a project
  page; covers are handled separately by the project-cover skill and the admin.
---

# Create HTML Project Page

You are turning a pile of project materials into one polished, self-contained project
page in Jimena's portfolio. Each project page is a **blank canvas** below a shared
header — your job is to fill that canvas with a compelling, rigorous, and readable
account of the project.

Read `references/page-blueprint.md` for the exact section structure and the
dual-register writing voice, and `references/components.md` for copy-paste
HTML/CSS/JS building blocks (insight pop-ups, plain-language asides, SVG charts).
Pull those in as you need them; this file is the workflow.

## The repo, in one breath

- `data/projects.json` — the project list. Each entry has a `slug`; the page lives at
  `projects/<slug>.html`.
- `projects/<slug>.html` — the page you edit. A shared header and a ← Prev / Next →
  bar are **injected by JavaScript**; you only author the body between two markers.
- `images/` — figures and pictures. Reference them from a project page as
  `../images/<file>`.
- Palette: parchment `#f6f1e8` · ink `#1a1610` · gold `#b8902a`. Fonts: Cormorant
  Garamond (display) + JetBrains Mono (labels). Each page may look stylistically
  independent, but staying in this family keeps the portfolio coherent.

## Hard constraints — never break these

The shared header and inter-project navigation only work if these four lines survive
untouched in the page. Edit around them:

```html
<link rel="stylesheet" href="../css/header.css">
<div id="site-header"></div>
<div id="project-nav"></div>
<script src="../js/header.js"></script>
```

Author **only** inside the region between these markers (add your own `<style>` to the
`<head>` too, or link a sibling `projects/<slug>.css`):

```html
<!-- ▼▼▼ YOUR UNIQUE PROJECT DESIGN GOES HERE ▼▼▼ -->
...
<!-- ▲▲▲ END OF YOUR DESIGN ▲▲▲ -->
```

Everything must be **self-contained**: GitHub Pages serves static files, so all styling
and interactivity is vanilla HTML/CSS/JS living in this page (or its sibling CSS). Prefer
hand-built inline SVG for charts. Only reach for a CDN library (D3, Chart.js, Plotly)
when a visualization genuinely needs it — and if you do, load it with a single `<script>`
tag in that one page.

## Workflow

### 1. Identify the target file

Read `data/projects.json`. Match the materials to a project by title/topic and take its
`slug`. Confirm the match with Jimena in one line ("This is project 01 → `01-congress`,
right?") unless it's unambiguous.

- If the page file `projects/<slug>.html` **exists**, open it and confirm it still has
  the two design markers and the four header lines.
- If it **doesn't exist** (new project), create it from the same stub the rest of the
  site uses — copy an existing `projects/*.html`, or generate the scaffold shown in
  `references/components.md` (§ Page scaffold), setting the `<title>` and slug.
- If the project isn't in `data/projects.json` at all, tell Jimena — the card and the
  Prev/Next links depend on that entry (she adds it via `admin/edit.html`). You can
  still build the page; just flag that the JSON entry is needed for it to be linked.

### 2. Understand the material and set the style

Skim everything she gave you: what was the question, what data, what methods, what came
out. Ask for anything essential that's missing (e.g., "what were the actual top findings
you want to lead with?"). Note any style directions she gave — mood, color accents,
density, whether she wants it playful or austere — and honor them. Absent direction,
default to the portfolio's editorial, archival feel (see the blueprint).

### 3. Write the three acts

Follow `references/page-blueprint.md` closely. In short:

1. **Context & Objective** — open here. Why this project exists and what question it
   answers, in plain, confident prose. A reader should know within 30 seconds what this
   is and why it matters.
2. **Methodology** — the detailed core. Write like a machine-learning practitioner:
   name the models, features, metrics, and choices precisely. But every time you use a
   technical idea, give a **parallel plain-language explanation** so a non-technical
   reader never falls off. See the blueprint's dual-register pattern and the
   plain-language-aside component.
3. **Findings** — deliver the payoff as **paragraphs** that build an argument, not a
   bullet dump. Compress the sharpest takeaways into **pop-up insight cards** (click to
   reveal a punchy one-liner or stat), and show results through **clear, interactive
   visualizations** wherever a picture beats a sentence.

Lead with meaning over machinery throughout: say what a result *means* before how it was
computed.

### 4. Make the visualizations count

Every figure should earn its place and be readable at a glance. For chart design
(color, axes, labels, accessibility), consult the **`dataviz` skill** — its palette and
mark guidance apply directly. Build charts as inline SVG when you can; add lightweight
interactivity (hover to read a value, toggle a series, brush a timeline) with a few lines
of vanilla JS. `references/components.md` has starters for bar, timeline/line, and
network diagrams — adapt them to the real data rather than shipping the placeholder.

Use real numbers from Jimena's materials. Never invent data; if a value is unknown, ask
or leave the visualization keyed to the data you actually have.

### 5. Verify it renders

Preview before declaring done — a static page with a JS-injected header needs a real
HTTP server (not `file://`) to load `projects.json` for Prev/Next:

```bash
cd <repo> && python3 -m http.server 8731   # then open http://localhost:8731/projects/<slug>.html
```

Confirm: the shared top nav appears, the ← Prev / Next → bar is populated, your three
sections render, every interactive element works, and the browser console is clean. Fix
anything broken. Stop the server when done.

### 6. Hand off

Summarize what you built and remind Jimena of the publish loop: the page is a normal
repo file, so `git add`/`commit`/`push` deploys it via GitHub Pages. If a cover or the
`projects.json` entry is still missing, point her to `admin/edit.html` (and the
`project-cover` skill for the cover art). The detailed maintenance steps live in
`UPKEEP.md`.

## What good looks like

- A visitor with no ML background finishes the page understanding what was done and why
  it matters; an expert finishes it respecting the rigor.
- The methodology is specific and honest — real models, real metrics, real limitations —
  never hand-wavy.
- Findings read like a short essay punctuated by moments of interaction: a stat that
  pops, a chart that responds. Not a wall of bullets, not a static PDF screenshot.
- The page feels like it belongs to this portfolio, yet has its own visual character.
