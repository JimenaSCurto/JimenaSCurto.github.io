/* ──────────────────────────────────────────────────────────────────
   Shared header include — single source of truth for the site nav.

   Any page just needs:
     <link rel="stylesheet" href="[path to]css/header.css">
     <div id="site-header"></div>          ← top nav (every page)
     <div id="project-nav"></div>          ← prev/next bar (project pages only, optional)
     <script src="[path to]js/header.js"></script>

   It figures out on its own whether it is running from the site root
   (index.html) or from inside /projects/, so links resolve correctly
   either way. Prev/next is derived from data/projects.json using the
   current page's filename as the slug — add a project to the JSON and
   the chain re-links itself.
   ────────────────────────────────────────────────────────────────── */

(function () {
  // Root-relative prefix: "" from the site root, "../" from /projects/.
  const inProjects = /\/projects\//.test(location.pathname);
  const ROOT = inProjects ? "../" : "";

  // ── Top nav (identical on every page) ──────────────────────────────
  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <nav class="site-nav">
        <a class="brand" href="${ROOT}index.html">
          <div class="brand-mark">JS</div>
          <span class="brand-name">Jimena Sánchez Curto</span>
        </a>
        <div class="nav-links">
          <a href="${ROOT}index.html#work">work_</a>
          <a href="${ROOT}index.html#about">about_</a>
          <a href="${ROOT}index.html#contact">contact_</a>
        </div>
      </nav>
    `;
  }

  // ── Prev/next bar (project pages only) ─────────────────────────────
  const pnEl = document.getElementById("project-nav");
  if (!pnEl) return;

  // Current slug = filename without extension, e.g. "01-congress".
  const slug = location.pathname
    .split("/")
    .pop()
    .replace(/\.html?$/i, "");

  fetch(`${ROOT}data/projects.json`)
    .then((res) => res.json())
    .then((projects) => {
      const i = projects.findIndex((p) => p.slug === slug);
      if (i === -1) return; // slug not in data — leave the bar empty
      const prev = projects[i - 1];
      const next = projects[i + 1];

      pnEl.innerHTML = `
        ${cell("prev", prev, ROOT)}
        ${cell("next", next, ROOT)}
      `;
    })
    .catch((err) => console.error("header.js: could not load projects.json", err));

  function cell(dir, project, root) {
    const label = dir === "prev" ? "← Previous" : "Next →";
    const cls = dir === "prev" ? "pn-prev" : "pn-next";
    if (!project) {
      return `<span class="pn-empty ${cls}"><span class="pn-dir">${label}</span></span>`;
    }
    return `
      <a class="${cls}" href="${root}projects/${escapeAttr(project.slug)}.html">
        <span class="pn-dir">${label}</span>
        <span class="pn-title">${escapeHtml(project.title)}</span>
      </a>
    `;
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str == null ? "" : str;
    return d.innerHTML;
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, "&quot;");
  }
})();
