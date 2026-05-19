/**
 * ============================================================
 *  PORTFOLIO — MAIN SCRIPT
 *  All content is driven from data/content.js (CONTENT).
 * ============================================================
 */

/* ── Icons ── */
const ICONS = {
  github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  externalLink: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  dot: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>`,
  folder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  fileText: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  layers: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
};

/* ── Helpers ── */
const qs  = (s, c = document) => c.querySelector(s);
const qsa = (s, c = document) => [...c.querySelectorAll(s)];

function tagsHTML(tags = []) {
  return tags.map(t => `<span class="tag">${t}</span>`).join('');
}
function pillsHTML(items = [], cls = 'pill-skill') {
  return items.map(t => `<span class="${cls}">${t}</span>`).join('');
}
function formatDate(str) {
  if (!str) return '';
  const [y, m] = str.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[+m - 1]} ${y}`;
}

/* Build a flat lookup: id → title */
function buildProjectIndex() {
  const idx = {};
  (CONTENT.noteworthy || []).forEach(p => { idx[p.id] = p.title; });
  (CONTENT.collections || []).forEach(col => {
    (col.projects || []).forEach(p => { idx[p.id] = p.title; });
  });
  return idx;
}

/* ── COUNT-UP ANIMATION ── */
function animateCountUp(el, target) {
  const duration = 1200;
  const start = performance.now();
  const from = 0;
  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(from + (target - from) * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── NAV ── */
function initNav() {
  const nav = qs('#nav');
  const toggle = qs('.nav-toggle');
  const links  = qs('.nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    const sections = qsa('section[id]');
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    qsa('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.section === current));
  }, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  qsa('.nav-link').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

/* ── HERO ── */
function renderHero() {
  const h = CONTENT.hero;
  qs('.hero-name').innerHTML = h.name.replace(/(\S+)$/, '<em>$1</em>');
  qs('.hero-tagline').textContent = h.tagline;
  qs('.hero-description').textContent = h.description;

  // Links including CV download
  const linksHTML = h.links.map(l =>
    `<a href="${l.url}" class="hero-link" target="_blank" rel="noopener">${ICONS[l.icon] || ''}${l.label}</a>`
  ).join('');
  const cvLink = `<a href="cv.pdf" download class="hero-link hero-link-cv">${ICONS.download}Download CV</a>`;
  qs('.hero-links').innerHTML = linksHTML + cvLink;

  // Deduplicated project count — collect all unique IDs
  const uniqueIds = new Set();
  (CONTENT.noteworthy || []).forEach(p => uniqueIds.add(p.id));
  (CONTENT.collections || []).forEach(col => {
    (col.projects || []).forEach(p => uniqueIds.add(p.id));
  });
  const totalProjects = uniqueIds.size;
  const totalCollections = CONTENT.collections?.length || 0;

  const statProjects    = qs('#stat-projects');
  const statCollections = qs('#stat-collections');
  statProjects.textContent    = '0';
  statCollections.textContent = '0';

  // Count-up on scroll into view
  const statCard = qs('.hero-stat-card');
  if (statCard) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCountUp(statProjects, totalProjects);
        animateCountUp(statCollections, totalCollections);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(statCard);
  }

  // Render mini sparkline in hero visual
  renderHeroSparkline();
}

/* ── HERO SPARKLINE ── */
function renderHeroSparkline() {
  const container = qs('#hero-sparkline');
  if (!container) return;

  // Simulated monthly sentiment data from the Electoral Sentiment Mapping project
  const data = [32, 28, 35, 41, 38, 52, 48, 55, 63, 58, 72, 68, 75, 82, 78, 85, 71, 65, 88, 91];
  const w = 240, h = 60;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  container.innerHTML = `
    <svg viewBox="0 0 ${w} ${h}" class="hero-sparkline-svg" aria-hidden="true">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--green-500)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--green-500)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <polygon points="0,${h} ${points.join(' ')} ${w},${h}" fill="url(#sparkGrad)" class="sparkline-area"/>
      <polyline points="${points.join(' ')}" fill="none" stroke="var(--green-600)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sparkline-line"/>
    </svg>
    <div class="hero-sparkline-label">Sentiment index · 2023 Election</div>
  `;
}

/* ── NOTEWORTHY CAROUSEL ── */
function renderNoteworthy() {
  const track    = qs('#noteworthy-track');
  const prevBtn  = qs('#carousel-prev');
  const nextBtn  = qs('#carousel-next');
  const dotsEl   = qs('#carousel-dots');
  if (!track) return;

  const wrapper = qs('.carousel-wrapper');
  wrapper?.setAttribute('aria-roledescription', 'carousel');
  wrapper?.setAttribute('aria-label', 'Noteworthy projects');

  const cards = CONTENT.noteworthy;
  track.innerHTML = cards.map((p, i) => `
    <article class="noteworthy-card" data-id="${p.id}" tabindex="0" role="group" aria-roledescription="slide" aria-label="Slide ${i + 1} of ${cards.length}">
      <div class="noteworthy-card-accent"></div>
      <h3 class="noteworthy-card-title">${p.title}</h3>
      <p class="noteworthy-card-summary">${p.summary}</p>
      <div class="noteworthy-card-tags">${tagsHTML(p.tags)}</div>
      ${p.collectionId
        ? `<button class="noteworthy-card-link" data-open-collection="${p.collectionId}">See in collection ${ICONS.arrowRight}</button>`
        : p.link && p.link !== '#'
          ? `<a href="${p.link}" class="noteworthy-card-link" target="_blank" rel="noopener">View project ${ICONS.arrowRight}</a>`
          : ''}
    </article>
  `).join('');

  // Dots
  dotsEl.innerHTML = cards.map((_, i) =>
    `<button class="carousel-dot${i === 0 ? ' active' : ''}" aria-label="Slide ${i+1}"></button>`
  ).join('');

  let current = 0;

  function getCardWidth() {
    const firstCard = qs('.noteworthy-card', track);
    if (!firstCard) return 344;
    return firstCard.getBoundingClientRect().width + 24;
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, cards.length - 1));
    const cardW = getCardWidth();
    track.style.transform = `translateX(-${current * cardW}px)`;
    qsa('.carousel-dot', dotsEl).forEach((d, i) => d.classList.toggle('active', i === current));
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === cards.length - 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  qsa('.carousel-dot', dotsEl).forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Keyboard arrow-key support
  wrapper?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  // Drag to scroll
  let startX = 0, isDragging = false;
  const outer = qs('.carousel-track-outer');
  outer.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; });
  outer.addEventListener('mousemove', e => { if (!isDragging) return; });
  outer.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.clientX - startX;
    if (diff < -50) goTo(current + 1);
    else if (diff > 50) goTo(current - 1);
  });
  outer.addEventListener('mouseleave', () => { isDragging = false; });

  // Touch
  let touchStartX = 0;
  outer.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  outer.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff < -50) goTo(current + 1);
    else if (diff > 50) goTo(current - 1);
  });

  goTo(0);

  // Wire up "see in collection" buttons
  qsa('[data-open-collection]', track).forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openCollection(btn.dataset.openCollection); });
  });
}

