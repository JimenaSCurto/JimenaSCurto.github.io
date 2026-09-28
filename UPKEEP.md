# Portfolio Upkeep Guide

Everything on this site is driven by a few files. You never have to hand-edit the
gallery or navigation — you use the admin interface and move a couple of files into
place. This guide tells you **exactly** what to do, step by step.

---

## How the site fits together (read once)

```
data/projects.json ──(slug)──► projects/<slug>.html
       │                              │
   js/gallery.js                  js/header.js
   builds the cards           shared top nav + ← Prev / Next → bar

   a TOPIC's page additionally reads its own manifest:
data/topics/<slug>.json ──► js/topic.js ──► scope · lenses · publications
```

- **`data/projects.json`** — the list of projects. Controls the cards on the home page
  and the order of the ← Previous / Next → links between project pages.
- **`projects/<slug>.html`** — one page per project. The body is a blank canvas you
  design freely; the shared header and prev/next bar are injected automatically.
- **`images/`** — cover images and any other pictures.
- **`admin/edit.html`** — the control panel. It never saves by itself: it prepares
  files for you to download and move into the folders above.

The folders you ever move files into: **`data/`**, **`data/topics/`**, **`projects/`**, **`images/`**.

---

## Opening the admin

The admin needs to load `data/projects.json`, which browsers block when you open the
file directly. So run a tiny local server from the project folder:

```bash
cd /Users/jimenasanchezcurto/Desktop/GAD3/JimenaSCurto.github.io
python3 -m http.server 8731
```

Then open **http://localhost:8731/admin/edit.html** in your browser.
When you're done, stop the server with `Ctrl+C` in that terminal.

> Everything the admin "downloads" lands in your **Downloads** folder. Your job is to
> move each downloaded file into the right project folder, then commit.

---

## TASK 1 — Add a new project

1. In the admin, click **+ Add project**. A new card appears at the bottom.
2. Fill in the fields:
   - **Number** (e.g. `07`), **Category key** + **Category label**, **Tags**,
     **Title**, **Description**.
   - **Page slug** — the page's filename. Leave it blank to auto-fill from the title,
     or type your own (lowercase, words separated by hyphens, e.g. `07-elections`).
     This becomes `projects/<slug>.html`.
3. **Set the cover image:** under the card, click the **Cover image** picker and choose
   a picture.
   - The preview updates instantly.
   - The image path is set automatically (e.g. `images/07-elections-cover.png`).
   - A correctly-named copy **downloads**. → **Move it into the `images/` folder.**
4. Click **Download projects.json** (top toolbar). → **Replace `data/projects.json`**
   with the downloaded file.
5. On that project's card, click **download page HTML**. → **Move the downloaded
   `<slug>.html` into the `projects/` folder.**
6. Open `projects/<slug>.html` in your editor and build the page — see **TASK 4**.
7. Commit and push — see **Publishing** at the bottom.

After this, the new card shows on the home page, links to the new page, and the
← Prev / Next → links on the neighbouring pages update on their own.

---

## TASK 2 — Change a cover, title, tags, or description (no page rewrite)

1. Open the admin. Edit the fields on the card.
2. To swap the cover: use the **Cover image** picker again → move the downloaded image
   into `images/`.
3. Click **Download projects.json** → replace `data/projects.json`.
4. Commit and push.

(You do **not** touch the page file for data-only edits like these.)

---

## TASK 3 — Reorder or remove a project

**Reorder:** drag a card by the `⠿` handle into the position you want. Then
**Download projects.json** → replace `data/projects.json` → commit. The cards **and**
the Prev/Next order both follow the new order.

