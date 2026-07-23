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
```

- **`data/projects.json`** — the list of projects. Controls the cards on the home page
  and the order of the ← Previous / Next → links between project pages.
- **`projects/<slug>.html`** — one page per project. The body is a blank canvas you
  design freely; the shared header and prev/next bar are injected automatically.
- **`images/`** — cover images and any other pictures.
- **`admin/edit.html`** — the control panel. It never saves by itself: it prepares
  files for you to download and move into the folders above.

The three folders you ever move files into: **`data/`**, **`projects/`**, **`images/`**.

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