/* ── TIMELINE ── */
function renderTimeline() {
  const container = qs('#timeline-track');
  if (!container) return;

  const events = [
    { year: '2021', label: 'IE University', detail: 'PPLE + DBA', type: 'education' },
    { year: '2023', label: 'First Research', detail: 'Electoral Sentiment Mapping', type: 'project' },
    { year: '2024', label: 'Gad3 Internship', detail: 'Data Consultant', type: 'work' },
    { year: '2025', label: 'Present', detail: '5th year · Consultant', type: 'current' },
  ];

  container.innerHTML = events.map(ev => `
    <div class="timeline-item ${ev.type === 'current' ? 'timeline-item-current' : ''}">
      <div class="timeline-dot"></div>
      <div class="timeline-year">${ev.year}</div>
      <div class="timeline-label">${ev.label}</div>
      <div class="timeline-detail">${ev.detail}</div>
    </div>
  `).join('');
}

/* ── COLLECTIONS ── */
const PALETTE_MAP = {
  green:  'col-palette-green',
  teal:   'col-palette-teal',
  sienna: 'col-palette-sienna',
  slate:  'col-palette-slate',
  indigo: 'col-palette-indigo',
  olive:  'col-palette-olive',
};

/* Collect all unique method tags across all collection projects */
function getAllMethodTags() {
  const tags = new Set();
  (CONTENT.collections || []).forEach(col => {
    (col.projects || []).forEach(p => {
      (p.tags || []).forEach(t => tags.add(t));
    });
  });
  return [...tags];
}

