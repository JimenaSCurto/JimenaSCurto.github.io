/* ──────────────────────────────────────────────────────────────────
   Project gallery: loads data/projects.json, renders cards,
   and wires up the category filter buttons.
   ────────────────────────────────────────────────────────────────── */

const CATEGORIES = [
  { key: "all", label: "All Works" },
  { key: "nlp-politics", label: "NLP · Politics" },
  { key: "nlp-literature", label: "NLP · Literature" },
  { key: "data-viz", label: "Data Viz" },
];

let allProjects = [];
let activeFilter = "all";

const filterRowEl = document.getElementById("filter-row");
const gridEl = document.getElementById("project-grid");
const countEl = document.getElementById("project-count");

function renderFilterRow() {
  filterRowEl.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn" + (cat.key === activeFilter ? " active" : "");
    btn.textContent = cat.label;
    btn.type = "button";
    btn.addEventListener("click", () => {
      activeFilter = cat.key;
      renderFilterRow();
      renderGrid();
    });
    filterRowEl.appendChild(btn);
  });
}

function renderGrid() {
  const filtered =
    activeFilter === "all"
      ? allProjects
      : allProjects.filter((p) => p.cat === activeFilter);

  countEl.textContent = `${filtered.length} project${filtered.length !== 1 ? "s" : ""}`;

  gridEl.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "gallery-empty";
    empty.textContent = "No projects in this category yet.";
    gridEl.appendChild(empty);
    return;
  }

  filtered.forEach((project) => {
    // Link the whole card to its own page when a slug exists;
    // fall back to a plain div for projects that don't have a page yet.
    const card = document.createElement(project.slug ? "a" : "div");
    card.className = "project-card";
    if (project.slug) {
      card.href = `projects/${encodeURIComponent(project.slug)}.html`;
    } else {
      card.tabIndex = 0;
    }

    card.innerHTML = `
      <div class="card-thumb">
        <img src="${project.img}" alt="${escapeHtml(project.alt || project.title)}" loading="lazy">
        <div class="card-thumb-fade"></div>
        <div class="card-cat-pill">${escapeHtml(project.catLabel)}</div>
      </div>
      <div class="card-body">
        <div class="card-num">${escapeHtml(project.num)}</div>
        <div class="card-title">${escapeHtml(project.title)}</div>
        <div class="card-desc">${escapeHtml(project.desc)}</div>
        <div class="card-footer">
          <span class="card-tags">${escapeHtml(project.tags)}</span>
          <span class="card-view">view →</span>
        </div>
      </div>
    `;

    gridEl.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function init() {
  try {
    const res = await fetch("data/projects.json");
    allProjects = await res.json();
  } catch (err) {
    console.error("Failed to load projects.json", err);
    allProjects = [];
  }
  renderFilterRow();
  renderGrid();
}

document.addEventListener("DOMContentLoaded", init);
