---
name: create-html-project
description: >-
  Author a project page for Jimena's portfolio (JimenaSCurto.github.io) as one
  self-contained projects/{slug}.html file: a three-act story of Context and Objective,
  a detailed Methodology written for both ML experts and non-technical readers, and
  Findings as flowing paragraphs with pop-up insight cards and interactive
  visualizations. Works in Claude Code with the repo AND in plain chat / claude.ai with
  only the project materials and the one HTML file — every invariant the page depends on
  is baked into this skill, so it never needs to read the rest of the repo. Use it
  WHENEVER Jimena hands over project materials (datasets, results, notebooks, figures, a
  paper, an abstract, model outputs) to turn into a portfolio page, or says things like
  "make the page for the Congress project", "write up this analysis for my portfolio",
  "turn these results into a project", or "build the Lady Macbeth page". Authors the
  page body; covers are handled by the project-cover skill and the admin.
---

# Create HTML Project Page

You turn a project's real materials into one polished, self-contained page in Jimena's
portfolio: `projects/<slug>.html`. The page sits below a shared header and above a
prev/next bar that are **injected by JavaScript you do not write** — your job is the
body between two markers, plus the page's own styling.

Read `references/page-blueprint.md` for the section structure and dual-register writing
voice, and `references/components.md` for copy-paste HTML/CSS/JS building blocks. This
file is the workflow **and the contract** — the full set of things the page depends on.

## Operating context — what you can and can't see

This skill is designed to run even when you have **no access to the rest of the repo**.
Assume the minimal case and you'll be correct everywhere:

- **You CAN see:** the project's own materials (notebooks, result files, figures,
  a paper/abstract, data tables) and the single target file `projects/<slug>.html`
  (often an empty stub) that you edit or produce.
- **You may NOT be able to see:** `data/projects.json`, `css/`, `js/header.js`,
  `index.html`, other project pages, or the `images/` folder. Do **not** assume you can
  read them. Everything the page relies on from outside itself is written below — treat
  this skill as the source of truth, not the repo.

Because of that, the page must be **correct by construction**: it wires itself to the
shared header/nav using fixed relative paths, and it carries all of its own styling and
interactivity inline. If you *do* have repo access (Claude Code), you may additionally
verify and place figures (see steps 5–6); if you don't, you produce a complete file and
tell Jimena exactly what to drop where.

## The contract — dependencies & invariants (must know)

These are non-negotiable because the page plugs into machinery you can't see. Get any of
these wrong and the header or navigation silently breaks.

### 1. File name and location
The file MUST be `projects/<slug>.html`, and the **filename must equal the slug**
exactly. `header.js` reads the slug from the filename to build the prev/next links, so
`projects/03-lady-macbeth.html` ⇒ slug `03-lady-macbeth`. Never rename it away from the
slug.

### 2. Fixed relative paths (the page lives one folder deep, in `projects/`)
- Shared header CSS → `../css/header.css`
- Shared header/nav JS → `../js/header.js`
- Home / gallery → `../index.html` (sections `#work`, `#about`, `#contact`)
- Any image → `../images/<file>`
- Project data (only `header.js` fetches it, not you) → `../data/projects.json`