function renderCollections() {
  const grid = qs('#collections-grid');
  if (!grid) return;

  // Tag filter bar
  renderTagFilter();

  grid.innerHTML = CONTENT.collections.map(col => {
    const palette = PALETTE_MAP[col.palette] || 'col-palette-green';
    const allTags = [...new Set(col.projects.flatMap(p => p.tags))].slice(0, 3);
    const tagline = allTags.slice(0, 3).join(' · ');
    return `
      <article class="collection-card ${palette} fade-up" data-id="${col.id}" role="button" tabindex="0">
        <div class="collection-card-stripe"></div>
        <div class="collection-card-body">
          <h3 class="collection-card-title">${col.title}</h3>
          <div class="collection-card-count-pill">
            ${ICONS.folder.replace('svg', 'svg width="10" height="10"')}
            ${col.projects.length} project${col.projects.length !== 1 ? 's' : ''}
          </div>
          <div class="collection-card-tagline">${tagline}</div>
          <p class="collection-card-description">${col.description}</p>
          <div class="collection-card-footer">
            <div class="collection-card-topics">
              ${allTags.map(t => `<span class="collection-topic-tag">${t}</span>`).join('')}
            </div>
            <span class="collection-card-open">Open ${ICONS.arrowRight}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  qsa('.collection-card', grid).forEach(card => {
    card.addEventListener('click', () => openCollection(card.dataset.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openCollection(card.dataset.id); });
  });
}

/* ── TAG FILTER BAR ── */
function renderTagFilter() {
  const bar = qs('#tag-filter-bar');
  if (!bar) return;

  const allTags = getAllMethodTags();
  bar.innerHTML = `<button class="tag-filter-btn active" data-tag="all">All</button>` +
    allTags.map(t => `<button class="tag-filter-btn" data-tag="${t}">${t}</button>`).join('');

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.tag-filter-btn');
    if (!btn) return;
    qsa('.tag-filter-btn', bar).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterCollectionsByTag(btn.dataset.tag);
  });
}

function filterCollectionsByTag(tag) {
  const grid = qs('#collections-grid');
  if (!grid) return;

  qsa('.collection-card', grid).forEach(card => {
    if (tag === 'all') {
      card.style.display = '';
      return;
    }
    const colId = card.dataset.id;
    const col = CONTENT.collections.find(c => c.id === colId);
    if (!col) return;
    const hasTags = col.projects.some(p => (p.tags || []).includes(tag));
    card.style.display = hasTags ? '' : 'none';
  });
}

/* ── COLLECTION LIST MODAL ── */
let _collectionModalFocusTrap = null;

function openCollection(id) {
  const col = CONTENT.collections.find(c => c.id === id);
  if (!col) return;

  qs('#collection-modal-title').textContent       = col.title;
  qs('#collection-modal-label').textContent       = `Collection · ${col.projects.length} Projects`;
  qs('#collection-modal-description').textContent = col.description;

  const projList = qs('#collection-modal-projects');
  projList.innerHTML = col.projects.map(p => `
    <div class="modal-project-card" data-project-id="${p.id}" role="button" tabindex="0">
      <div class="modal-project-header">
        <h4 class="modal-project-title">${p.title}</h4>
        ${p.year ? `<span class="modal-project-year">${p.year}</span>` : ''}
      </div>
      ${p.subtitle ? `<p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.5rem;font-style:italic">${p.subtitle}</p>` : ''}
      <p class="modal-project-description">${p.description}</p>
      <div class="modal-project-tags">${tagsHTML(p.tags)}</div>
      <span class="modal-project-cta">Open project ${ICONS.arrowRight}</span>
    </div>
  `).join('');

  qsa('.modal-project-card', projList).forEach(card => {
    const open = () => {
      closeModal(qs('#collection-modal'));
      openProject(card.dataset.projectId);
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
  });

  const overlay = qs('#collection-modal');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  trapFocus(overlay);
}

/* ── FOCUS TRAP ── */
function trapFocus(modal) {
  const focusable = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"]), input, textarea, select');
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  function handler(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  modal._focusTrapHandler = handler;
  modal.addEventListener('keydown', handler);
  first.focus();
}

function releaseFocusTrap(modal) {
  if (modal._focusTrapHandler) {
    modal.removeEventListener('keydown', modal._focusTrapHandler);
    delete modal._focusTrapHandler;
  }
}

/* ── PROJECT DETAIL MODAL ── */
function getAllProjects() {
  const map = {};
  (CONTENT.collections || []).forEach(col => {
    (col.projects || []).forEach(p => { map[p.id] = p; });
  });
  return map;
}

function statusDotClass(status = '') {
  if (status === 'In Progress') return 'in-progress';
  if (status === 'Ongoing') return 'ongoing';
  return '';
}

function openProject(id) {
  const allProjects = getAllProjects();
  const p = allProjects[id];
  if (!p) return;

  const modal = qs('#project-modal');

  const tabs = [
    { id: 'home',    label: 'Overview'  },
    { id: 'article', label: 'Article',  hidden: !p.article },
    { id: 'details', label: 'Details'   },
  ].filter(t => !t.hidden);

  qs('#project-modal-tabs').innerHTML = tabs.map((t, i) =>
    `<button class="project-tab${i === 0 ? ' active' : ''}" data-tab="${t.id}">${t.label}</button>`
  ).join('');

  qs('#project-modal-panels').innerHTML = tabs.map((t, i) => {
    let content = '';
    if (t.id === 'home') {
      content = `
        <h2 class="project-home-title">${p.title}</h2>
        ${p.subtitle ? `<p class="project-home-subtitle">${p.subtitle}</p>` : ''}

        <div class="project-meta-row">
          ${p.year   ? `<div class="project-meta-item"><span class="project-meta-label">Year</span><span class="project-meta-value">${p.year}</span></div>` : ''}
          ${p.status ? `<div class="project-meta-item"><span class="project-meta-label">Status</span><span class="project-meta-value status-badge"><span class="status-dot ${statusDotClass(p.status)}"></span>${p.status}</span></div>` : ''}
        </div>

        ${(p.skills?.length) ? `
          <div class="project-pills-section">
            <div class="project-pills-label">Tools & Languages</div>
            <div class="project-pills-row">${pillsHTML(p.skills, 'pill-skill')}</div>
          </div>` : ''}

        ${(p.formats?.length) ? `
          <div class="project-pills-section">
            <div class="project-pills-label">Outputs & Formats</div>
            <div class="project-pills-row">${pillsHTML(p.formats, 'pill-format')}</div>
          </div>` : ''}

        <div class="project-divider"></div>
        <p class="project-description">${p.description}</p>

        ${(p.keyFindings?.length) ? `
          <div class="project-findings">
            <div class="project-findings-title">Key Findings</div>
            ${p.keyFindings.map(f => `
              <div class="project-finding">
                <span class="project-finding-icon">${ICONS.check}</span>
                <span>${f}</span>
              </div>`).join('')}
          </div>` : ''}

        <div class="project-divider"></div>
        ${p.githubUrl && p.githubUrl !== '#'
          ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="project-github-cta">${ICONS.github} View on GitHub</a>`
          : `<span style="font-size:0.82rem;color:var(--text-muted);font-style:italic">Repository not yet public.</span>`}
      `;
    } else if (t.id === 'article') {
      content = `<div class="project-article">${p.article}</div>`;
    } else if (t.id === 'details') {
      content = `
        <div class="project-details-grid">
          <div class="project-detail-block">
            <div class="project-detail-block-label">Tags</div>
            <div class="project-detail-block-content" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:0.5rem">${tagsHTML(p.tags)}</div>
          </div>
          <div class="project-detail-block">
            <div class="project-detail-block-label">Year</div>
            <div class="project-detail-block-content">${p.year || '—'}</div>
          </div>
          <div class="project-detail-block">
            <div class="project-detail-block-label">Status</div>
            <div class="project-detail-block-content">${p.status || '—'}</div>
          </div>
          <div class="project-detail-block">
            <div class="project-detail-block-label">Outputs</div>
            <div class="project-detail-block-content">${p.formats?.join(', ') || '—'}</div>
          </div>
          ${p.githubUrl && p.githubUrl !== '#' ? `
          <div class="project-detail-block" style="grid-column:1/-1">
            <div class="project-detail-block-label">Repository</div>
            <div class="project-detail-block-content">
              <a href="${p.githubUrl}" target="_blank" rel="noopener" style="color:var(--accent);font-weight:500">${p.githubUrl}</a>
            </div>
          </div>` : ''}
        </div>
      `;
    }
    return `<div class="project-tab-panel${i === 0 ? ' active' : ''}" data-panel="${t.id}">${content}</div>`;
  }).join('');

  qsa('.project-tab', modal).forEach(btn => {
    btn.addEventListener('click', () => {
      qsa('.project-tab', modal).forEach(b => b.classList.remove('active'));
      qsa('.project-tab-panel', modal).forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      qs(`[data-panel="${btn.dataset.tab}"]`, modal).classList.add('active');
    });
  });

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  trapFocus(modal);
}

