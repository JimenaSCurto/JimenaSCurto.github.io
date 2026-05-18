/* ============================================================
   Portfolio Content Editor — Main Script
   ============================================================ */

const API = '';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const BLOCK_TYPES = [
  'heading', 'paragraph', 'quote', 'bulletList', 'numberedList',
  'callout', 'metric', 'image', 'divider', 'note', 'warning',
  'subtitle', 'imageGrid', 'timeline', 'comparison', 'linkList',
  'customHtmlSafeBlock'
];
const PALETTES = ['green', 'teal', 'sienna', 'slate', 'indigo', 'olive'];
const STATUSES = ['Complete', 'In Progress', 'Ongoing'];

let state = {
  activeType: 'projects',
  activeItem: null,
  activeFilename: null,
  items: { projects: [], collections: [], insights: [] },
  hero: null,
  skills: null,
  manifest: null,
  dirty: false,
};

// ── API helpers ──
async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(API + path, opts);
  return res.json();
}

async function loadAll() {
  const [projects, collections, insights, hero, skills, manifest] = await Promise.all([
    api('GET', '/api/content/projects'),
    api('GET', '/api/content/collections'),
    api('GET', '/api/content/insights'),
    api('GET', '/api/hero'),
    api('GET', '/api/skills'),
    api('GET', '/api/manifest'),
  ]);
  state.items.projects = projects;
  state.items.collections = collections;
  state.items.insights = insights;
  state.hero = hero;
  state.skills = skills;
  state.manifest = manifest;
  updateCounts();
  renderItemList();
}

function updateCounts() {
  $('#count-projects').textContent = state.items.projects.length;
  $('#count-collections').textContent = state.items.collections.length;
  $('#count-insights').textContent = state.items.insights.length;
}

// ── Sidebar navigation ──
$$('.sidebar-section-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.sidebar-section-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeType = btn.dataset.type;
    state.activeItem = null;
    state.activeFilename = null;

    if (['hero', 'skills', 'manifest'].includes(state.activeType)) {
      $('#item-list').innerHTML = '';
      hideAllPanels();
      showSpecialPanel(state.activeType);
    } else {
      renderItemList();
      hideAllPanels();
      $('#empty-state').classList.remove('hidden');
    }
  });
});

function hideAllPanels() {
  $('#empty-state').classList.add('hidden');
  $('#editor-panel').classList.add('hidden');
  $('#hero-panel').classList.add('hidden');
  $('#skills-panel').classList.add('hidden');
  $('#manifest-panel').classList.add('hidden');
}

function renderItemList() {
  const list = $('#item-list');
  const type = state.activeType;
  if (!['projects', 'collections', 'insights'].includes(type)) { list.innerHTML = ''; return; }

  const items = state.items[type];
  const search = $('#search-input').value.toLowerCase();
  const filtered = items.filter(i => {
    const title = (i.title || i.id || '').toLowerCase();
    return !search || title.includes(search);
  });

  list.innerHTML = filtered.map(item => {
    const isActive = state.activeFilename === item.filename;
    const statusClass = item.status === 'Complete' ? 'status-complete' : item.status === 'In Progress' ? 'status-in-progress' : 'status-draft';
    return `<div class="sidebar-item${isActive ? ' active' : ''}" data-filename="${item.filename}">
      <span>${item.title || item.id || item.filename}</span>
      ${item.status ? `<span class="sidebar-item-status ${statusClass}"></span>` : ''}
    </div>`;
  }).join('');

  list.querySelectorAll('.sidebar-item').forEach(el => {
    el.addEventListener('click', () => openItem(el.dataset.filename));
  });
}

$('#search-input').addEventListener('input', renderItemList);

async function openItem(filename) {
  const type = state.activeType;
  state.activeFilename = filename;
  const data = await api('GET', `/api/content/${type}/${filename}`);
  state.activeItem = data;
  state.dirty = false;
  renderItemList();
  hideAllPanels();
  renderEditor(type, data, filename);
}

// ── New item ──
$('#btn-new').addEventListener('click', () => {
  const type = state.activeType;
  if (!['projects', 'collections', 'insights'].includes(type)) return;

  const templates = {
    projects: { type: 'project', id: '', slug: '', title: '', subtitle: '', summary: '', description: '', date: '', status: 'Complete', featured: false, tags: [], skills: [], formats: [], githubUrl: '', link: '#', keyFindings: [], blocks: [], relatedCollection: '' },
    collections: { type: 'collection', id: '', slug: '', title: '', description: '', palette: 'green', includedProjects: [], ordering: 1 },
    insights: { type: 'insight', id: '', slug: '', title: '', category: '', date: '', readTime: '', summary: '', blocks: [], relatedProjects: [] },
  };

  state.activeItem = templates[type];
  state.activeFilename = null;
  state.dirty = true;
  hideAllPanels();
  renderEditor(type, state.activeItem, null);
});