### 3. The five lines that MUST be present, verbatim
The shared top nav and the ← Prev / Next → bar only appear if these survive. Keep the
Google-Fonts link (the header is styled in Cormorant Garamond + JetBrains Mono and will
look wrong without it), the header stylesheet, the two injection targets, and the script:

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/header.css">
<div id="site-header"></div>      <!-- header.js injects the top nav here -->
<div id="project-nav"></div>      <!-- header.js injects the ← Prev / Next → bar here -->
<script src="../js/header.js"></script>
```

### 4. What `header.js` does (so you know what NOT to do)
On load it: injects the top nav into `#site-header`; detects it's in `/projects/` and
fixes `../` paths; reads the slug from the filename; **fetches `../data/projects.json`**
and, from the *order* of that array, fills `#project-nav` with the previous/next project
links. Consequences you must respect:
- Do **not** hand-write the header or the prev/next bar — leave those two divs empty.
- Do **not** restyle `.site-nav` or `.project-nav` in your page CSS.
- Prev/Next only resolves if the slug exists as an entry in `data/projects.json`. You
  usually can't see or edit that file — so if you're unsure it's there, tell Jimena to
  confirm the entry via `admin/edit.html` (otherwise the card and prev/next won't link).

### 5. Author only inside the markers
Put your content between these two comments, and put page-specific CSS in a `<style>` in
the `<head>`. Everything else in the file stays as the skeleton (§ below).

```html
<!-- ▼▼▼ YOUR UNIQUE PROJECT DESIGN GOES HERE ▼▼▼ -->
...
<!-- ▲▲▲ END OF YOUR DESIGN ▲▲▲ -->
```

### 6. Self-contained, no required external libraries
GitHub Pages serves static files. All page styling and interactivity must be vanilla
HTML/CSS/JS **inline in this one file** (a sibling `projects/<slug>.css` is fine *only*
if you have repo access; in the file-only case, inline everything). Prefer hand-built
inline SVG for charts. A CDN chart library (D3, Chart.js, Plotly) is allowed only when a
visualization genuinely needs it — load it with a single `<script>` tag in this page.

### 7. Design language (so the page stays coherent without reading `styles.css`)
Palette — parchment `#f6f1e8`, ink `#1a1610`, gold `#b8902a`, muted `#8a7a6a`. Type —
Cormorant Garamond (display, often italic) + JetBrains Mono (labels/eyebrows) + a
readable serif for body. A distinct **accent color per project** is encouraged for
stylistic independence; keep it tasteful on parchment. Full tokens are in
`components.md` § Theme tokens.

### 8. Images
Reference figures as `../images/<file>`. Namespace them by slug to avoid collisions,
e.g. `../images/03-lady-macbeth-heatmap.png`. If you have repo access, copy the chosen
figures into `images/` yourself. If not, embed small figures as `data:` URIs for a truly
standalone file, **or** reference the `../images/<file>` path and tell Jimena to drop the
named files into `images/`. Covers are out of scope (project-cover skill + admin).

## Canonical page skeleton

When the file doesn't exist yet, or you need to rebuild it, this is the exact frame.
Fill the `<title>`, the `<style>`, and the marked body; keep everything else verbatim.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>PROJECT TITLE — Jimena Sánchez Curto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/header.css">
  <style>/* page tokens + your styles — see components.md §2 */</style>
</head>
<body>
  <div id="site-header"></div>

  <!-- ▼▼▼ YOUR UNIQUE PROJECT DESIGN GOES HERE ▼▼▼ -->
  <main class="project"> ... </main>
  <!-- ▲▲▲ END OF YOUR DESIGN ▲▲▲ -->

  <div id="project-nav"></div>
  <script src="../js/header.js"></script>
  <!-- your page JS here, after header.js -->
</body>
</html>
```

## Workflow

### 1. Confirm the slug
Establish the target slug (e.g. `03-lady-macbeth`) so the filename and `<title>` are
right. If Jimena names the project but not the slug, propose one from the number + a
short form of the title and confirm in one line. If a stub file exists, keep its four
header lines and markers.

### 2. Read the materials and set the style
Go through everything provided: the question, the data, the methods, the results.
**Extract exact numbers** from the source (notebook output, result tables, a metrics
file) — these drive the findings and at least one interactive chart. Ask for anything
essential that's missing. Note any style direction Jimena gives (accent color, mood,
density) and honor it; absent direction, use the portfolio's editorial, archival feel.

### 3. Write the three acts
Follow `references/page-blueprint.md`:
1. **Context & Objective** — the question and why it matters, in plain confident prose.
2. **Methodology** — the detailed core. Write like an ML practitioner (name the models,
   features, metrics, choices) and attach a **plain-language gloss** to every technical
   idea so a non-technical reader never falls off. Use the plain-aside and decode-toggle
   components.
3. **Findings** — flowing paragraphs that build an argument (not bullet dumps), with
   **pop-up insight cards** for the 2–5 sharpest takeaways and **interactive
   visualizations** wherever a picture beats a sentence. Lead with meaning over machinery.

### 4. Build the visualizations from real data
Use the numbers you extracted — never invent data; if a value is unknown, ask or key the
chart to what you actually have. Build charts as inline SVG (starters in
`components.md`); add light interactivity (hover to read, click to select, toggle a
series). For color/axes/labels, apply the `dataviz` skill's guidance.

### 5. (Repo access only) Place figures
If you can see the repo, copy chosen source figures into `images/` with slug-namespaced
names and reference them as `../images/<file>`.

### 6. Verify
- **With repo access:** preview over HTTP (a static file needs a real server to let
  `header.js` fetch `projects.json`): `python3 -m http.server 8731`, open
  `http://localhost:8731/projects/<slug>.html`. Confirm the top nav appears, the
  ← Prev / Next → bar is populated, all three sections render, every interactive element
  works, images load, and the console is clean. Stop the server when done.
- **File-only / chat:** you can't serve the site, so self-check against the contract:
  the five required lines are present and unmodified, all asset paths use `../`, the body
  is inside the markers, all CSS/JS is inline, charts use real numbers, and interactive
  elements are keyboard-accessible. Then tell Jimena to open it locally to see the header
  and prev/next populate.

### 7. Hand off — say what you couldn't do
Because you may not have touched the rest of the repo, spell out the remaining steps:
- Ensure `data/projects.json` has an entry with this `slug` (via `admin/edit.html`),
  or the gallery card and the ← Prev / Next → links won't appear.
- Drop any referenced `../images/<file>` figures into `images/`.
- A card **cover** is separate — point to the `project-cover` skill / the admin.
- Publish: it's a normal repo file, so `git add`/`commit`/`push` deploys it via GitHub
  Pages. Full maintenance steps live in `UPKEEP.md`.

## What good looks like

- A visitor with no ML background finishes understanding what was done and why it
  matters; an expert finishes respecting the rigor.
- Methodology is specific and honest — real models, metrics, and limitations.
- Findings read like a short essay punctuated by interaction: a stat that pops, a chart
  that responds. Not a wall of bullets, not a static screenshot.
- The page belongs to this portfolio yet has its own character — and it works the moment
  it's dropped into `projects/`, because it obeys the contract above.