/* ── MODALS ── */
function closeModal(overlay) {
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  releaseFocusTrap(overlay);
}

function initModals() {
  ['#collection-modal', '#project-modal', '#insight-modal'].forEach(sel => {
    const overlay = qs(sel);
    if (!overlay) return;
    overlay.querySelector('.modal-close')?.addEventListener('click', () => closeModal(overlay));
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal(qs('#project-modal'));
      closeModal(qs('#collection-modal'));
      closeModal(qs('#insight-modal'));
    }
  });
}

/* ── SKILLS ── */
function renderSkills() {
  const sidebar = qs('#skills-sidebar');
  const panels  = qs('#skills-panels');
  if (!sidebar || !panels) return;
  const projectIndex = buildProjectIndex();
  const allProjects = getAllProjects();

  CONTENT.skills.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = `skills-category-btn${i === 0 ? ' active' : ''}`;
    btn.dataset.idx = i;
    btn.textContent = cat.category;
    sidebar.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = `skills-panel${i === 0 ? ' active' : ''}`;
    panel.dataset.idx = i;

    cat.items.forEach(skill => {
      const wrapper = document.createElement('div');

      const hasProjects = skill.projectIds.length > 0;
      const isInProgress = !hasProjects;

      const item = document.createElement('div');
      item.className = 'skills-item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-expanded', 'false');
      item.innerHTML = `
        <span class="skill-name">${skill.name}</span>
        <span class="skill-item-right">
          ${isInProgress
            ? `<span class="skill-in-progress">In progress</span>`
            : `<span class="skill-count">${skill.projectIds.length} project${skill.projectIds.length !== 1 ? 's' : ''}</span>`}
          ${hasProjects ? `<span class="skill-chevron">${ICONS.chevronDown}</span>` : ''}
        </span>
      `;

      const list = document.createElement('div');
      list.className = 'skill-projects-list';
      skill.projectIds.forEach(pid => {
        const pill = document.createElement('div');
        pill.className = 'skill-project-pill';
        pill.setAttribute('role', 'button');
        pill.setAttribute('tabindex', '0');
        pill.innerHTML = `${ICONS.dot} ${projectIndex[pid] || pid}`;
        // Click opens project detail
        const openProj = () => openProject(pid);
        pill.addEventListener('click', openProj);
        pill.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openProj(); });
        list.appendChild(pill);
      });

      const toggle = () => {
        if (!hasProjects) return;
        const isOpen = list.classList.toggle('open');
        item.setAttribute('aria-expanded', isOpen);
      };
      item.addEventListener('click', toggle);
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggle(); });

      wrapper.appendChild(item);
      wrapper.appendChild(list);
      panel.appendChild(wrapper);
    });

    panels.appendChild(panel);
  });

  sidebar.addEventListener('click', e => {
    const btn = e.target.closest('.skills-category-btn');
    if (!btn) return;
    qsa('.skills-category-btn', sidebar).forEach(b => b.classList.remove('active'));
    qsa('.skills-panel', panels).forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    qs(`.skills-panel[data-idx="${btn.dataset.idx}"]`, panels).classList.add('active');
  });
}

