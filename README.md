# Jimena Sánchez — Portfolio

Static portfolio site, built as plain HTML/CSS/JS for GitHub Pages. No build
step, no framework — open `index.html` in a browser or push to GitHub Pages
and it works as-is.

## Structure

```
.
├── index.html              # Main page (nav, hero, gallery, footer)
├── css/
│   └── styles.css          # All styles, fonts, animations
├── js/
│   └── gallery.js          # Loads data/projects.json, renders cards, filters
├── data/
│   └── projects.json       # Source of truth for the "Selected Works" gallery
├── images/                 # WebP images used on the site
├── admin/
│   ├── index.html          # Local editor for projects.json (no server needed)
│   ├── admin.css
│   └── admin.js
├── build/
│   └── optimize_images.py  # Converts new PNG/JPEG paintings to WebP
└── .nojekyll                # Tells GitHub Pages to skip Jekyll processing
```

## Editing your projects

You don't need to touch any code to add, edit, reorder, or remove a project.

1. Open `admin/index.html` in your browser (just double-click it, or run a
   local server — see below).
2. It auto-loads your current `data/projects.json`.
3. Edit fields directly, drag cards by the `⠿` handle to reorder, use
   **+ Add project** or **remove** as needed.
4. Click **Download projects.json**, then replace the file at
   `data/projects.json` with the one you downloaded.
5. Commit and push.

> Browsers block `fetch()` of local files opened via `file://`. If the admin
> page can't auto-load `data/projects.json`, use **Load projects.json…** to
> pick the file manually, or run a tiny local server first:
> `python3 -m http.server` from the repo root, then visit
> `http://localhost:8000/admin/`.

## Known TODO: gallery thumbnails

All 6 "Selected Works" cards currently use a plain placeholder
(`images/placeholder.webp`) — the painting photos in the original export
turned out to be blank/unrendered glow images, not actual artwork, so they've
been swapped out rather than shipped broken. The hero image (Vermeer's *Girl
with a Pearl Earring*) is real and unaffected. Add real project images via
the steps below, then update each project's `img` field in the admin page.

## Adding a new painting/image

1. Drop the new PNG or JPEG anywhere, e.g. a `raw/` folder you create locally
   (not committed — see `.gitignore`).
2. Run:
   ```
   pip install Pillow
   python3 build/optimize_images.py raw/ images/
   ```
   This resizes large images and converts them to WebP at web-friendly sizes.
3. Reference the new file (e.g. `images/your-new-piece.webp`) in a project's
   `img` field via the admin page or directly in `data/projects.json`.

## Deploying to GitHub Pages

1. Push this folder's contents to a GitHub repo (root of `main`, or a `docs/`
   folder — your choice, just match it in the Pages settings).
2. In the repo: **Settings → Pages → Build and deployment → Source** → select
   the branch/folder you pushed to.
3. GitHub will publish at `https://<username>.github.io/<repo>/`.

The included `.nojekyll` file prevents GitHub's default Jekyll build step
from running, which isn't needed here and can occasionally interfere with
plain static sites.

## Fonts

Cormorant Garamond and JetBrains Mono are loaded from Google Fonts via the
`<link>` tags in `index.html` and `admin/index.html` — no local font files
needed.