**Remove:** click **remove** on the card → **Download projects.json** → replace
`data/projects.json`. Then delete the leftover `projects/<slug>.html` file yourself
(the admin can't delete files). Commit.

---

## TASK 4 — Design or edit a project page

Each `projects/<slug>.html` is a **blank canvas**. Open it in your editor.

**Edit ONLY the part between these two markers:**

```html
<!-- ▼▼▼ YOUR UNIQUE PROJECT DESIGN GOES HERE ▼▼▼ -->
<main class="placeholder"> ... </main>
<!-- ▲▲▲ END OF YOUR DESIGN ▲▲▲ -->
```

- Replace the `<main>` with your write-up, images, charts, whatever you like.
- Add styles in the `<style>` block in the `<head>`, or link a separate stylesheet,
  e.g. `<link rel="stylesheet" href="07-elections.css">` (put the CSS file in
  `projects/`). Each page can look completely different from the others.
- Put any images the page uses in `images/` and reference them as `../images/yourpic.webp`.

**Do NOT touch these — they run the shared header and navigation:**

```html
<link rel="stylesheet" href="../css/header.css">   <!-- shared header styling -->
<div id="site-header"></div>                        <!-- top nav, injected -->
<div id="project-nav"></div>                         <!-- prev/next bar, injected -->
<script src="../js/header.js"></script>              <!-- makes both work -->
```

Commit and push when done.

---

## TASK 5 — Set a project's status

Every project has a **Status** in the admin (field `status` in `projects.json`):

| Status | On the site | Orb |
|---|---|---|
| `completed` | shown, labelled "Completed" | *solving* (gold) |
| `in-progress` | shown, labelled "In progress" | *connecting* |
| `idea` | shown, labelled **"Planned"** | *breathing* |

**Status no longer hides anything.** All three appear on the home page and in the
counts, and the status legend filters by them. What decides whether a card is a
link is whether `projects/<slug>.html` exists: no page, and the card reads
"forthcoming" and cannot be clicked.

That is deliberate. A topic is worth showing while it is still an idea — its
scope and its index of lenses are readable work in their own right. An article
you are not ready to show simply has no page yet.

> **To keep something genuinely unpublished, leave its page out of
> `projects/`.** A row in `projects.json` with no page is inert and safe. A page
> that exists is reachable by anyone who guesses its URL, whatever its status
> says.
>
> Inside a topic manifest the old rule still holds: a publication with
> `"status": "idea"` is hidden from the topic page entirely.

---

## TASK 6 — The two project types

Every project is one of two things, and the difference is not cosmetic.

| | **Standalone article** | **Topic** (recurrent publication) |
|---|---|---|
| What it is | One finished piece of work | A bank of publications, each with its own page |
| Type field | `article` | `series` |
| Card on the home page | **Square**, under *Standalone Articles* | **Wide**, under *Topics* |
| Its page | A blank canvas you design | The topic shell, driven by a manifest (TASK 9) |
| Card says | "read →" | "enter the topic →" |

A third thing exists: a **publication of a topic**. That is an `article` whose
**Part of topic** field holds a topic's slug. It never appears on the home page —
it lives inside its topic, and its ← Prev / Next → links run between the other
publications of that same topic, with a middle link back up to the topic.

> The data still calls a topic a `series`, because the admin and every saved
> `projects.json` speak that word. Only the wording on the site changed.

**Status is a label, not a gate.** `completed`, `in progress` and `planned` all
show on the home page. What decides whether a card is a *link* is simply whether
`projects/<slug>.html` exists — a project with no page reads "forthcoming" and
stays inert. That is why a topic can be on the site from the day it is an idea:
the scope and the index are worth reading before any publication exists.

---

## TASK 7 — Add or change a topic's manifest

A topic page is nearly empty HTML. Everything it shows lives in
**`data/topics/<slug>.json`**. Editing a topic means editing that file.

```
{
  "title", "subtitle"       what the masthead says
  "accent"                  one hex. Tints every rule, pill and swatch
                            on the page. This is the topic's identity.
  "question"                the standfirst, set large against the accent rule
  "scope"                   an array of paragraphs — why this is a topic
  "method"                  [{ name, note }] — the sidebar's method list
  "corpus"                  [{ k, v }] — the little facts grid
  "lenses"                  the ways in (below)
  "facets"                  the taxonomy each lens groups by (below)
  "publications"            what has actually been published (below)
}
```

### Lenses — the ways into a topic

A lens is an axis a reader can explore the topic along. Two kinds:

```jsonc
// Group publications by the values of one facet.
{ "key": "party", "label": "By party", "kind": "facet", "facet": "party",
  "blurb": "shown under the switcher", "empty": "shown when nothing is published" }

// A flat list of publications whose "kind" matches.
{ "key": "notes", "label": "Notes", "kind": "kind", "match": "note",
  "blurb": "…", "empty": "…",
  "link": { "label": "Read the Substack", "href": "https://…" } }
```

The first lens in the array is the one the page opens on.

### Facets — the taxonomy

```jsonc
"facets": {
  "party": {
    "label": "Parliamentary group",
    "order": ["PSOE", "PP"],          // controls display order
    "values": {
      "PSOE": { "label": "PSOE", "full": "Partido Socialista…",
                "color": "#E30613" }   // optional; tints this cell
    }
  }
}
```

A facet lens prints its whole taxonomy whether or not anything is published
under it, so the page is a navigable index of the topic's structure from day
one and fills in as work lands.

**Borrowed colours.** A lens can take its accents from *another* facet with
`"accentFrom"`. That is how each deputy in *Mapping the Rhetoric* is tinted with
the colour of the group they sit with: the deputy's entry carries
`"party": "PSOE"`, the lens carries `"accentFrom": "party"`, and the colour is
looked up there. Anything with no colour falls back to the topic's accent.

> The party colours in `01-congress.json` are the usual brand values, typed by
> hand. If any is wrong, it is one hex in that file.

### Publications

```jsonc
"publications": [
  { "slug": "09-psoe-framing",   // → projects/09-psoe-framing.html
    "num": "01", "title": "…", "desc": "…",
    "status": "completed",       // "idea" hides it everywhere
    "kind": "finding",           // matched by a kind lens
    "date": "2026",
    "facets": { "party": ["PSOE"], "deputy": ["…"] } }
]
```

A publication appears under every facet value it lists, so one piece can sit in
several lenses at once. It becomes a link only once its page exists.

**Two lists, one job:** a publication listed here also needs a row in
`data/projects.json` (Type = *standalone article*, Part of topic = the topic's
slug) if you want its ← Prev / Next → bar to chain properly. The manifest drives
the topic page; `projects.json` drives navigation.

---

## TASK 8 — Start a new topic

1. In the admin, add a project and set **Type = topic (recurrent publication)**.
2. Give it a slug, then **Download page HTML**. You get *two* files:
   - `<slug>.html` → move into `projects/`
   - `<slug>.json` → move into `data/topics/`
3. Open the JSON and fill in the scope, the accent, and at least one lens.
4. Commit. The topic is live, with an honest empty state, before a single
   publication exists.

---

## TASK 9 — Add a painting to the hero

The hero cycles through a roster of paintings. The scanner bar takes 12 seconds
to sweep the canvas; when it reaches the bottom, the next painting fades in.

1. Crop the picture to **924 × 1072** (the portrait frame) keeping the main
   subject in view, save it as a `.webp` under about 260 KB, and drop it in
   `images/` as `hero-<name>.webp`.
2. Open **`js/paintings.js`** and add an entry to `window.PAINTINGS`:

   - `src` — `images/hero-<name>.webp`
   - `edge` — a very dark hex sampled from the painting's own borders. The page
     background fades to this while the painting is on screen.
   - `cropped` — `true` if you cut a wider painting down to the frame. It shows
     the "cropped to the frame" note under the picture.
   - `alt` / `caption` — `{ en: "…", es: "…" }`
   - `annotations` — the four scanner read-outs. `pos` is plain CSS
     (`"top:14%; left:4%"`), so place them over the part of the painting they
     describe. `bars` draws the little sentiment meter instead of a `meta` line.

Nothing else changes: the order in the array is the order they appear.

---

## TASK 10 — Change the English or the Spanish

The English text lives in **`index.html`** — that is the original. Edit it there.

The Spanish lives in **`js/i18n.js`**, in one list near the top, keyed by the
`data-i18n="…"` attribute on the English element. To translate something new:

1. In `index.html`, put `data-i18n="some.key"` on the element.
2. In `js/i18n.js`, add `"some.key": "el español",` to the list.

Anything without a Spanish entry simply stays in English, so a half-finished
translation never breaks the page. Project cards come from `data/projects.json`
and are **not** translated yet — they read in English in both languages.

---

## Two rules that keep everything working

1. **The slug in `projects.json` must exactly match the page filename.**
   Slug `07-elections` ⇒ file must be `projects/07-elections.html`. If you rename one,
   rename the other. The admin keeps them in sync automatically; just don't rename a
   file by hand without updating its slug.
2. **Commit the JSON and the page file together.** A card whose page file is missing
   will 404; a page file with no matching card gets no Prev/Next links.

---

## Publishing (commit & push)

The site deploys from the `main` branch via GitHub Pages. After moving your downloaded
files into place:

```bash
cd /Users/jimenasanchezcurto/Desktop/GAD3/JimenaSCurto.github.io
git add -A
git status          # check the files you moved are staged
git commit -m "Add/update project: <short description>"
git push
```

Give GitHub Pages a minute, then refresh the live site.

---

## Quick reference — where each downloaded file goes

| The admin downloads… | You move it to… |
| --- | --- |
| `projects.json` | `data/projects.json` (replace) |
| `<slug>.html` | `projects/` |
| `<slug>-cover.<ext>` (cover image) | `images/` |

## Quick reference — which files do what

| File | Role | Edit by hand? |
| --- | --- | --- |
| `data/projects.json` | Project list + order | No — use the admin |
| `projects/<slug>.html` | One project's page | Yes — the body only |
| `images/` | Covers & pictures | Drop files in |
| `admin/edit.html` | Control panel | No |
| `js/header.js`, `css/header.css` | Shared header + nav | No |
| `js/gallery.js` | Home-page cards | No |
| `js/topic.js`, `css/topic.css` | The topic page shell | No |
| `data/topics/<slug>.json` | One topic: scope, lenses, publications | Yes — see TASK 7 |
| `js/orbs.js` | Status orbs | No |
| `js/paintings.js` | Hero painting roster | Yes — see TASK 9 |
| `js/i18n.js` | The Spanish half of the site | Yes — see TASK 10 |