/* ── INSIGHTS ── */
function renderInsights() {
  const grid = qs('#insights-grid');
  if (!grid) return;

  grid.innerHTML = CONTENT.insights.map(ins => `
    <article class="insight-card fade-up" data-id="${ins.id}" role="button" tabindex="0">
      <div class="insight-card-header">
        <span class="insight-category">${ins.category}</span>
        <span class="insight-meta">${formatDate(ins.date)}<span class="insight-meta-sep">·</span>${ins.readTime}</span>
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
  qs('#insight-modal-category').textContent = ins.category;
  qs('#insight-modal-meta').textContent     = `${formatDate(ins.date)} · ${ins.readTime} read`;
  qs('#insight-modal-title').textContent    = ins.title;

  // Reading progress bar + body
  qs('#insight-modal-body').innerHTML = ins.body;

  const modal = qs('#insight-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  trapFocus(modal);

  // Reading progress
  const progressBar = qs('#insight-progress-bar');
  const scrollable  = qs('#insight-modal-body');
  if (progressBar && scrollable) {
    progressBar.style.width = '0%';
    scrollable.addEventListener('scroll', function onScroll() {
      const scrollTop = scrollable.scrollTop;
      const scrollHeight = scrollable.scrollHeight - scrollable.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(pct, 100)}%`;
    });
  }
}

/* ── FOOTER ── */
function renderFooter() {
  const socialContainer = qs('#footer-social');
  if (!socialContainer || !CONTENT.hero?.links) return;

  socialContainer.innerHTML = CONTENT.hero.links.map(l =>
    `<a href="${l.url}" class="footer-social-link" target="_blank" rel="noopener" aria-label="${l.label}">${ICONS[l.icon] || ''}</a>`
  ).join('');
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.08 });
  qsa('.collections-grid .fade-up, .insights-grid .fade-up').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
  qsa('.fade-up:not([style])').forEach(el => observer.observe(el));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderHero();
  renderTimeline();
  renderNoteworthy();
  renderCollections();
  renderSkills();
  renderInsights();
  renderFooter();
  initModals();
  initNav();
  qs('#footer-year').textContent = new Date().getFullYear();
  requestAnimationFrame(() => requestAnimationFrame(initScrollReveal));
});
