/* ──────────────────────────────────────────────────────────────────
   Project gallery: loads data/projects.json, renders cards,
   and wires up the category filter buttons.

   Status axis (projects.json → "status"):
     · completed    → "solving" orb
     · in-progress  → "connecting" orb
     · idea         → "breathing" orb, shown as PLANNED
   A project with no status counts as completed. Status is a label,
   not a gate: what decides whether a card is a link is whether its
   page exists. A project with no page reads "forthcoming" and stays
   inert, so a planned topic can be on the page from the day it is an
   idea without anything leading to a 404.

   Type axis (projects.json → "type" + "series"):
     · article  → a STANDALONE ARTICLE. One publication, one page.
                  Square card.
     · series   → a TOPIC (recurrent publication): a bank of
                  publications, each worth its own page. Its card
                  opens the topic page, which is driven by
                  data/topics/<slug>.json (js/topic.js). Wide card.
     · a project whose "series" names a topic slug is a PUBLICATION of
       that topic. It never appears on the home page.

   ("series" is the historical key for what the site now calls a
   topic. The data keeps the old name so the admin and every saved
   projects.json keep working; only the wording changed.)

   Resilient to half-finished entries in projects.json:
     · a missing/broken cover image  → a typographic cover (never a "?")
     · a slug whose page isn't built → card shows "forthcoming", no dead link
   ────────────────────────────────────────────────────────────────── */

// The filter row is built from the categories actually present in
// projects.json, so adding a category is a data change, not a code
// change. This only fixes the order they appear in.
const CATEGORY_ORDER = ["nlp-politics", "nlp-literature", "nlp-art", "simulation", "data-viz"];
const ALL_WORKS = { key: "all", label: "All Works" };
let categories = [ALL_WORKS];

// Orb states come from thinking-orbs (see js/orbs.js).
const STATUSES = {
  "completed":   { label: "Completed",   orb: "solving",    color: "#c9a45c" },
  "in-progress": { label: "In progress", orb: "connecting", color: "" },
  "idea":        { label: "Planned",     orb: "breathing",  color: "#9d9384" },
};

let allProjects = [];   // every published project, issues included
let topLevel = [];      // what the home page shows: articles + series
let activeFilter = "all";
let activeStatus = null; // null = every published status
const pageExists = new Map(); // slug → Promise<boolean>

const filterRowEl = document.getElementById("filter-row");
const gridEl = document.getElementById("project-grid");
const seriesGridEl = document.getElementById("series-grid");
const countEl = document.getElementById("project-count");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

function renderFilterRow() {
  filterRowEl.innerHTML = '<span class="filter-indicator" aria-hidden="true"></span>';
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (cat.key === activeFilter ? " active" : "");
    btn.textContent = cat.label;
    btn.type = "button";
    btn.setAttribute("aria-pressed", cat.key === activeFilter);
    btn.addEventListener("click", () => {
      if (activeFilter === cat.key) return;
      activeFilter = cat.key;
      filterRowEl.querySelectorAll(".filter-btn").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on);
      });
      moveIndicator();
      transitionGrid();
    });
    filterRowEl.appendChild(btn);
  });
  // Status legend — doubles as a status filter.
  const legend = document.createElement("div");
  legend.className = "status-legend";
  legend.setAttribute("role", "group");
  legend.setAttribute("aria-label", "Filter by status");
  Object.keys(STATUSES).forEach((key) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "status-key";
    b.dataset.status = key;
    // Rebuilt on a language change too, so it has to reflect the filter
    // that is already on rather than assuming a fresh page.
    const on = key === activeStatus;
    b.setAttribute("aria-pressed", String(on));
    b.classList.toggle("is-dim", !!activeStatus && !on);
    b.innerHTML = `${orbTag(key, 20)}<span>${statusLabel(key)}</span>`;
    b.addEventListener("click", () => {
      activeStatus = activeStatus === key ? null : key;
      legend.querySelectorAll(".status-key").forEach((k) => {
        const on = k.dataset.status === activeStatus;
        k.setAttribute("aria-pressed", on);
        k.classList.toggle("is-dim", !!activeStatus && !on);
      });
      transitionGrid();
    });
    legend.appendChild(b);
  });
  filterRowEl.parentElement.querySelector(".status-legend")?.remove();
  filterRowEl.insertAdjacentElement("afterend", legend);

  requestAnimationFrame(moveIndicator);
}

function transitionGrid() {
  // Cross-fade the grid reflow where the browser supports it.
  if (document.startViewTransition && !reduceMotion) {
    document.startViewTransition(() => renderGrid(false));
  } else {
    renderGrid(false);
  }
}

function statusLabel(key) {
  return galleryText("gallery.status." + key, STATUSES[key].label);
}

function orbTag(key, size) {
  const s = STATUSES[key];
  const color = s.color ? ` color="${s.color}"` : "";
  return `<thinking-orb state="${s.orb}" size="${size}"${color} label="${statusLabel(key)}" aria-hidden="true"></thinking-orb>`;
}

