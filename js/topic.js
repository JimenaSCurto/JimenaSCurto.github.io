/* ──────────────────────────────────────────────────────────────────
   Topic engine — one page type for every recurrent publication.

   A topic page is a shell. Everything it shows comes from its own
   manifest at data/topics/<slug>.json, so the four topics share this
   code while each keeps its own scope, taxonomy and accent colour.

     <body class="topic-page" data-topic="01-congress">
       <div id="site-header"></div>
       <div id="topic"></div>
       <div id="project-nav"></div>

   The manifest declares LENSES — the axes a reader explores the topic
   along. Two kinds:

     kind:"facet"  group publications by the values of one facet
                   (party, painter, concept…). The facet's taxonomy is
                   rendered whether or not anything is published under
                   it yet, so the page is a navigable index of the
                   topic's structure from day one.
     kind:"kind"   a flat list of publications whose "kind" matches
                   (general findings, short notes…).

   A facet value may carry its own "color", and a lens may borrow one
   facet's colours for another via "accentFrom" — which is how deputies
   are tinted with the colour of the group they sit with.

   Publications live in the manifest's "publications" array:
     { slug, num, title, desc, status, kind, date,
       facets: { party: ["PSOE"], deputy: ["…"] } }
   A publication is linked only once projects/<slug>.html exists, so
   nothing on the page can lead to a 404.
   ────────────────────────────────────────────────────────────────── */

