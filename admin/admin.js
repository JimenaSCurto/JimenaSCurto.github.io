/* ──────────────────────────────────────────────────────────────────
   Admin editor for data/projects.json.
   Pure client-side: load a JSON file (or the live one from the repo),
   edit fields in the UI, reorder by drag, then download the result
   to commit back into the repo. No server, no auto-save.
   ────────────────────────────────────────────────────────────────── */

const FIELD_KEYS = ["num", "cat", "catLabel", "tags", "title", "desc", "slug", "img", "alt"];

let projects = [];

// Turn a title (or any text) into a URL/filename-safe slug.
// Accents stripped, lowercased, non-alphanumerics collapsed to hyphens.
function slugify(text) {
  return String(text || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// A project's slug, derived from num + title if the field is blank.
function slugFor(project) {
  if (project.slug && project.slug.trim()) return project.slug.trim();
  const base = slugify(project.title);
  return project.num ? `${project.num}-${base}` : base;
}

const listEl = document.getElementById("admin-list");
const template = document.getElementById("card-template");
const statusEl = document.getElementById("status");
const fileInput = document.getElementById("file-input");

function setStatus(msg) {
  statusEl.textContent = msg;
  if (msg) {
    setTimeout(() => {
      if (statusEl.textContent === msg) statusEl.textContent = "";
    }, 3500);
  }
}

function render() {
  listEl.innerHTML = "";
  projects.forEach((project, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.index = String(index);

    node.querySelector(".card-index").textContent = `project ${index + 1}`;

    FIELD_KEYS.forEach((key) => {
      const field = node.querySelector(`[data-field="${key}"]`);
      if (!field) return;
      field.value = project[key] || "";
      field.addEventListener("input", () => {
        project[key] = field.value;
        // Keep an empty slug in step with the title, but never overwrite
        // a slug the user has typed themselves.
        if (key === "title" && !project.slug) {
          node.querySelector('[data-field="slug"]').placeholder = slugFor(project);
        }
        updatePreview(node, project);
      });
    });

    node.querySelector(".remove-btn").addEventListener("click", () => {
      if (confirm(`Remove "${project.title || "this project"}"?`)) {
        projects.splice(index, 1);
        render();
      }
    });

    // Per-project page actions: open the live page, or download its HTML file.
    const openLink = node.querySelector(".page-open");
    openLink.href = `../projects/${slugFor(project)}.html`;
    node.querySelector(".page-download").addEventListener("click", () => {
      downloadPage(project);
    });

    // Cover image picker: choose a file → set the path, preview it, and
    // download a repo-ready copy to drop into images/.
    wireCover(node, project);

    attachDragHandlers(node);
    updatePreview(node, project);
    listEl.appendChild(node);
  });
}

function updatePreview(node, project) {
  const slug = slugFor(project);
  node.querySelector(".page-status").textContent = `page: projects/${slug}.html`;
  node.querySelector(".page-open").href = `../projects/${slug}.html`;
  const preview = node.querySelector(".admin-preview");
  preview.textContent = JSON.stringify(project);
}

// Files the user picked this session, keyed by project object. Kept off the
// project itself so JSON output stays clean. Used only for live preview.
const pickedCovers = new WeakMap();

function showCover(node, project) {
  const img = node.querySelector(".cover-preview");
  const empty = node.querySelector(".cover-empty");
  const picked = pickedCovers.get(project);
  const path = (project.img || "").trim();
  let src = "";
  if (picked) src = picked.url;                       // just chosen, not yet in repo
  else if (path && !path.endsWith("/")) src = `../${path}`; // existing file in the repo
  if (src) {
    img.src = src;
    img.hidden = false;
    empty.hidden = true;
  } else {
    img.hidden = true;
    empty.hidden = false;
  }
}

function wireCover(node, project) {
  const fileInput = node.querySelector(".cover-file");
  const imgField = node.querySelector('[data-field="img"]');

  showCover(node, project);

  // Keep the preview in step if the path is typed by hand.
  imgField.addEventListener("input", () => {
    pickedCovers.delete(project);
    showCover(node, project);
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    const ext = (file.name.split(".").pop() || "webp").toLowerCase().replace(/[^a-z0-9]/g, "");
    const name = `${slugFor(project)}-cover.${ext || "webp"}`;
    const path = `images/${name}`;

    project.img = path;
    imgField.value = path;

    pickedCovers.set(project, { file, name, url: URL.createObjectURL(file) });
    showCover(node, project);
    updatePreview(node, project);

    // Hand over a correctly-named copy for the images/ folder.
    downloadRaw(name, file);
    setStatus(`Cover set → ${path}. Downloaded ${name} — move it into images/ and commit.`);
    fileInput.value = "";
  });
}

function attachDragHandlers(node) {
  node.addEventListener("dragstart", () => {
    node.classList.add("dragging");
  });
  node.addEventListener("dragend", () => {
    node.classList.remove("dragging");
    syncOrderFromDom();
  });
  node.addEventListener("dragover", (e) => {
    e.preventDefault();
    const dragging = listEl.querySelector(".dragging");
    if (!dragging || dragging === node) return;
    const rect = node.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    listEl.insertBefore(dragging, before ? node : node.nextSibling);
  });
}

function syncOrderFromDom() {
  const newOrder = [];
  listEl.querySelectorAll(".admin-card").forEach((node) => {
    const idx = Number(node.dataset.index);
    newOrder.push(projects[idx]);
  });
  projects = newOrder;
  render();
}

document.getElementById("add-project").addEventListener("click", () => {
  const num = String(projects.length + 1).padStart(2, "0");
  projects.push({
    num,
    slug: "",
    cat: "nlp-politics",
    catLabel: "NLP · Politics",
    tags: "",
    title: "New project",
    desc: "",
    img: "images/",
    alt: "",
  });
  render();
  setStatus("Added a new project — set its slug, then download its page HTML.");
});

/* ── Project page (stub HTML) generation ─────────────────────────────
   Builds the same blank-canvas page as the existing /projects/*.html
   stubs: shared header + prev/next bar wired up by header.js, with an
   empty <main> for you to design. */
function buildPageHtml(project) {
  const slug = slugFor(project);
  const title = project.title || "Untitled project";
  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const t = esc(title);
  const s = esc(slug);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${t} — Jimena Sánchez Curto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- Fonts the shared header uses. Keep these; add your own freely. -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">

  <!-- Shared header styling — do NOT restyle .site-nav / .project-nav here. -->
  <link rel="stylesheet" href="../css/header.css">

  <!--
    This page is a blank canvas. Design everything between #site-header
    and #project-nav however you like — add a <style> block below, or
    link a per-project stylesheet, e.g.:
      <link rel="stylesheet" href="${s}.css">
    Nothing here has to match the other project pages.
  -->
  <style>
    /* Temporary placeholder look — replace with your own design. */
    body { margin: 0; background: #f6f1e8; color: #1a1610;
           font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    .placeholder { max-width: 760px; margin: 0 auto; padding: 120px 24px; }
    .placeholder .eyebrow { font-family: "JetBrains Mono", monospace;
           font-size: 11px; letter-spacing: 0.14em; color: #b8902a;
           text-transform: uppercase; }
    .placeholder h1 { font-family: "Cormorant Garamond", serif;
           font-weight: 400; font-size: 44px; line-height: 1.1; margin: 16px 0 0; }
    .placeholder p { color: #8a7a6a; margin-top: 24px; line-height: 1.6; }
  </style>
</head>
<body>

  <!-- Shared top nav — filled in by header.js -->
  <div id="site-header"></div>

  <!-- ▼▼▼ YOUR UNIQUE PROJECT DESIGN GOES HERE ▼▼▼ -->
  <main class="placeholder">
    <div class="eyebrow">Project · ${s}</div>
    <h1>${t}</h1>
    <p>This page is an empty stub. Replace this &lt;main&gt; with the project
       write-up, images, and any layout you want — it can look completely
       different from every other page.</p>
  </main>
  <!-- ▲▲▲ END OF YOUR DESIGN ▲▲▲ -->

  <!-- Prev/next between projects — filled in by header.js -->
  <div id="project-nav"></div>

  <script src="../js/header.js"></script>
</body>
</html>
`;
}

function downloadBlob(filename, text, mime) {
  downloadRaw(filename, new Blob([text], { type: mime }));
}

// Download an already-built Blob/File (used for binary cover images).
function downloadRaw(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadPage(project) {
  const slug = slugFor(project);
  if (!slug) {
    alert("Give this project a title or slug first — the page needs a filename.");
    return;
  }
  downloadBlob(`${slug}.html`, buildPageHtml(project), "text/html");
  setStatus(`Downloaded ${slug}.html — move it into projects/ and commit.`);
}

document.getElementById("download-pages").addEventListener("click", () => {
  if (!projects.length) return;
  projects.forEach((p, i) => {
    // Stagger the downloads so the browser doesn't drop them.
    setTimeout(() => downloadPage(p), i * 150);
  });
  setStatus(`Downloading ${projects.length} page files — move them into projects/.`);
});

document.getElementById("load-file").addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error("File must contain a JSON array");
    projects = data;
    render();
    setStatus(`Loaded ${data.length} projects from ${file.name}`);
  } catch (err) {
    alert("Could not read that file as a projects array: " + err.message);
  }
  fileInput.value = "";
});

document.getElementById("download-file").addEventListener("click", () => {
  // Bake any auto-derived slugs into the data so the JSON and the page
  // filenames always agree.
  projects.forEach((p) => {
    if (!p.slug || !p.slug.trim()) p.slug = slugFor(p);
  });
  render();
  downloadBlob("projects.json", JSON.stringify(projects, null, 2), "application/json");
  setStatus("Downloaded — move it into data/projects.json and commit.");
});

async function init() {
  try {
    const res = await fetch("../data/projects.json");
    projects = await res.json();
    setStatus(`Loaded ${projects.length} projects from data/projects.json`);
  } catch (err) {
    console.error(err);
    projects = [];
    setStatus("Could not auto-load data/projects.json — use 'Load projects.json…' instead.");
  }
  render();
}

init();
