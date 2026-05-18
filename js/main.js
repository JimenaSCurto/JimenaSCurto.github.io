/**
 * ============================================================
 *  PORTFOLIO — MAIN SCRIPT
 *  Reads CONTENT from data/content.js and builds the UI.
 *  Never edit this file to change content — use data/content.js
 * ============================================================
 */

/* ── Icons (inline SVG strings) ─────────────────────────── */
const ICONS = {
  github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  externalLink: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  folder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  dot: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
};

/* ── Helpers ─────────────────────────────────────────────── */
function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}
function tagsHTML(tags) {
  return tags.map(t => `<span class="tag">${t}</span>`).join('');
}
function formatDate(str) {
  const [y, m] = str.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[+m - 1]} ${y}`;
}
// Build a lookup of all project titles by id (noteworthy + collection projects)
function buildProjectIndex() {
  const idx = {};
  (CONTENT.noteworthy || []).forEach(p => { idx[p.id] = p.title; });
  (CONTENT.collections || []).forEach(col => {
    (col.projects || []).forEach(p => { idx[p.id] = p.title; });
  });
  return idx;
}

/* ── Navigation ──────────────────────────────────────────── */
function initNav() {
  const nav = qs('#nav');
  const toggle = qs('.nav-toggle');
  const links = qs('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    // Active link highlighting
    const sections = qsa('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    qsa('.nav-link').forEach(a => {
      a.classList.toggle('active', a.dataset.section === current);
    });
  });

  toggle?.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close menu on link click
  qsa('.nav-link').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

/* ── Hero ────────────────────────────────────────────────── */
function renderHero() {
  const h = CONTENT.hero;
  qs('.hero-name').innerHTML =
    h.name.replace(/(\S+)$/, '<em>$1</em>');
  qs('.hero-tagline').textContent = h.tagline;
  qs('.hero-description').textContent = h.description;

  const linksEl = qs('.hero-links');
  linksEl.innerHTML = h.links.map(l => `
    <a href="${l.url}" class="hero-link" target="_blank" rel="noopener">
      ${ICONS[l.icon] || ''} ${l.label}
    </a>
  `).join('');

  // Stats card counts
  qs('#stat-projects').textContent =
    (CONTENT.noteworthy?.length || 0) +
    (CONTENT.collections?.reduce((a, c) => a + (c.projects?.length || 0), 0) || 0);
  qs('#stat-collections').textContent = CONTENT.collections?.length || 0;
}

/* ── Noteworthy ──────────────────────────────────────────── */
function renderNoteworthy() {
  const grid = qs('#noteworthy-grid');
  if (!grid) return;
  grid.innerHTML = CONTENT.noteworthy.map(p => `
    <article class="noteworthy-card fade-up" data-id="${p.id}">
      <div class="noteworthy-card-accent"></div>
      <h3 class="noteworthy-card-title">${p.title}</h3>
      <p class="noteworthy-card-summary">${p.summary}</p>
      <div class="noteworthy-card-tags">${tagsHTML(p.tags)}</div>
      ${p.link && p.link !== '#'
        ? `<a href="${p.link}" class="noteworthy-card-link" target="_blank" rel="noopener">
             View project ${ICONS.arrowRight}
           </a>`
        : p.collectionId
          ? `<button class="noteworthy-card-link" data-open-collection="${p.collectionId}">
               See in collection ${ICONS.arrowRight}
             </button>`
          : ''}
    </article>
  `).join('');

  // Wire up "see in collection" buttons
  qsa('[data-open-collection]', grid).forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openCollection(btn.dataset.openCollection);
    });
  });
}

/* ── Collections ─────────────────────────────────────────── */
function renderCollections() {
  const grid = qs('#collections-grid');
  if (!grid) return;
  grid.innerHTML = CONTENT.collections.map(col => {
    const allTags = [...new Set(col.projects.flatMap(p => p.tags))].slice(0, 3);
    return `
      <article class="collection-card fade-up" data-id="${col.id}" role="button" tabindex="0">
        <div class="collection-card-header">
          <div class="collection-card-stripe"></div>
          <div class="collection-card-count">${col.projects.length} project${col.projects.length !== 1 ? 's' : ''}</div>
          <h3 class="collection-card-title">${col.title}</h3>
          <p class="collection-card-description">${col.description}</p>
        </div>
        <div class="collection-card-footer">
          <div class="collection-card-topics">${tagsHTML(allTags)}</div>
          <span class="collection-card-open">Open ${ICONS.arrowRight}</span>
        </div>
      </article>
    `;
  }).join('');

  qsa('.collection-card', grid).forEach(card => {
    card.addEventListener('click', () => openCollection(card.dataset.id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openCollection(card.dataset.id);
    });
  });
}

/* ── Collection Modal ────────────────────────────────────── */
function openCollection(id) {
  const col = CONTENT.collections.find(c => c.id === id);
  if (!col) return;
  const overlay = qs('#collection-modal');
  qs('#collection-modal-title', overlay).textContent = col.title;
  qs('#collection-modal-label', overlay).textContent = `Collection · ${col.projects.length} Projects`;
  qs('#collection-modal-description', overlay).textContent = col.description;

  const projList = qs('#collection-modal-projects', overlay);
  projList.innerHTML = col.projects.map(p => `
    <div class="modal-project-card">
      <div class="modal-project-header">
        <h4 class="modal-project-title">${p.title}</h4>
        ${p.year ? `<span class="modal-project-year">${p.year}</span>` : ''}
      </div>
      <p class="modal-project-description">${p.description}</p>
      <div class="modal-project-tags">${tagsHTML(p.tags)}</div>
      ${p.link && p.link !== '#'
        ? `<a href="${p.link}" class="modal-project-link" target="_blank" rel="noopener">
             View project ${ICONS.externalLink}
           </a>`
        : ''}
    </div>
  `).join('');

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(overlay) {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function initModals() {
  // Collection modal
  const colOverlay = qs('#collection-modal');
  qs('#collection-modal-close', colOverlay)?.addEventListener('click', () => closeModal(colOverlay));
  colOverlay?.addEventListener('click', e => { if (e.target === colOverlay) closeModal(colOverlay); });

  // Insight modal
  const insOverlay = qs('#insight-modal');
  qs('#insight-modal-close', insOverlay)?.addEventListener('click', () => closeModal(insOverlay));
  insOverlay?.addEventListener('click', e => { if (e.target === insOverlay) closeModal(insOverlay); });

  // ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal(colOverlay);
      closeModal(insOverlay);
    }
  });
}

/* ── Skills ──────────────────────────────────────────────── */
function renderSkills() {
  const sidebar = qs('#skills-sidebar');
  const panels  = qs('#skills-panels');
  if (!sidebar || !panels) return;

  const projectIndex = buildProjectIndex();

  CONTENT.skills.forEach((cat, i) => {
    // Sidebar button
    const btn = el('button', `skills-category-btn${i === 0 ? ' active' : ''}`, cat.category);
    btn.dataset.idx = i;
    sidebar.appendChild(btn);

    // Panel
    const panel = el('div', `skills-panel${i === 0 ? ' active' : ''}`);
    panel.dataset.idx = i;

    cat.items.forEach(skill => {
      const item = el('div', 'skills-item');
      item.innerHTML = `
        <span class="skill-name">${skill.name}</span>
        <span class="skill-count">${skill.projectIds.length} project${skill.projectIds.length !== 1 ? 's' : ''}</span>
      `;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');

      const projectsList = el('div', 'skill-projects-list');
      if (skill.projectIds.length > 0) {
        skill.projectIds.forEach(pid => {
          const title = projectIndex[pid] || pid;
          const pill = el('div', 'skill-project-pill', `${ICONS.dot} ${title}`);
          projectsList.appendChild(pill);
        });
      } else {
        const pill = el('div', 'skill-project-pill');
        pill.textContent = 'No projects yet';
        projectsList.appendChild(pill);
      }

      const wrapper = el('div');
      wrapper.appendChild(item);
      wrapper.appendChild(projectsList);
      panel.appendChild(wrapper);

      const toggle = () => {
        if (skill.projectIds.length === 0) return;
        projectsList.classList.toggle('open');
      };
      item.addEventListener('click', toggle);
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggle(); });
    });

    panels.appendChild(panel);
  });

  // Tab switching
  sidebar.addEventListener('click', e => {
    const btn = e.target.closest('.skills-category-btn');
    if (!btn) return;
    qsa('.skills-category-btn', sidebar).forEach(b => b.classList.remove('active'));
    qsa('.skills-panel', panels).forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    qs(`.skills-panel[data-idx="${btn.dataset.idx}"]`, panels).classList.add('active');
  });
}

/* ── Insights ────────────────────────────────────────────── */
function renderInsights() {
  const grid = qs('#insights-grid');
  if (!grid) return;
  grid.innerHTML = CONTENT.insights.map(ins => `
    <article class="insight-card fade-up" data-id="${ins.id}" role="button" tabindex="0">
      <div class="insight-card-header">
        <span class="insight-category">${ins.category}</span>
        <span class="insight-meta">
          ${formatDate(ins.date)}
          <span class="insight-meta-sep">·</span>
          ${ins.readTime}
        </span>
      </div>
      <div class="insight-card-body">
        <h3 class="insight-title">${ins.title}</h3>
        <p class="insight-summary">${ins.summary}</p>
        <span class="insight-read">Read ${ICONS.arrowRight}</span>
      </div>
    </article>
  `).join('');

  qsa('.insight-card', grid).forEach(card => {
    const open = () => openInsight(card.dataset.id);
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });
}

function openInsight(id) {
  const ins = CONTENT.insights.find(i => i.id === id);
  if (!ins) return;
  const overlay = qs('#insight-modal');
  qs('#insight-modal-category', overlay).textContent = ins.category;
  qs('#insight-modal-meta', overlay).textContent = `${formatDate(ins.date)} · ${ins.readTime} read`;
  qs('#insight-modal-title', overlay).textContent = ins.title;
  qs('#insight-modal-body', overlay).innerHTML = ins.body;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ── Scroll animations ───────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  // Add stagger delay to grid children
  qsa('.noteworthy-grid .fade-up, .collections-grid .fade-up, .insights-grid .fade-up').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });

  // Also observe any other fade-up elements
  qsa('.fade-up:not([style*="transition-delay"])').forEach(el => observer.observe(el));
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderHero();
  renderNoteworthy();
  renderCollections();
  renderSkills();
  renderInsights();
  initModals();
  initNav();
  // Defer scroll reveal until after render
  requestAnimationFrame(() => {
    requestAnimationFrame(initScrollReveal);
  });
});
