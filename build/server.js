#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT = path.join(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
};

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch (e) { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mime });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

function listContent(type) {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));
      return { filename: f, ...data };
    });
}

function autoBuild() {
  try {
    execSync('node build/build.js', { cwd: ROOT, encoding: 'utf-8', stdio: 'pipe' });
    console.log('  [auto-build] data/content.js regenerated');
  } catch (e) {
    console.error('  [auto-build] FAILED:', (e.stderr || e.message).trim());
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // API routes
  if (pathname.startsWith('/api/')) {
    try {
      // GET /api/content/:type — list all items of type
      if (req.method === 'GET' && /^\/api\/content\/(projects|collections|insights)$/.test(pathname)) {
        const type = pathname.split('/').pop();
        return sendJSON(res, 200, listContent(type));
      }

      // GET /api/content/:type/:filename — get single item
      if (req.method === 'GET' && /^\/api\/content\/(projects|collections|insights)\/[^/]+\.json$/.test(pathname)) {
        const parts = pathname.split('/');
        const filename = parts.pop();
        const type = parts.pop();
        const filePath = path.join(CONTENT_DIR, type, filename);
        if (!fs.existsSync(filePath)) return sendJSON(res, 404, { error: 'Not found' });
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return sendJSON(res, 200, data);
      }

      // PUT /api/content/:type/:filename — save item
      if (req.method === 'PUT' && /^\/api\/content\/(projects|collections|insights)\/[^/]+\.json$/.test(pathname)) {
        const parts = pathname.split('/');
        const filename = parts.pop();
        const type = parts.pop();
        const dir = path.join(CONTENT_DIR, type);
        fs.mkdirSync(dir, { recursive: true });
        const data = await readBody(req);
        fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2), 'utf-8');
        autoBuild();
        return sendJSON(res, 200, { ok: true, filename });
      }

      // DELETE /api/content/:type/:filename — delete item
      if (req.method === 'DELETE' && /^\/api\/content\/(projects|collections|insights)\/[^/]+\.json$/.test(pathname)) {
        const parts = pathname.split('/');
        const filename = parts.pop();
        const type = parts.pop();
        const filePath = path.join(CONTENT_DIR, type, filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        autoBuild();
        return sendJSON(res, 200, { ok: true });
      }

      // GET /api/hero — read hero
      if (req.method === 'GET' && pathname === '/api/hero') {
        return sendJSON(res, 200, JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'hero.json'), 'utf-8')));
      }

      // PUT /api/hero — save hero
      if (req.method === 'PUT' && pathname === '/api/hero') {
        const data = await readBody(req);
        fs.writeFileSync(path.join(CONTENT_DIR, 'hero.json'), JSON.stringify(data, null, 2), 'utf-8');
        autoBuild();
        return sendJSON(res, 200, { ok: true });
      }

      // GET /api/skills — read skills
      if (req.method === 'GET' && pathname === '/api/skills') {
        return sendJSON(res, 200, JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'skills.json'), 'utf-8')));
      }

      // PUT /api/skills — save skills
      if (req.method === 'PUT' && pathname === '/api/skills') {
        const data = await readBody(req);
        fs.writeFileSync(path.join(CONTENT_DIR, 'skills.json'), JSON.stringify(data, null, 2), 'utf-8');
        autoBuild();
        return sendJSON(res, 200, { ok: true });
      }

      // GET /api/manifest — read manifest
      if (req.method === 'GET' && pathname === '/api/manifest') {
        return sendJSON(res, 200, JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'manifest.json'), 'utf-8')));
      }

      // PUT /api/manifest — save manifest
      if (req.method === 'PUT' && pathname === '/api/manifest') {
        const data = await readBody(req);
        fs.writeFileSync(path.join(CONTENT_DIR, 'manifest.json'), JSON.stringify(data, null, 2), 'utf-8');
        autoBuild();
        return sendJSON(res, 200, { ok: true });
      }

      // POST /api/build — trigger build
      if (req.method === 'POST' && pathname === '/api/build') {
        try {
          const output = execSync('node build/build.js', { cwd: ROOT, encoding: 'utf-8' });
          return sendJSON(res, 200, { ok: true, output });
        } catch (e) {
          return sendJSON(res, 400, { ok: false, error: e.stderr || e.message, output: e.stdout || '' });
        }
      }

      return sendJSON(res, 404, { error: 'API route not found' });
    } catch (e) {
      return sendJSON(res, 500, { error: e.message });
    }
  }

  // Static files — admin UI
  if (pathname === '/' || pathname === '/admin' || pathname === '/admin/') {
    return serveStatic(res, path.join(ROOT, 'admin', 'index.html'));
  }
  if (pathname.startsWith('/admin/')) {
    return serveStatic(res, path.join(ROOT, pathname));
  }

  // Serve site files for preview
  const safePath = path.join(ROOT, pathname);
  if (safePath.startsWith(ROOT)) {
    return serveStatic(res, safePath);
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n  Content Editor running at http://localhost:${PORT}/`);
  console.log(`  API available at http://localhost:${PORT}/api/`);
  console.log(`  Site preview at http://localhost:${PORT}/index.html`);
  console.log(`\n  Press Ctrl+C to stop.\n`);
});
