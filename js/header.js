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
          <a href="${ROOT}index.html#work" data-section="work" data-i18n="nav.work">work_</a>
          <a href="${ROOT}index.html#about" data-section="about" data-i18n="nav.about">about_</a>
          <a href="${ROOT}index.html#contact" data-section="contact" data-i18n="nav.contact">contact_</a>
        </div>
        <div class="nav-progress" aria-hidden="true"></div>
      </nav>
    `;
    wireNav(header.querySelector(".site-nav"));
    // Lets js/i18n.js translate the nav it just injected.
    document.dispatchEvent(new CustomEvent("header:rendered"));
  }

  // ── Nav behaviour: condense on scroll, reading-progress hairline,
  //    and (on the home page) highlight the section in view. ─────────
  function wireNav(nav) {
    let ticking = false;
    function update() {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      const y = scrollY;
      nav.classList.toggle("is-condensed", y > 24);
      nav.style.setProperty("--progress", max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    }
    addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    addEventListener("resize", update, { passive: true });
    update();

    if (inProjects || !("IntersectionObserver" in window)) return;
    const links = nav.querySelectorAll("[data-section]");
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.dataset.section === e.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    // Sections are in the static HTML, so they exist by the time we run.
    links.forEach((a) => {
      const s = document.getElementById(a.dataset.section);
      if (s) spy.observe(s);
    });
  }

  // ── Prev/next bar (project pages only) ─────────────────────────────
  const pnEl = document.getElementById("project-nav");
  if (!pnEl) return;
  pnEl.classList.add("project-nav"); // styled by css/header.css

  // Current slug = filename without extension, e.g. "01-congress".
  const slug = location.pathname
    .split("/")
    .pop()
    .replace(/\.html?$/i, "");

  fetch(`${ROOT}data/projects.json`)
    .then((res) => res.json())
    .then((projects) => {
      const me = projects.find((p) => p.slug === slug);
      if (!me) return; // slug not in data — leave the bar empty

      // Home-page projects chain with each other; publications of a
      // topic chain only with the other publications of that topic.
      // A planned topic still has a page, so it stays in the chain.
      const chain = projects.filter((p) => (p.series || "") === (me.series || ""));
      const i = chain.indexOf(me);
      const parent = me.series && projects.find((p) => p.slug === me.series);

      pnEl.innerHTML = `
        ${cell("prev", chain[i - 1], ROOT)}
        ${parent ? upCell(parent, ROOT) : ""}
        ${cell("next", chain[i + 1], ROOT)}
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

  // Middle cell on an issue page: back up to its series.
  function upCell(series, root) {
    return `
      <a class="pn-up" href="${root}projects/${escapeAttr(series.slug)}.html">
        <span class="pn-dir">↑ All of this topic</span>
        <span class="pn-title">${escapeHtml(series.title)}</span>
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