function statusOf(project) {
  return STATUSES[project.status] ? project.status : "completed";
}

// Slide the ink pill under the active filter button.
function moveIndicator() {
  const ind = filterRowEl.querySelector(".filter-indicator");
  const btn = filterRowEl.querySelector(".filter-btn.active");
  if (!ind || !btn) return;
  ind.style.width = btn.offsetWidth + "px";
  ind.style.height = btn.offsetHeight + "px";
  ind.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
}
addEventListener("resize", moveIndicator, { passive: true });
if (document.fonts) document.fonts.ready.then(moveIndicator);

function renderGrid(animateIn = true) {
  const filtered = topLevel.filter((p) =>
    (activeFilter === "all" || p.cat === activeFilter) &&
    (!activeStatus || statusOf(p) === activeStatus)
  );
  const articles = filtered.filter((p) => p.type !== "series");
  const series = filtered.filter((p) => p.type === "series");

  countEl.textContent = filtered.length + " " + galleryText(
    filtered.length === 1 ? "gallery.project" : "gallery.projects",
    filtered.length === 1 ? "project" : "projects"
  );
  fillGroup(gridEl, articles, animateIn, filtered.length === 0);
  fillGroup(seriesGridEl, series, animateIn, false);

  // Let home.js observe freshly rendered cards for the scroll reveal.
  document.dispatchEvent(new CustomEvent("gallery:rendered"));
}

// Render one group; hide its heading when it has nothing to show.
function fillGroup(el, projects, animateIn, showEmpty) {
  const group = el.closest(".work-group");
  el.innerHTML = "";
  group.hidden = projects.length === 0 && !showEmpty;
  group.querySelector(".group-count").textContent = projects.length ? String(projects.length).padStart(2, "0") : "";
  if (showEmpty) {
    const empty = document.createElement("div");
    empty.className = "gallery-empty";
    empty.textContent = galleryText("gallery.empty", "No projects here yet.");
    el.appendChild(empty);
    return;
  }
  projects.forEach((project, i) => el.appendChild(buildCard(project, i, animateIn)));
}

function buildCard(project, i, animateIn) {
  const status = statusOf(project);
  const isSeries = project.type === "series";
  // Every card starts as a plain block; it becomes a link only once
  // we know its page exists, so nobody ever lands on a 404.
  const card = document.createElement("div");
  card.className = `project-card status-${status}${isSeries ? " is-series" : ""}`;
  card.style.viewTransitionName = "card-" + (project.slug || i);
  if (animateIn) {
    card.setAttribute("data-reveal", "");
    card.style.setProperty("--d", `${(i % 3) * 0.08}s`);
  }

  let seriesMeta = "";
  if (isSeries) {
    const meta = topicMeta.get(project.slug);
    // Until the manifest has loaded, fall back to any publications
    // declared in projects.json itself.
    const count = meta ? meta.count
      : allProjects.filter((p) => p.series === project.slug && p.status !== "idea").length;
    const latest = meta ? meta.latest : null;
    seriesMeta = `
      <div class="series-meta">
        <span>
          <b>${String(count).padStart(2, "0")}</b> publication${count !== 1 ? "s" : ""}${
            meta && meta.lenses ? ` · <b>${meta.lenses}</b> ways in` : ""}
        </span>
        ${latest
          ? `<span class="series-latest">Latest — <em>${escapeHtml(latest.title)}</em></span>`
          : `<span class="series-latest">Scope and index are live; the first publication is forthcoming</span>`}
      </div>`;
  }

  card.innerHTML = `
    <div class="card-thumb">
      <div class="card-thumb-fade"></div>
      <div class="card-cat-pill">${escapeHtml(project.catLabel)}</div>
    </div>
    <div class="card-seal" title="${statusLabel(status)}">${orbTag(status, 64)}</div>
    <div class="card-body">
      <div class="card-kicker">${isSeries ? "Topic · recurrent publication" : "Standalone article"}</div>
      <div class="card-num">${escapeHtml(project.num)}<span class="card-status">${statusLabel(status)}</span></div>
      <div class="card-title">${escapeHtml(project.title)}</div>
      <div class="card-desc">${escapeHtml(project.desc)}</div>
      ${seriesMeta}
      <div class="card-footer">
        <span class="card-tags">${escapeHtml(project.tags)}</span>
        <span class="card-view">${isSeries ? "enter the topic" : "read"} <span class="arrow">→</span></span>
      </div>
    </div>
  `;

  setCover(card.querySelector(".card-thumb"), project);
  linkIfPageExists(card, project);
  return card;
}

// Cover image, or a typographic stand-in if there is none / it fails.
function setCover(thumb, project) {
  const src = (project.img || "").trim();
  // "placeholder.webp" is the old blank stand-in — treat it as "no cover yet".
  const usable = src && !src.endsWith("/") && !/placeholder\.webp$/.test(src);
  if (!usable) {
    thumb.prepend(fallbackCover(project));
    return;
  }
  const img = new Image();
  img.alt = project.alt || project.title || "";
  img.loading = "lazy";
  img.decoding = "async";
  img.addEventListener("load", () => img.classList.add("is-loaded"));
  img.addEventListener("error", () => img.replaceWith(fallbackCover(project)));
  img.src = src;
  thumb.prepend(img);
}