// ── Editor rendering ──
function renderEditor(type, data, filename) {
  const panel = $('#editor-panel');
  panel.classList.remove('hidden');

  const badges = { projects: 'badge-project', collections: 'badge-collection', insights: 'badge-insight' };
  const labels = { projects: 'PROJECT', collections: 'COLLECTION', insights: 'INSIGHT' };
  $('#editor-type-badge').className = `editor-type-badge ${badges[type]}`;
  $('#editor-type-badge').textContent = labels[type];
  $('#editor-title').textContent = data.title || 'New Item';

  // Reset tabs
  $$('.editor-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'metadata'));
  $$('.editor-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === 'metadata'));

  renderMetadataFields(type, data);
  renderBlocksEditor(data);
  clearValidation();
}

function renderMetadataFields(type, data) {
  const container = $('#metadata-fields');
  let html = '';

  if (type === 'projects') {
    html = `
      <div class="form-section">
        <div class="form-section-title">Core Information</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">ID</label>
            <input class="form-input" data-field="id" value="${esc(data.id)}" placeholder="e.g. my-project-name" />
            <div class="form-hint">Unique identifier (used for references)</div>
          </div>
          <div class="form-group">
            <label class="form-label">Slug</label>
            <input class="form-input" data-field="slug" value="${esc(data.slug)}" placeholder="url-friendly-name" />
            <div class="form-hint">Also used as filename</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Title</label>
          <input class="form-input" data-field="title" value="${esc(data.title)}" placeholder="Project Title" />
        </div>
        <div class="form-group">
          <label class="form-label">Subtitle</label>
          <input class="form-input" data-field="subtitle" value="${esc(data.subtitle)}" placeholder="One-line descriptive subtitle" />
        </div>
        <div class="form-group">
          <label class="form-label">Summary</label>
          <textarea class="form-textarea" data-field="summary" rows="2" placeholder="Brief summary for cards">${esc(data.summary)}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" data-field="description" rows="3" placeholder="Full project description">${esc(data.description)}</textarea>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Details</div>
        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Date / Year</label>
            <input class="form-input" data-field="date" value="${esc(data.date)}" placeholder="2024" />
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-select" data-field="status">
              ${STATUSES.map(s => `<option value="${s}"${data.status === s ? ' selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Featured</label>
            <div class="form-checkbox-row" style="margin-top:0.5rem">
              <input type="checkbox" data-field="featured" ${data.featured ? 'checked' : ''} />
              <span style="font-size:0.82rem">Show in Noteworthy</span>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">GitHub URL</label>
            <input class="form-input" data-field="githubUrl" value="${esc(data.githubUrl)}" placeholder="https://github.com/..." />
          </div>
          <div class="form-group">
            <label class="form-label">Related Collection</label>
            <select class="form-select" data-field="relatedCollection">
              <option value="">— None —</option>
              ${state.items.collections.map(c => `<option value="${c.id}"${data.relatedCollection === c.id ? ' selected' : ''}>${c.title} (${c.id})</option>`).join('')}
            </select>
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Tags & Skills</div>
        <div class="form-group">
          <label class="form-label">Tags</label>
          <div class="form-tags-input" id="tags-input" data-field="tags">${renderTags(data.tags)}<input type="text" placeholder="Type and press Enter" /></div>
        </div>
        <div class="form-group">
          <label class="form-label">Skills / Tools</label>
          <div class="form-tags-input" id="skills-input" data-field="skills">${renderTags(data.skills)}<input type="text" placeholder="Type and press Enter" /></div>
        </div>
        <div class="form-group">
          <label class="form-label">Output Formats</label>
          <div class="form-tags-input" id="formats-input" data-field="formats">${renderTags(data.formats)}<input type="text" placeholder="Type and press Enter" /></div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Key Findings</div>
        <div id="key-findings-list">
          ${(data.keyFindings || []).map((f, i) => `
            <div class="form-group" style="display:flex;gap:0.5rem;align-items:start">
              <textarea class="form-textarea" data-array="keyFindings" data-index="${i}" rows="1" style="min-height:36px">${esc(f)}</textarea>
              <button class="btn btn-danger btn-sm" onclick="removeArrayItem('keyFindings',${i})">x</button>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-outline btn-sm" onclick="addArrayItem('keyFindings')">+ Add Finding</button>
      </div>`;
  } else if (type === 'collections') {
    html = `
      <div class="form-section">
        <div class="form-section-title">Collection Information</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">ID</label>
            <input class="form-input" data-field="id" value="${esc(data.id)}" placeholder="col-my-collection" />
          </div>
          <div class="form-group">
            <label class="form-label">Slug</label>
            <input class="form-input" data-field="slug" value="${esc(data.slug)}" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Title</label>
          <input class="form-input" data-field="title" value="${esc(data.title)}" />
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" data-field="description" rows="3">${esc(data.description)}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Palette</label>
            <select class="form-select" data-field="palette">
              ${PALETTES.map(p => `<option value="${p}"${data.palette === p ? ' selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Ordering</label>
            <input class="form-input" data-field="ordering" type="number" value="${data.ordering || 1}" />
          </div>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Included Projects</div>
        <div class="form-group">
          <div class="form-tags-input" id="included-projects-input" data-field="includedProjects">
            ${renderTags(data.includedProjects)}<input type="text" placeholder="Type project ID and Enter" />
          </div>
          <div class="form-hint">Available: ${state.items.projects.map(p => p.id).join(', ')}</div>
        </div>
      </div>`;
  } else if (type === 'insights') {
    html = `
      <div class="form-section">
        <div class="form-section-title">Insight Information</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">ID</label>
            <input class="form-input" data-field="id" value="${esc(data.id)}" />
          </div>
          <div class="form-group">
            <label class="form-label">Slug</label>
            <input class="form-input" data-field="slug" value="${esc(data.slug)}" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Title</label>
          <input class="form-input" data-field="title" value="${esc(data.title)}" />
        </div>
        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Category</label>
            <input class="form-input" data-field="category" value="${esc(data.category)}" placeholder="e.g. Methodology" />
          </div>
          <div class="form-group">
            <label class="form-label">Date</label>
            <input class="form-input" data-field="date" value="${esc(data.date)}" placeholder="2024-03" />
          </div>
          <div class="form-group">
            <label class="form-label">Read Time</label>
            <input class="form-input" data-field="readTime" value="${esc(data.readTime)}" placeholder="5 min" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Summary</label>
          <textarea class="form-textarea" data-field="summary" rows="2">${esc(data.summary)}</textarea>
        </div>
      </div>
      <div class="form-section">
        <div class="form-section-title">Related Projects</div>
        <div class="form-group">
          <div class="form-tags-input" id="related-projects-input" data-field="relatedProjects">
            ${renderTags(data.relatedProjects)}<input type="text" placeholder="Type project ID and Enter" />
          </div>
          <div class="form-hint">Available: ${state.items.projects.map(p => p.id).join(', ')}</div>
        </div>
      </div>`;
  }

  container.innerHTML = html;
  initTagInputs(container);
}

function esc(str) { return (str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function unesc(str) { const el = document.createElement('div'); el.innerHTML = str; return el.textContent; }

function renderTags(arr) {
  return (arr || []).map(t => `<span class="form-tag">${esc(t)}<span class="form-tag-remove" data-value="${esc(t)}">&times;</span></span>`).join('');
}

function initTagInputs(container) {
  container.querySelectorAll('.form-tags-input').forEach(wrapper => {
    const input = wrapper.querySelector('input');
    wrapper.addEventListener('click', () => input.focus());

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && input.value.trim()) {
        e.preventDefault();
        const val = input.value.trim();
        const tag = document.createElement('span');
        tag.className = 'form-tag';
        tag.innerHTML = `${esc(val)}<span class="form-tag-remove" data-value="${esc(val)}">&times;</span>`;
        wrapper.insertBefore(tag, input);
        input.value = '';
        state.dirty = true;
      }
      if (e.key === 'Backspace' && !input.value) {
        const tags = wrapper.querySelectorAll('.form-tag');
        if (tags.length) { tags[tags.length - 1].remove(); state.dirty = true; }
      }
    });

    wrapper.addEventListener('click', e => {
      if (e.target.classList.contains('form-tag-remove')) {
        e.target.parentElement.remove();
        state.dirty = true;
      }
    });
  });
}

function getTagValues(selector) {
  const wrapper = document.querySelector(selector);
  if (!wrapper) return [];
  return [...wrapper.querySelectorAll('.form-tag')].map(tag => {
    return tag.querySelector('.form-tag-remove').dataset.value;
  });
}

// ── Blocks editor ──
function renderBlocksEditor(data) {
  const container = $('#blocks-editor');
  const hasBlocks = ['projects', 'insights'].includes(state.activeType);

  if (!hasBlocks) {
    container.innerHTML = '<p style="color:var(--ed-text-muted);font-size:0.9rem">This content type does not use content blocks.</p>';
    return;
  }

  const blocks = data.blocks || [];
  container.innerHTML = `
    <div class="blocks-header">
      <h3>Content Blocks (${blocks.length})</h3>
    </div>
    <div class="block-list" id="block-list">
      ${blocks.map((block, i) => renderBlockItem(block, i)).join('')}
    </div>
    <div class="add-block-bar">
      ${BLOCK_TYPES.map(t => `<button class="add-block-btn" data-block-type="${t}">+ ${t}</button>`).join('')}
    </div>
  `;

  container.querySelectorAll('.add-block-btn').forEach(btn => {
    btn.addEventListener('click', () => addBlock(btn.dataset.blockType));
  });

  initBlockDragDrop();
  initBlockActions();
}

function renderBlockItem(block, index) {
  const collapsed = block._collapsed ? ' collapsed' : '';
  const collapseIcon = block._collapsed ? '+' : '-';

  let bodyHTML = '';
  switch (block.type) {
    case 'heading':
      bodyHTML = `
        <div class="block-field-row">
          <span class="block-field-label">Level</span>
          <select data-block="${index}" data-bfield="level" style="width:60px;padding:0.3rem;border:1px solid var(--ed-border);border-radius:4px;font-size:0.82rem">
            <option value="2"${block.level == 2 ? ' selected' : ''}>H2</option>
            <option value="3"${block.level == 3 ? ' selected' : ''}>H3</option>
            <option value="4"${block.level == 4 ? ' selected' : ''}>H4</option>
          </select>
        </div>
        <input data-block="${index}" data-bfield="text" value="${esc(block.text || '')}" placeholder="Heading text" />`;
      break;
    case 'paragraph':
    case 'subtitle':
    case 'note':
    case 'warning':
    case 'callout':
      bodyHTML = `<textarea data-block="${index}" data-bfield="text" rows="3">${esc(block.text || '')}</textarea>`;
      if (block.type === 'callout') bodyHTML += `<div class="block-field-row" style="margin-top:0.5rem"><span class="block-field-label">Variant</span><input data-block="${index}" data-bfield="variant" value="${esc(block.variant || '')}" placeholder="info, tip, warning" style="width:120px" /></div>`;
      break;
    case 'quote':
      bodyHTML = `<textarea data-block="${index}" data-bfield="text" rows="2" placeholder="Quote text">${esc(block.text || '')}</textarea>
        <div class="block-field-row" style="margin-top:0.5rem"><span class="block-field-label">Attribution</span><input data-block="${index}" data-bfield="attribution" value="${esc(block.attribution || '')}" /></div>`;
      break;
    case 'bulletList':
    case 'numberedList':
      bodyHTML = `<textarea data-block="${index}" data-bfield="items" rows="4" placeholder="One item per line">${(block.items || []).join('\n')}</textarea>
        <div class="form-hint">One item per line</div>`;
      break;
    case 'metric':
      bodyHTML = `<div class="block-field-row"><span class="block-field-label">Value</span><input data-block="${index}" data-bfield="value" value="${esc(block.value || '')}" /></div>
        <div class="block-field-row"><span class="block-field-label">Label</span><input data-block="${index}" data-bfield="label" value="${esc(block.label || '')}" /></div>`;
      break;
    case 'image':
      bodyHTML = `<div class="block-field-row"><span class="block-field-label">Source</span><input data-block="${index}" data-bfield="src" value="${esc(block.src || '')}" placeholder="images/photo.jpg" /></div>
        <div class="block-field-row"><span class="block-field-label">Alt text</span><input data-block="${index}" data-bfield="alt" value="${esc(block.alt || '')}" /></div>
        <div class="block-field-row"><span class="block-field-label">Caption</span><input data-block="${index}" data-bfield="caption" value="${esc(block.caption || '')}" /></div>`;
      break;
    case 'divider':
      bodyHTML = '<p style="color:var(--ed-text-muted);font-size:0.8rem">Horizontal divider — no options</p>';
      break;
    case 'customHtmlSafeBlock':
      bodyHTML = `<textarea data-block="${index}" data-bfield="html" rows="4" placeholder="Safe HTML content">${esc(block.html || '')}</textarea>`;
      break;
    default:
      bodyHTML = `<textarea data-block="${index}" data-bfield="text" rows="3">${esc(block.text || '')}</textarea>`;
  }

  return `<div class="block-item" data-block-index="${index}" draggable="true">
    <div class="block-item-header">
      <span class="block-drag-handle">&#x2630;</span>
      <span class="block-type-label">${block.type}${block.level ? ' (h' + block.level + ')' : ''}</span>
      <div class="block-actions">
        <button class="block-action-btn" data-action="collapse" data-index="${index}" title="Collapse">${collapseIcon}</button>
        <button class="block-action-btn" data-action="duplicate" data-index="${index}" title="Duplicate">&#x2398;</button>
        <button class="block-action-btn" data-action="moveUp" data-index="${index}" title="Move up">&uarr;</button>
        <button class="block-action-btn" data-action="moveDown" data-index="${index}" title="Move down">&darr;</button>
        <button class="block-action-btn delete" data-action="delete" data-index="${index}" title="Delete">&times;</button>
      </div>
    </div>
    <div class="block-item-body${collapsed}">${bodyHTML}</div>
  </div>`;
}

function addBlock(type) {
  const blocks = state.activeItem.blocks || [];
  const newBlock = { type };
  if (type === 'heading') { newBlock.level = 2; newBlock.text = ''; }
  else if (type === 'bulletList' || type === 'numberedList') { newBlock.items = []; }
  else if (type === 'metric') { newBlock.value = ''; newBlock.label = ''; }
  else if (type === 'image') { newBlock.src = ''; newBlock.alt = ''; }
  else if (type === 'divider') { /* no fields */ }
  else if (type === 'customHtmlSafeBlock') { newBlock.html = ''; }
  else { newBlock.text = ''; }
  blocks.push(newBlock);
  state.activeItem.blocks = blocks;
  state.dirty = true;
  renderBlocksEditor(state.activeItem);
}

function initBlockActions() {
  $$('.block-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const idx = parseInt(btn.dataset.index);
      const blocks = state.activeItem.blocks;

      if (action === 'delete') {
        blocks.splice(idx, 1);
      } else if (action === 'duplicate') {
        blocks.splice(idx + 1, 0, JSON.parse(JSON.stringify(blocks[idx])));
      } else if (action === 'moveUp' && idx > 0) {
        [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]];
      } else if (action === 'moveDown' && idx < blocks.length - 1) {
        [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]];
      } else if (action === 'collapse') {
        blocks[idx]._collapsed = !blocks[idx]._collapsed;
      }

      state.dirty = true;
      renderBlocksEditor(state.activeItem);
    });
  });
}

function initBlockDragDrop() {
  const list = $('#block-list');
  if (!list) return;
  let dragIdx = null;

  list.querySelectorAll('.block-item').forEach(item => {
    item.addEventListener('dragstart', e => {
      dragIdx = parseInt(item.dataset.blockIndex);
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', () => { item.classList.remove('dragging'); });
    item.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
    item.addEventListener('drop', e => {
      e.preventDefault();
      const dropIdx = parseInt(item.dataset.blockIndex);
      if (dragIdx === null || dragIdx === dropIdx) return;
      const blocks = state.activeItem.blocks;
      const [moved] = blocks.splice(dragIdx, 1);
      blocks.splice(dropIdx, 0, moved);
      state.dirty = true;
      renderBlocksEditor(state.activeItem);
    });
  });
}

// ── Collect form data ──
function collectFormData() {
  const data = { ...state.activeItem };
  const type = state.activeType;

  // Scalar fields
  $$('#metadata-fields [data-field]').forEach(el => {
    const field = el.dataset.field;
    if (el.type === 'checkbox') {
      data[field] = el.checked;
    } else if (el.type === 'number') {
      data[field] = parseInt(el.value, 10) || 0;
    } else if (el.tagName === 'SELECT') {
      data[field] = el.value;
    } else {
      data[field] = el.value;
    }
  });

  // Tag fields
  if (type === 'projects') {
    data.tags = getTagValues('#tags-input');
    data.skills = getTagValues('#skills-input');
    data.formats = getTagValues('#formats-input');
  }
  if (type === 'collections') {
    data.includedProjects = getTagValues('#included-projects-input');
  }
  if (type === 'insights') {
    data.relatedProjects = getTagValues('#related-projects-input');
  }

  // Array items (keyFindings)
  if (type === 'projects') {
    const findings = [];
    $$('#metadata-fields [data-array="keyFindings"]').forEach(el => {
      if (el.value.trim()) findings.push(el.value.trim());
    });
    data.keyFindings = findings;
  }

  // Blocks
  if (data.blocks) {
    $$('#blocks-editor [data-block]').forEach(el => {
      const idx = parseInt(el.dataset.block);
      const field = el.dataset.bfield;
      if (!data.blocks[idx]) return;
      if (field === 'items') {
        data.blocks[idx].items = el.value.split('\n').filter(l => l.trim());
      } else if (field === 'level') {
        data.blocks[idx].level = parseInt(el.value, 10);
      } else {
        data.blocks[idx][field] = el.value;
      }
    });
    data.blocks = data.blocks.map(b => {
      const clean = { ...b };
      delete clean._collapsed;
      return clean;
    });
  }

  return data;
}

// ── Validation ──
function validate(data) {
  const errors = [];
  const warnings = [];
  const type = state.activeType;

  if (!data.id) errors.push('ID is required');
  if (!data.title && type !== 'collections') errors.push('Title is required');
  if (type === 'collections' && !data.title) errors.push('Title is required');
  if (!data.slug && type !== 'collections') warnings.push('Slug is empty — filename will be derived from ID');

  if (type === 'projects') {
    if (!data.summary) warnings.push('Summary is empty (used on cards)');
    if (!data.description) warnings.push('Description is empty');
  }

  if (type === 'insights') {
    if (data.date && !/^\d{4}(-\d{2})?$/.test(data.date)) errors.push('Date format must be YYYY or YYYY-MM');
    if (!data.blocks || data.blocks.length === 0) warnings.push('No content blocks defined');
  }

  return { errors, warnings, valid: errors.length === 0 };
}

function showValidation(result) {
  const el = $('#validation-summary');
  if (!result.errors.length && !result.warnings.length) {
    el.classList.add('hidden');
    return;
  }

  el.classList.remove('hidden');
  el.className = `validation-summary ${result.errors.length ? 'has-errors' : 'has-warnings'}`;
  el.innerHTML = [
    ...result.errors.map(e => `<div class="validation-item"><span class="validation-icon">&#x2717;</span> ${e}</div>`),
    ...result.warnings.map(w => `<div class="validation-item"><span class="validation-icon">&#x26A0;</span> ${w}</div>`),
  ].join('');
}

function clearValidation() {
  $('#validation-summary').classList.add('hidden');
}

// ── Save ──
$('#btn-save').addEventListener('click', async () => {
  const data = collectFormData();
  const result = validate(data);
  showValidation(result);
  if (!result.valid) return;

  const type = state.activeType;
  const filename = state.activeFilename || `${data.slug || data.id}.json`;
  await api('PUT', `/api/content/${type}/${filename}`, data);

  state.activeFilename = filename;
  state.activeItem = data;
  state.dirty = false;
  await loadAll();
  renderItemList();
  $('#editor-title').textContent = data.title || data.id;
  showBanner('Saved successfully', 'success');
});

// ── Delete ──
$('#btn-delete').addEventListener('click', async () => {
  if (!state.activeFilename) return;
  if (!confirm('Delete this item permanently?')) return;
  await api('DELETE', `/api/content/${state.activeType}/${state.activeFilename}`);
  state.activeItem = null;
  state.activeFilename = null;
  await loadAll();
  hideAllPanels();
  $('#empty-state').classList.remove('hidden');
});

// ── Array item helpers (key findings) ──
window.addArrayItem = function(field) {
  if (!state.activeItem[field]) state.activeItem[field] = [];
  state.activeItem[field].push('');
  renderMetadataFields(state.activeType, collectFormData());
};
window.removeArrayItem = function(field, idx) {
  const data = collectFormData();
  data[field].splice(idx, 1);
  state.activeItem = data;
  renderMetadataFields(state.activeType, data);
};

// ── Preview ──
$('#btn-preview').addEventListener('click', () => {
  $$('.editor-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === 'preview'));
  $$('.editor-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === 'preview'));
  renderPreview();
});

$$('.editor-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.editor-tab').forEach(t => t.classList.remove('active'));
    $$('.editor-tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    $(`[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    if (tab.dataset.tab === 'preview') renderPreview();
  });
});

$$('.preview-mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.preview-mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    $('#preview-frame').classList.toggle('mobile', btn.dataset.mode === 'mobile');
  });
});

function renderPreview() {
  const data = collectFormData();
  const frame = $('#preview-frame');

  let html = '';
  if (state.activeType === 'projects') {
    html = `
      <h2 style="margin-top:0;border-top:none;padding-top:0">${esc(data.title)}</h2>
      ${data.subtitle ? `<p style="font-style:italic;color:var(--ed-text-muted)">${esc(data.subtitle)}</p>` : ''}
      <p>${esc(data.description)}</p>
      ${data.keyFindings?.length ? `<h3>Key Findings</h3><ul>${data.keyFindings.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
      <hr />
      ${blocksToPreviewHTML(data.blocks)}`;
  } else if (state.activeType === 'insights') {
    html = `
      <p style="font-size:0.75rem;color:var(--ed-accent);text-transform:uppercase;letter-spacing:0.1em">${esc(data.category)}</p>
      <h2 style="margin-top:0.5rem;border-top:none;padding-top:0">${esc(data.title)}</h2>
      <p style="font-size:0.8rem;color:var(--ed-text-muted)">${esc(data.date)} &middot; ${esc(data.readTime)}</p>
      <hr />
      ${blocksToPreviewHTML(data.blocks)}`;
  } else if (state.activeType === 'collections') {
    html = `
      <h2 style="margin-top:0;border-top:none;padding-top:0">${esc(data.title)}</h2>
      <p>${esc(data.description)}</p>
      <p style="font-size:0.82rem;color:var(--ed-text-muted)">Palette: ${data.palette} | Projects: ${(data.includedProjects || []).join(', ') || 'none'}</p>`;
  }

  frame.innerHTML = html;
}

function blocksToPreviewHTML(blocks) {
  if (!blocks || !blocks.length) return '<p style="color:#999;font-style:italic">No content blocks</p>';
  return blocks.map(b => {
    switch (b.type) {
      case 'heading': return `<h${b.level || 2}>${b.text || ''}</h${b.level || 2}>`;
      case 'subtitle': return `<p style="font-size:1.1rem;font-weight:500;color:var(--ed-text)">${b.text || ''}</p>`;
      case 'paragraph': return `<p>${b.text || ''}</p>`;
      case 'quote': return `<blockquote>${b.text || ''}${b.attribution ? `<cite> — ${b.attribution}</cite>` : ''}</blockquote>`;
      case 'bulletList': return `<ul>${(b.items || []).map(i => `<li>${i}</li>`).join('')}</ul>`;
      case 'numberedList': return `<ol>${(b.items || []).map(i => `<li>${i}</li>`).join('')}</ol>`;
      case 'callout': return `<div class="block-callout">${b.text || ''}</div>`;
      case 'note': return `<div class="block-note">${b.text || ''}</div>`;
      case 'warning': return `<div class="block-warning">${b.text || ''}</div>`;
      case 'metric': return `<div class="block-metric"><span class="metric-value">${b.value || ''}</span><span class="metric-label">${b.label || ''}</span></div>`;
      case 'image': return `<figure class="block-image">${b.src ? `<img src="${b.src}" alt="${b.alt || ''}" style="max-width:100%;border-radius:4px" />` : '<div style="padding:2rem;background:#f0f0f0;text-align:center;border-radius:4px;color:#999">Image: ' + (b.src || 'no source') + '</div>'}${b.caption ? `<figcaption style="font-size:0.8rem;color:#999;margin-top:0.5rem">${b.caption}</figcaption>` : ''}</figure>`;
      case 'divider': return '<hr />';
      case 'customHtmlSafeBlock': return b.html || '';
      default: return `<p style="color:#999">[${b.type}]</p>`;
    }
  }).join('');
}

// ── Special panels (Hero, Skills, Manifest) ──
function showSpecialPanel(type) {
  if (type === 'hero') renderHeroPanel();
  else if (type === 'skills') renderSkillsPanel();
  else if (type === 'manifest') renderManifestPanel();
}

function renderHeroPanel() {
  const panel = $('#hero-panel');
  panel.classList.remove('hidden');
  const h = state.hero;
  $('#hero-fields').innerHTML = `
    <div class="form-section">
      <div class="form-section-title">Personal Information</div>
      <div class="form-group">
        <label class="form-label">Name</label>
        <input class="form-input" id="hero-name" value="${esc(h.name)}" />
      </div>
      <div class="form-group">
        <label class="form-label">Tagline</label>
        <input class="form-input" id="hero-tagline" value="${esc(h.tagline)}" />
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" id="hero-description" rows="3">${esc(h.description)}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Current Position</label>
        <input class="form-input" id="hero-position" value="${esc(h.currentPosition || '')}" />
      </div>
    </div>
    <div class="form-section">
      <div class="form-section-title">Links</div>
      <div id="hero-links-list">
        ${(h.links || []).map((l, i) => `
          <div class="form-row-3" style="margin-bottom:0.5rem">
            <input class="form-input" data-hlink="${i}" data-hfield="label" value="${esc(l.label)}" placeholder="Label" />
            <input class="form-input" data-hlink="${i}" data-hfield="icon" value="${esc(l.icon)}" placeholder="Icon (github/linkedin/mail)" />
            <input class="form-input" data-hlink="${i}" data-hfield="url" value="${esc(l.url)}" placeholder="URL" />
          </div>
        `).join('')}
      </div>
    </div>`;
}

$('#btn-save-hero').addEventListener('click', async () => {
  const data = {
    name: $('#hero-name').value,
    tagline: $('#hero-tagline').value,
    description: $('#hero-description').value,
    currentPosition: $('#hero-position').value,
    links: [],
  };
  const linkEls = $$('#hero-links-list [data-hlink]');
  const linkMap = {};
  linkEls.forEach(el => {
    const idx = el.dataset.hlink;
    if (!linkMap[idx]) linkMap[idx] = {};
    linkMap[idx][el.dataset.hfield] = el.value;
  });
  data.links = Object.values(linkMap);
  await api('PUT', '/api/hero', data);
  state.hero = data;
  showBanner('Hero settings saved', 'success');
});

function renderSkillsPanel() {
  const panel = $('#skills-panel');
  panel.classList.remove('hidden');
  const skills = state.skills || [];
  $('#skills-fields').innerHTML = skills.map((cat, ci) => `
    <div class="skills-category-group">
      <div class="skills-category-header">
        <input value="${esc(cat.category)}" data-scat="${ci}" placeholder="Category name" />
        <button class="btn btn-danger btn-sm" onclick="removeSkillCategory(${ci})">Remove</button>
      </div>
      ${cat.items.map((item, ii) => `
        <div class="skill-row">
          <input value="${esc(item.name)}" data-skill="${ci}-${ii}" data-sfield="name" placeholder="Skill name" />
          <input class="skill-project-ids" value="${(item.projectIds || []).join(', ')}" data-skill="${ci}-${ii}" data-sfield="projectIds" placeholder="project-id-1, project-id-2" />
          <button class="btn btn-danger btn-sm" onclick="removeSkill(${ci},${ii})">x</button>
        </div>
      `).join('')}
      <button class="btn btn-outline btn-sm" style="margin-top:0.5rem" onclick="addSkill(${ci})">+ Add Skill</button>
    </div>
  `).join('') + '<button class="btn btn-outline" style="margin-top:1rem" onclick="addSkillCategory()">+ Add Category</button>';
}

window.addSkillCategory = function() {
  state.skills.push({ category: 'New Category', items: [] });
  renderSkillsPanel();
};
window.removeSkillCategory = function(ci) {
  state.skills.splice(ci, 1);
  renderSkillsPanel();
};
window.addSkill = function(ci) {
  state.skills[ci].items.push({ name: '', projectIds: [] });
  renderSkillsPanel();
};
window.removeSkill = function(ci, ii) {
  state.skills[ci].items.splice(ii, 1);
  renderSkillsPanel();
};

$('#btn-save-skills').addEventListener('click', async () => {
  const data = [];
  $$('[data-scat]').forEach(el => {
    const ci = parseInt(el.dataset.scat);
    if (!data[ci]) data[ci] = { category: '', items: [] };
    data[ci].category = el.value;
  });
  $$('[data-skill]').forEach(el => {
    const [ci, ii] = el.dataset.skill.split('-').map(Number);
    if (!data[ci]) return;
    if (!data[ci].items[ii]) data[ci].items[ii] = { name: '', projectIds: [] };
    if (el.dataset.sfield === 'name') data[ci].items[ii].name = el.value;
    if (el.dataset.sfield === 'projectIds') {
      data[ci].items[ii].projectIds = el.value.split(',').map(s => s.trim()).filter(Boolean);
    }
  });
  await api('PUT', '/api/skills', data);
  state.skills = data;
  showBanner('Skills saved', 'success');
});

function renderManifestPanel() {
  const panel = $('#manifest-panel');
  panel.classList.remove('hidden');
  const m = state.manifest;

  const projOptions = state.items.projects.map(p => `<option value="${p.id}">${p.title} (${p.id})</option>`).join('');
  const colOptions = state.items.collections.map(c => `<option value="${c.id}">${c.title} (${c.id})</option>`).join('');
  const insOptions = state.items.insights.map(i => `<option value="${i.id}">${i.title} (${i.id})</option>`).join('');

  $('#manifest-fields').innerHTML = `
    <div class="manifest-section">
      <h3>Noteworthy Projects (Featured Carousel)</h3>
      <div class="manifest-list" id="manifest-noteworthy">
        ${(m.noteworthy || []).map((id, i) => {
          const proj = state.items.projects.find(p => p.id === id);
          return `<div class="manifest-item" draggable="true" data-mtype="noteworthy" data-mindex="${i}">
            <span class="manifest-drag">&#x2630;</span>
            <span class="manifest-item-title">${proj?.title || id}</span>
            <span class="manifest-item-id">${id}</span>
            <span class="manifest-remove" onclick="removeManifestItem('noteworthy',${i})">&times;</span>
          </div>`;
        }).join('')}
      </div>
      <div class="manifest-add-row">
        <select id="add-noteworthy-select">${projOptions}</select>
        <button class="btn btn-outline btn-sm" onclick="addManifestItem('noteworthy','add-noteworthy-select')">Add</button>
      </div>
    </div>

    <div class="manifest-section">
      <h3>Collections Order</h3>
      <div class="manifest-list" id="manifest-collectionsOrder">
        ${(m.collectionsOrder || []).map((id, i) => {
          const col = state.items.collections.find(c => c.id === id);
          return `<div class="manifest-item" draggable="true" data-mtype="collectionsOrder" data-mindex="${i}">
            <span class="manifest-drag">&#x2630;</span>
            <span class="manifest-item-title">${col?.title || id}</span>
            <span class="manifest-item-id">${id}</span>
            <span class="manifest-remove" onclick="removeManifestItem('collectionsOrder',${i})">&times;</span>
          </div>`;
        }).join('')}
      </div>
      <div class="manifest-add-row">
        <select id="add-collections-select">${colOptions}</select>
        <button class="btn btn-outline btn-sm" onclick="addManifestItem('collectionsOrder','add-collections-select')">Add</button>
      </div>
    </div>

    <div class="manifest-section">
      <h3>Insights Order</h3>
      <div class="manifest-list" id="manifest-insightsOrder">
        ${(m.insightsOrder || []).map((id, i) => {
          const ins = state.items.insights.find(n => n.id === id);
          return `<div class="manifest-item" draggable="true" data-mtype="insightsOrder" data-mindex="${i}">
            <span class="manifest-drag">&#x2630;</span>
            <span class="manifest-item-title">${ins?.title || id}</span>
            <span class="manifest-item-id">${id}</span>
            <span class="manifest-remove" onclick="removeManifestItem('insightsOrder',${i})">&times;</span>
          </div>`;
        }).join('')}
      </div>
      <div class="manifest-add-row">
        <select id="add-insights-select">${insOptions}</select>
        <button class="btn btn-outline btn-sm" onclick="addManifestItem('insightsOrder','add-insights-select')">Add</button>
      </div>
    </div>`;

  initManifestDragDrop();
}

window.removeManifestItem = function(key, idx) {
  state.manifest[key].splice(idx, 1);
  renderManifestPanel();
};
window.addManifestItem = function(key, selectId) {
  const select = document.getElementById(selectId);
  const val = select.value;
  if (val && !state.manifest[key].includes(val)) {
    state.manifest[key].push(val);
    renderManifestPanel();
  }
};

function initManifestDragDrop() {
  $$('.manifest-list').forEach(list => {
    let dragIdx = null;
    const mtype = list.id.replace('manifest-', '');

    list.querySelectorAll('.manifest-item').forEach(item => {
      item.addEventListener('dragstart', e => {
        dragIdx = parseInt(item.dataset.mindex);
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('dragend', () => item.classList.remove('dragging'));
      item.addEventListener('dragover', e => { e.preventDefault(); });
      item.addEventListener('drop', e => {
        e.preventDefault();
        const dropIdx = parseInt(item.dataset.mindex);
        if (dragIdx === null || dragIdx === dropIdx) return;
        const arr = state.manifest[mtype];
        const [moved] = arr.splice(dragIdx, 1);
        arr.splice(dropIdx, 0, moved);
        renderManifestPanel();
      });
    });
  });
}

$('#btn-save-manifest').addEventListener('click', async () => {
  await api('PUT', '/api/manifest', state.manifest);
  showBanner('Manifest saved', 'success');
});

// ── Build ──
$('#btn-build').addEventListener('click', async () => {
  const modal = $('#build-modal');
  const output = $('#build-output');
  modal.classList.remove('hidden');
  output.textContent = 'Building...';
  output.classList.remove('error');

  const result = await api('POST', '/api/build');
  if (result.ok) {
    output.textContent = result.output;
  } else {
    output.textContent = (result.output || '') + '\n' + (result.error || 'Build failed');
    output.classList.add('error');
  }
});

$('#build-modal-close').addEventListener('click', () => {
  $('#build-modal').classList.add('hidden');
});

// ── Banner ──
function showBanner(message, type) {
  const banner = $('#error-banner');
  banner.textContent = message;
  banner.style.background = type === 'success' ? '#e8f5e8' : '#fce4e4';
  banner.style.color = type === 'success' ? '#166534' : '#991b1b';
  banner.style.borderColor = type === 'success' ? '#4caf50' : '#c0392b';
  banner.classList.remove('hidden');
  setTimeout(() => banner.classList.add('hidden'), 3000);
}

// ── Init ──
loadAll();