(function () {
  const mount = document.getElementById("topic");
  if (!mount) return;

  const slug =
    document.body.dataset.topic ||
    location.pathname.split("/").pop().replace(/\.html?$/i, "");

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let topic = null;
  let activeLens = null;
  let firstPaint = true;

  fetch(`../data/topics/${encodeURIComponent(slug)}.json`)
    .then((r) => {
      if (!r.ok) throw new Error(`no manifest for ${slug}`);
      return r.json();
    })
    .then((data) => {
      topic = data;
      if (topic.accent) document.body.style.setProperty("--accent", topic.accent);
      activeLens = (topic.lenses || [])[0] || null;
      render();
    })
    .catch((err) => {
      console.error("topic.js:", err);
      mount.innerHTML = `
        <div class="topic-wrap">
          <div class="tp-empty" style="margin-top:80px">
            <p>This topic has no manifest yet.</p>
            <div class="tp-empty-note">expected data/topics/${esc(slug)}.json</div>
          </div>
        </div>`;
    });

  /* ── Page ─────────────────────────────────────────────────────── */

  function render() {
    mount.innerHTML = `
      <div class="topic-wrap">
        ${masthead()}
        ${brief()}
        <section class="tp-lenses" data-tp-reveal>
          <div class="tp-lens-head">
            <h2>Ways in</h2>
            <span class="tp-rule"></span>
            <span class="tp-hint">${topic.lenses.length} lenses</span>
          </div>
          <div class="tp-lens-row" id="tp-lens-row">
            <span class="tp-lens-ink" aria-hidden="true"></span>
            ${topic.lenses.map(lensButton).join("")}
          </div>
          <div id="tp-lens-body"></div>
        </section>
      </div>`;

    wireLenses();
    renderLens();
    observeReveals();
  }

  function masthead() {
    const pubs = published().length;
    return `
      <header class="tp-masthead">
        <div class="tp-dateline" data-tp-reveal>
          <span>Topic</span>
          <span class="tp-dot"></span>
          <span>${topic.lenses.length} lenses</span>
          <span class="tp-dot"></span>
          <span>${String(pubs).padStart(2, "0")} publication${pubs === 1 ? "" : "s"}</span>
          <span class="tp-spacer"></span>
          <span>${esc(topic.slug)}</span>
        </div>
        <h1 class="tp-title" data-tp-reveal>${esc(topic.title)}</h1>
        ${topic.subtitle ? `<p class="tp-subtitle" data-tp-reveal>${esc(topic.subtitle)}</p>` : ""}
        ${topic.question ? `<p class="tp-question" data-tp-reveal>${topic.question}</p>` : ""}
        <!-- question is authored HTML (an <em> on a term); all reader-facing
             values elsewhere go through esc() -->
      </header>`;
  }

  function brief() {
    return `
      <section class="tp-brief">
        <div class="tp-scope" data-tp-reveal>
          ${(topic.scope || []).map((p) => `<p>${esc(p)}</p>`).join("")}
        </div>
        <aside data-tp-reveal>
          ${topic.method ? `
            <div class="tp-aside-head">Method</div>
            <ul class="tp-method">
              ${topic.method.map((m) => `<li><b>${esc(m.name)}</b><span>${esc(m.note)}</span></li>`).join("")}
            </ul>` : ""}
          ${topic.corpus ? `
            <div class="tp-aside-head">The corpus</div>
            <dl class="tp-corpus">
              ${topic.corpus.map((c) => `<div><dt>${esc(c.k)}</dt><dd>${esc(c.v)}</dd></div>`).join("")}
            </dl>` : ""}
        </aside>
      </section>`;
  }

  function lensButton(lens, i) {
    const on = i === 0 ? " is-on" : "";
    return `<button type="button" class="tp-lens-btn${on}" data-lens="${esc(lens.key)}"
              aria-pressed="${i === 0}">${esc(lens.label)}</button>`;
  }

  /* ── Lenses ───────────────────────────────────────────────────── */

  function wireLenses() {
    const row = document.getElementById("tp-lens-row");
    row.addEventListener("click", (e) => {
      const btn = e.target.closest(".tp-lens-btn");
      if (!btn || btn.classList.contains("is-on")) return;
      row.querySelectorAll(".tp-lens-btn").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", String(on));
      });
      activeLens = topic.lenses.find((l) => l.key === btn.dataset.lens);
      moveInk();
      renderLens();
    });
    requestAnimationFrame(moveInk);
    addEventListener("resize", moveInk, { passive: true });
    if (document.fonts) document.fonts.ready.then(moveInk);
  }

  function moveInk() {
    const row = document.getElementById("tp-lens-row");
    if (!row) return;
    const ink = row.querySelector(".tp-lens-ink");
    const btn = row.querySelector(".tp-lens-btn.is-on");
    if (!ink || !btn) return;
    ink.style.width = btn.offsetWidth + "px";
    ink.style.height = btn.offsetHeight + "px";
    ink.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
  }

  function renderLens() {
    const body = document.getElementById("tp-lens-body");
    if (!body || !activeLens) return;
    const paint = () => {
      body.innerHTML = `
        ${activeLens.blurb ? `<p class="tp-lens-blurb">${esc(activeLens.blurb)}</p>` : ""}
        ${activeLens.link ? `<a class="tp-lens-link" href="${esc(activeLens.link.href)}"
             target="_blank" rel="noopener">${esc(activeLens.link.label)} ↗</a>` : ""}
        ${activeLens.kind === "facet" ? facetGrid(activeLens) : flatList(activeLens)}`;
      linkAll(body);
    };
    // Cross-fade when the reader switches lens. Not on the first paint:
    // there is nothing to fade from, and starting a transition while the
    // page is still being built aborts it.
    if (firstPaint) { firstPaint = false; paint(); return; }
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(paint);
    else paint();
  }

  /* ── Facet lens: the taxonomy, with whatever is published under it ── */

  function facetGrid(lens) {
    const facet = (topic.facets || {})[lens.facet];
    if (!facet) return empty(lens, false);

    const order = facet.order && facet.order.length
      ? facet.order
      : Object.keys(facet.values || {});
    if (!order.length) return empty(lens, false);

    const cells = order.map((key) => {
      const v = (facet.values || {})[key] || { label: key };
      const pubs = published().filter((p) => valuesOf(p, lens.facet).includes(key));
      const swatch = accentFor(lens, facet, key, v);
      return `
        <div class="tp-facet ${pubs.length ? "has-pubs" : "is-empty"}" style="--swatch:${esc(swatch)}">
          <div class="tp-facet-label">${esc(v.label || key)}</div>
          ${v.full ? `<div class="tp-facet-full">${esc(v.full)}</div>` : ""}
          ${pubs.length ? `<ul class="tp-facet-pubs">${pubs.map(facetRow).join("")}</ul>` : ""}
          <div class="tp-facet-count">${pubs.length
            ? `${String(pubs.length).padStart(2, "0")} publication${pubs.length === 1 ? "" : "s"}`
            : "none yet"}</div>
        </div>`;
    }).join("");

    return `<div class="tp-facets">${cells}</div>${
      published().length ? "" : empty(lens, true)}`;
  }

  // A deputy borrows the colour of the group they sit with; anything
  // without a colour of its own falls back to the topic accent.
  function accentFor(lens, facet, key, value) {
    if (value.color) return value.color;
    if (lens.accentFrom) {
      const src = (topic.facets || {})[lens.accentFrom];
      const ref = value[lens.accentFrom];
      const hit = src && ref && (src.values || {})[ref];
      if (hit && hit.color) return hit.color;
    }
    return topic.accent || "#b8902a";
  }

  function facetRow(p) {
    return `<li data-pub="${esc(p.slug || "")}"><span>${esc(p.title)}</span></li>`;
  }

  /* ── Kind lens: a flat list ───────────────────────────────────── */

  function flatList(lens) {
    const pubs = published().filter((p) => !lens.match || p.kind === lens.match);
    if (!pubs.length) return empty(lens, false);
    return `<ol class="tp-list">${pubs.map(listRow).join("")}</ol>`;
  }

  function listRow(p, i) {
    return `
      <li data-pub="${esc(p.slug || "")}">
        <div class="tp-row">
          <span class="tp-row-num">${esc(p.num || String(i + 1).padStart(2, "0"))}</span>
          <span>
            <span class="tp-row-title">${esc(p.title)}</span>
            ${p.desc ? `<span class="tp-row-desc">${esc(p.desc)}</span>` : ""}
            <span class="tp-row-meta">${keysFor(p)}${p.date ? `<span>${esc(p.date)}</span>` : ""}</span>
          </span>
          <span class="tp-row-read">read <span class="tp-arrow">→</span></span>
        </div>
      </li>`;
  }

  // The facet values a publication carries, tinted with their own colours.
  function keysFor(p) {
    const out = [];
    Object.entries(topic.facets || {}).forEach(([name, facet]) => {
      valuesOf(p, name).forEach((key) => {
        const v = (facet.values || {})[key];
        if (!v) return;
        const colour = v.color || topic.accent;
        out.push(`<span class="tp-key" style="--swatch:${esc(colour)}">${esc(v.label || key)}</span>`);
      });
    });
    return out.join("");
  }

  // `indexed` says whether an index was just printed above this block,
  // so the note underneath can say something true either way.
  function empty(lens, indexed) {
    const note = indexed
      ? "the index above is live — it fills in as work lands"
      : "this lens fills in as work lands";
    return `
      <div class="tp-empty">
        <p>${esc(lens.empty || "Nothing published under this lens yet.")}</p>
        <div class="tp-empty-note">${note}</div>
      </div>`;
  }

  /* ── Helpers ──────────────────────────────────────────────────── */

  function published() {
    return (topic.publications || []).filter((p) => p.status !== "idea");
  }

  function valuesOf(pub, facetName) {
    const v = (pub.facets || {})[facetName];
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  }

  // Turn a publication row into a real link, but only once its page
  // exists — otherwise mark it forthcoming and leave it inert.
  const pageExists = new Map();
  function checkPage(pubSlug) {
    if (!pageExists.has(pubSlug)) {
      const url = `${encodeURIComponent(pubSlug)}.html`;
      pageExists.set(pubSlug, location.protocol === "file:"
        ? Promise.resolve(true)
        : fetch(url, { method: "HEAD" }).then((r) => r.ok).catch(() => false));
    }
    return pageExists.get(pubSlug);
  }

  function linkAll(scope) {
    scope.querySelectorAll("[data-pub]").forEach((li) => {
      const pubSlug = li.dataset.pub;
      if (!pubSlug) return markSoon(li);
      checkPage(pubSlug).then((ok) => {
        if (!ok) return markSoon(li);
        const a = document.createElement("a");
        a.href = `${encodeURIComponent(pubSlug)}.html`;
        const row = li.querySelector(".tp-row");
        if (row) {
          a.className = "tp-row";
          while (row.firstChild) a.appendChild(row.firstChild);
          row.replaceWith(a);
        } else {
          while (li.firstChild) a.appendChild(li.firstChild);
          li.appendChild(a);
        }
      });
    });
  }

  function markSoon(li) {
    li.classList.add("is-soon");
    const read = li.querySelector(".tp-row-read");
    if (read) read.textContent = "forthcoming";
  }

  function observeReveals() {
    const els = mount.querySelectorAll("[data-tp-reveal]");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    els.forEach((el, i) => el.style.setProperty("--d", `${Math.min(i, 4) * 0.07}s`));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });

    // Anything already on screen is revealed here and now. Observer
    // callbacks are throttled in a hidden or prerendering tab, and the
    // masthead sitting at opacity 0 is a worse failure than no animation.
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-in");
      else io.observe(el);
    });
  }

  function esc(s) {
    const d = document.createElement("div");
    d.textContent = s == null ? "" : s;
    return d.innerHTML;
  }
})();