function fallbackCover(project) {
  const el = document.createElement("div");
  el.className = "card-cover-fallback";
  el.setAttribute("role", "img");
  el.setAttribute("aria-label", "Cover forthcoming");
  el.innerHTML = `
    <span class="cf-note">Plate forthcoming</span>
    <span class="cf-num">${escapeHtml(project.num || "")}</span>
  `;
  return el;
}

function checkPage(slug) {
  if (!pageExists.has(slug)) {
    const url = `projects/${encodeURIComponent(slug)}.html`;
    const p = location.protocol === "file:"
      ? Promise.resolve(true) // can't probe local files; assume it's there
      : fetch(url, { method: "HEAD" }).then((r) => r.ok).catch(() => false);
    pageExists.set(slug, p);
  }
  return pageExists.get(slug);
}

function linkIfPageExists(card, project) {
  const markSoon = () => {
    card.classList.add("is-soon");
    card.querySelector(".card-view").textContent = galleryText("gallery.forthcoming", "forthcoming");
  };
  if (!project.slug) return markSoon();

  checkPage(project.slug).then((ok) => {
    if (!ok) return markSoon();
    // Swap the div for a real <a> so it is a proper, keyboard-reachable link.
    const a = document.createElement("a");
    a.className = card.className;
    a.href = `projects/${encodeURIComponent(project.slug)}.html`;
    for (const attr of card.attributes) {
      if (attr.name !== "class") a.setAttribute(attr.name, attr.value);
    }
    while (card.firstChild) a.appendChild(card.firstChild);
    wireTilt(a);
    card.replaceWith(a);
    document.dispatchEvent(new CustomEvent("gallery:rendered"));
  });
}

// Gentle 3-D tilt + a light that follows the pointer (fine pointers only).
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
function wireTilt(card) {
  if (!finePointer || reduceMotion) return;
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    card.style.setProperty("--ry", `${(x - 0.5) * 5}deg`);
    card.style.setProperty("--rx", `${(0.5 - y) * 5}deg`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

async function init() {
  try {
    const res = await fetch("data/projects.json");
    allProjects = await res.json();
    // Publications of a topic live on the topic page, not here.
    topLevel = allProjects.filter((p) => !p.series);
  } catch (err) {
    console.error("Failed to load projects.json", err);
    allProjects = [];
    topLevel = [];
  }
  categories = buildCategories(topLevel);
  setEditionCount();
  renderFilterRow();
  renderGrid();
  // Topic cards show how many publications the topic holds; that count
  // lives in the topic's own manifest, so fetch those and fill it in
  // afterwards rather than blocking the grid on them.
  loadTopicCounts();
}

// Only offer a filter for categories that actually have work in them.
function buildCategories(projects) {
  const seen = new Map();
  projects.forEach((p) => {
    if (p.cat && !seen.has(p.cat)) seen.set(p.cat, p.catLabel || p.cat);
  });
  const known = CATEGORY_ORDER.filter((k) => seen.has(k));
  const rest = [...seen.keys()].filter((k) => !CATEGORY_ORDER.includes(k));
  return [ALL_WORKS, ...[...known, ...rest].map((k) => ({ key: k, label: seen.get(k) }))];
}

// slug → { count, latest } from data/topics/<slug>.json.
const topicMeta = new Map();
function loadTopicCounts() {
  const topics = topLevel.filter((p) => p.type === "series" && p.slug);
  return Promise.all(topics.map((t) =>
    fetch(`data/topics/${encodeURIComponent(t.slug)}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (!m) return;
        const pubs = (m.publications || []).filter((p) => p.status !== "idea");
        topicMeta.set(t.slug, {
          count: pubs.length,
          latest: pubs[pubs.length - 1] || null,
          lenses: (m.lenses || []).length,
        });
      })
      .catch(() => {})
  )).then(() => {
    if (topicMeta.size) renderGrid(false);
  });
}

// Category labels come from projects.json and stay as written there;
// only the strings this file generates itself are translated.
// Named in full on purpose: this file shares the global scope with the
// vendored orbs engine, which leaks a one-letter `t` of its own.
function galleryText(key, fallback) {
  return window.i18n ? window.i18n.t(key, fallback) : fallback;
}

function setEditionCount() {
  const edCount = document.getElementById("ed-count");
  if (edCount) edCount.textContent = topLevel.length + " " + galleryText("gallery.works", "works");
}

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("i18n:changed", () => {
  if (!topLevel.length) return;
  setEditionCount();
  // The status legend is built once at init, so it needs rebuilding too —
  // otherwise the cards translate and the legend above them does not.
  renderFilterRow();
  renderGrid(false);
});
