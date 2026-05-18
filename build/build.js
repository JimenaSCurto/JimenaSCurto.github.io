#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'content.js');
const VALIDATE_ONLY = process.argv.includes('--validate-only');

const VALID_PALETTES = ['green', 'teal', 'sienna', 'slate', 'indigo', 'olive'];
const VALID_STATUSES = ['Complete', 'In Progress', 'Ongoing'];
const VALID_BLOCK_TYPES = [
  'heading', 'subtitle', 'paragraph', 'quote', 'bulletList', 'numberedList',
  'callout', 'metric', 'image', 'imageGrid', 'timeline', 'comparison',
  'linkList', 'divider', 'note', 'warning', 'customHtmlSafeBlock'
];

class BuildError {
  constructor(file, field, message, severity = 'error') {
    this.file = file;
    this.field = field;
    this.message = message;
    this.severity = severity;
  }
  toString() {
    const tag = this.severity === 'warning' ? 'WARN' : 'ERR ';
    return `  [${tag}] ${this.file} → ${this.field}: ${this.message}`;
  }
}

function readJSON(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in ${path.basename(filePath)}: ${e.message}`);
  }
}

function readDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ name: f, path: path.join(dir, f), data: readJSON(path.join(dir, f)) }));
}

function blocksToHTML(blocks) {
  if (!blocks || !blocks.length) return '';
  return blocks.map(b => {
    switch (b.type) {
      case 'heading': {
        const lvl = b.level || 2;
        return `<h${lvl}>${b.text}</h${lvl}>`;
      }
      case 'subtitle':
        return `<p class="block-subtitle">${b.text}</p>`;
      case 'paragraph':
        return `<p>${b.text}</p>`;
      case 'quote':
        return `<blockquote>${b.text}${b.attribution ? `<cite>${b.attribution}</cite>` : ''}</blockquote>`;
      case 'bulletList':
        return `<ul>${(b.items || []).map(i => `<li>${i}</li>`).join('')}</ul>`;
      case 'numberedList':
        return `<ol>${(b.items || []).map(i => `<li>${i}</li>`).join('')}</ol>`;
      case 'callout':
        return `<div class="block-callout${b.variant ? ` callout-${b.variant}` : ''}">${b.text}</div>`;
      case 'metric':
        return `<div class="block-metric"><span class="metric-value">${b.value}</span><span class="metric-label">${b.label}</span></div>`;
      case 'image':
        return `<figure class="block-image"><img src="${b.src}" alt="${b.alt || ''}" />${b.caption ? `<figcaption>${b.caption}</figcaption>` : ''}</figure>`;
      case 'imageGrid':
        return `<div class="block-image-grid">${(b.images || []).map(img => `<figure><img src="${img.src}" alt="${img.alt || ''}" />${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}</figure>`).join('')}</div>`;
      case 'timeline':
        return `<div class="block-timeline">${(b.events || []).map(e => `<div class="timeline-event"><span class="timeline-date">${e.date}</span><span class="timeline-text">${e.text}</span></div>`).join('')}</div>`;
      case 'comparison':
        return `<div class="block-comparison"><div class="comparison-left"><h4>${b.leftLabel || 'Before'}</h4>${b.leftContent}</div><div class="comparison-right"><h4>${b.rightLabel || 'After'}</h4>${b.rightContent}</div></div>`;
      case 'linkList':
        return `<ul class="block-link-list">${(b.links || []).map(l => `<li><a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>${l.description ? ` — ${l.description}` : ''}</li>`).join('')}</ul>`;
      case 'divider':
        return '<hr />';
      case 'note':
        return `<div class="block-note">${b.text}</div>`;
      case 'warning':
        return `<div class="block-warning">${b.text}</div>`;
      case 'customHtmlSafeBlock':
        return b.html || '';
      default:
        return `<!-- unknown block type: ${b.type} -->`;
    }
  }).join('\n            ');
}

function validateProject(proj, fileName, allProjectIds, errors) {
  const f = fileName;
  if (!proj.id) errors.push(new BuildError(f, 'id', 'Missing project id'));
  if (!proj.title) errors.push(new BuildError(f, 'title', 'Missing project title'));
  if (!proj.slug) errors.push(new BuildError(f, 'slug', 'Missing slug'));
  if (!proj.summary) errors.push(new BuildError(f, 'summary', 'Missing summary', 'warning'));
  if (!proj.description) errors.push(new BuildError(f, 'description', 'Missing description', 'warning'));
  if (proj.status && !VALID_STATUSES.includes(proj.status)) {
    errors.push(new BuildError(f, 'status', `Invalid status "${proj.status}". Must be one of: ${VALID_STATUSES.join(', ')}`));
  }
  if (proj.blocks) {
    proj.blocks.forEach((block, i) => {
      if (!VALID_BLOCK_TYPES.includes(block.type)) {
        errors.push(new BuildError(f, `blocks[${i}].type`, `Unsupported block type "${block.type}"`));
      }
    });
  }
  if (allProjectIds.filter(id => id === proj.id).length > 1) {
    errors.push(new BuildError(f, 'id', `Duplicate project id "${proj.id}"`));
  }
}

function validateCollection(col, fileName, projectIndex, errors) {
  const f = fileName;
  if (!col.id) errors.push(new BuildError(f, 'id', 'Missing collection id'));
  if (!col.title) errors.push(new BuildError(f, 'title', 'Missing collection title'));
  if (col.palette && !VALID_PALETTES.includes(col.palette)) {
    errors.push(new BuildError(f, 'palette', `Invalid palette "${col.palette}". Must be one of: ${VALID_PALETTES.join(', ')}`));
  }
  (col.includedProjects || []).forEach(pid => {
    if (!projectIndex[pid]) {
      errors.push(new BuildError(f, 'includedProjects', `Referenced project "${pid}" does not exist`));
    }
  });
}

function validateInsight(ins, fileName, projectIndex, errors) {
  const f = fileName;
  if (!ins.id) errors.push(new BuildError(f, 'id', 'Missing insight id'));
  if (!ins.title) errors.push(new BuildError(f, 'title', 'Missing insight title'));
  if (!ins.category) errors.push(new BuildError(f, 'category', 'Missing category', 'warning'));
  if (ins.date && !/^\d{4}(-\d{2})?$/.test(ins.date)) {
    errors.push(new BuildError(f, 'date', `Invalid date format "${ins.date}". Expected YYYY or YYYY-MM`));
  }
  if (!ins.blocks || ins.blocks.length === 0) {
    errors.push(new BuildError(f, 'blocks', 'Insight has no content blocks', 'warning'));
  }
  (ins.relatedProjects || []).forEach(pid => {
    if (!projectIndex[pid]) {
      errors.push(new BuildError(f, 'relatedProjects', `Referenced project "${pid}" does not exist`));
    }
  });
}

function validateManifest(manifest, projectIndex, collectionIndex, insightIndex, errors) {
  const f = 'manifest.json';
  (manifest.noteworthy || []).forEach(pid => {
    if (!projectIndex[pid]) {
      errors.push(new BuildError(f, 'noteworthy', `Referenced project "${pid}" does not exist`));
    }
  });
  (manifest.collectionsOrder || []).forEach(cid => {
    if (!collectionIndex[cid]) {
      errors.push(new BuildError(f, 'collectionsOrder', `Referenced collection "${cid}" does not exist`));
    }
  });
  (manifest.insightsOrder || []).forEach(iid => {
    if (!insightIndex[iid]) {
      errors.push(new BuildError(f, 'insightsOrder', `Referenced insight "${iid}" does not exist`));
    }
  });
}

function build() {
  console.log('Building content bundle...\n');

  const errors = [];

  // Read all source files
  const hero = readJSON(path.join(CONTENT_DIR, 'hero.json'));
  const skills = readJSON(path.join(CONTENT_DIR, 'skills.json'));
  const manifest = readJSON(path.join(CONTENT_DIR, 'manifest.json'));
  const projectFiles = readDir(path.join(CONTENT_DIR, 'projects'));
  const collectionFiles = readDir(path.join(CONTENT_DIR, 'collections'));
  const insightFiles = readDir(path.join(CONTENT_DIR, 'insights'));

  // Build indices
  const projectIndex = {};
  const allProjectIds = projectFiles.map(f => f.data.id);
  projectFiles.forEach(f => { projectIndex[f.data.id] = f.data; });

  const collectionIndex = {};
  collectionFiles.forEach(f => { collectionIndex[f.data.id] = f.data; });

  const insightIndex = {};
  insightFiles.forEach(f => { insightIndex[f.data.id] = f.data; });

  // Validate
  projectFiles.forEach(f => validateProject(f.data, f.name, allProjectIds, errors));
  collectionFiles.forEach(f => validateCollection(f.data, f.name, projectIndex, errors));
  insightFiles.forEach(f => validateInsight(f.data, f.name, projectIndex, errors));
  validateManifest(manifest, projectIndex, collectionIndex, insightIndex, errors);

  // Check for slug uniqueness across all types
  const allSlugs = [
    ...projectFiles.map(f => ({ slug: f.data.slug, file: f.name })),
    ...collectionFiles.map(f => ({ slug: f.data.slug, file: f.name })),
    ...insightFiles.map(f => ({ slug: f.data.slug, file: f.name })),
  ];
  const slugCounts = {};
  allSlugs.forEach(s => {
    if (!s.slug) return;
    slugCounts[s.slug] = (slugCounts[s.slug] || 0) + 1;
    if (slugCounts[s.slug] > 1) {
      errors.push(new BuildError(s.file, 'slug', `Duplicate slug "${s.slug}"`));
    }
  });

  // Report
  const blockingErrors = errors.filter(e => e.severity === 'error');
  const warnings = errors.filter(e => e.severity === 'warning');

  if (warnings.length) {
    console.log(`Warnings (${warnings.length}):`);
    warnings.forEach(w => console.log(w.toString()));
    console.log('');
  }

  if (blockingErrors.length) {
    console.error(`Blocking errors (${blockingErrors.length}):`);
    blockingErrors.forEach(e => console.error(e.toString()));
    console.error('\nBuild aborted. Fix errors above and re-run.');
    process.exit(1);
  }

  if (VALIDATE_ONLY) {
    console.log(`Validation passed. ${projectFiles.length} projects, ${collectionFiles.length} collections, ${insightFiles.length} insights.`);
    process.exit(0);
  }

  // Assemble the CONTENT object matching the frontend's expected shape

  // Noteworthy — ordered by manifest, mapped to the card shape
  const noteworthy = (manifest.noteworthy || []).map(pid => {
    const p = projectIndex[pid];
    if (!p) return null;
    return {
      id: p.id,
      title: p.title,
      summary: p.summary,
      tags: (p.tags || []).slice(0, 3),
      link: p.link || '#',
      collectionId: p.relatedCollection || null,
    };
  }).filter(Boolean);

  // Collections — ordered by manifest, projects resolved inline
  const collections = (manifest.collectionsOrder || []).map(cid => {
    const col = collectionIndex[cid];
    if (!col) return null;
    const projects = (col.includedProjects || []).map(pid => {
      const p = projectIndex[pid];
      if (!p) return null;
      return {
        id: p.id,
        title: p.title,
        subtitle: p.subtitle || '',
        description: p.description,
        skills: p.skills || [],
        formats: p.formats || [],
        tags: p.tags || [],
        githubUrl: p.githubUrl || '#',
        link: p.link || '#',
        year: parseInt(p.date, 10) || null,
        status: p.status || 'Complete',
        keyFindings: p.keyFindings || [],
        article: blocksToHTML(p.blocks),
      };
    }).filter(Boolean);

    return {
      id: col.id,
      title: col.title,
      description: col.description,
      palette: col.palette || 'green',
      projects,
    };
  }).filter(Boolean);

  // Skills — update projectIds from new IDs to match the frontend's expected format
  // The frontend uses projectIndex built from noteworthy + collection projects
  // We need to map new IDs to the IDs the frontend will see
  const skillsData = skills.map(cat => ({
    category: cat.category,
    items: cat.items.map(item => ({
      name: item.name,
      projectIds: item.projectIds || [],
    })),
  }));

  // Insights — ordered by manifest
  const insights = (manifest.insightsOrder || []).map(iid => {
    const ins = insightIndex[iid];
    if (!ins) return null;
    return {
      id: ins.id,
      title: ins.title,
      category: ins.category,
      date: ins.date,
      readTime: ins.readTime,
      summary: ins.summary,
      body: blocksToHTML(ins.blocks),
    };
  }).filter(Boolean);

  const CONTENT = {
    hero: {
      name: hero.name,
      tagline: hero.tagline,
      description: hero.description,
      links: hero.links || [],
    },
    noteworthy,
    collections,
    skills: skillsData,
    insights,
  };

  // Write output
  const output = `/**\n * Generated by build/build.js — DO NOT EDIT MANUALLY\n * Source: content/ directory\n * Built: ${new Date().toISOString()}\n */\n\nconst CONTENT = ${JSON.stringify(CONTENT, null, 2)};\n\nif (typeof module !== "undefined") module.exports = CONTENT;\n`;

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');

  console.log(`Build complete.`);
  console.log(`  ${projectFiles.length} projects`);
  console.log(`  ${collectionFiles.length} collections`);
  console.log(`  ${insightFiles.length} insights`);
  console.log(`  ${noteworthy.length} noteworthy items`);
  console.log(`  Output: ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

build();
