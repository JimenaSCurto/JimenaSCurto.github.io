/* ──────────────────────────────────────────────────────────────────
   Series index — the table of contents of a recurring publication.

   A series page (projects.json "type": "series") only needs:
     <link rel="stylesheet" href="../css/series.css">
     <div id="series-issues"></div>
     <script type="module" src="../js/orbs.js"></script>
     <script src="../js/series.js"></script>

   It lists every published issue whose "series" equals this page's
   slug (the filename), in projects.json order, newest last. Ideas are
   never listed. Issue pages don't need anything special: header.js
   already chains them to each other and links back up here.
   ────────────────────────────────────────────────────────────────── */

(function () {
  const el = document.getElementById("series-issues");
  if (!el) return;

  const slug = location.pathname.split("/").pop().replace(/\.html?$/i, "");
  const STATUSES = {
    "completed":   { label: "Completed",   orb: "solving",    color: "#b8902a" },
    "in-progress": { label: "In progress", orb: "connecting", color: "" },
  };

  el.classList.add("series-index");
  el.innerHTML = `<p class="si-empty">Loading issues…</p>`;

  fetch("../data/projects.json")
    .then((r) => r.json())
    .then((projects) => {
      const issues = projects.filter((p) => p.series === slug && p.status !== "idea");
      if (!issues.length) {
        el.innerHTML = `<p class="si-empty">The first issue is in preparation.</p>`;
        return;
      }
      el.innerHTML = `
        <div class="si-head">
          <span>No.</span><span>Issue</span><span class="si-count">${issues.length} issue${issues.length !== 1 ? "s" : ""}</span>
        </div>
        <ol class="si-list">${issues.map(row).join("")}</ol>
      `;
      // Only link issues whose page exists, so nothing leads to a 404.
      el.querySelectorAll(".si-row[data-slug]").forEach((li) => {
        const url = `${encodeURIComponent(li.dataset.slug)}.html`;
        const ok = location.protocol === "file:"
          ? Promise.resolve(true)
          : fetch(url, { method: "HEAD" }).then((r) => r.ok).catch(() => false);
        ok.then((yes) => {
          if (!yes) return li.classList.add("is-soon");
          const a = document.createElement("a");
          a.className = "si-link";
          a.href = url;
          while (li.firstChild) a.appendChild(li.firstChild);
          li.appendChild(a);
          li.classList.add("has-link");
        });
      });
    })
    .catch((err) => {
      console.error("series.js: could not load projects.json", err);
      el.innerHTML = "";
    });

  function row(p) {
    const st = STATUSES[p.status] || STATUSES.completed;
    const color = st.color ? ` color="${st.color}"` : "";
    return `
      <li class="si-row" ${p.slug ? `data-slug="${esc(p.slug)}"` : ""}>
        <span class="si-num">${esc(p.num)}</span>
        <span class="si-main">
          <span class="si-title">${esc(p.title)}</span>
          ${p.desc ? `<span class="si-desc">${esc(p.desc)}</span>` : ""}
          <span class="si-meta">
            <thinking-orb state="${st.orb}" size="20"${color} aria-hidden="true"></thinking-orb>
            ${st.label}${p.tags ? ` · ${esc(p.tags)}` : ""}
          </span>
        </span>
        <span class="si-read">read <span class="si-arrow">→</span></span>
      </li>`;
  }

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s == null ? "" : s;
    return d.innerHTML;
  }
})();
