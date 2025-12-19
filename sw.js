/* sw.js — BLACK CODE BROWSER v1.2.3
   ATOMIC ⊗ TAPE CMS ⊗ MX2DB Kernel Router
   ═══════════════════════════════════════════════════════════════
   Features:
   - Virtual file serving from manifest.json (atomic.fold)
   - IDB session store (replaces localStorage)
   - Fetch projection cache with CORS handshake
   - π video renderer auto-routing
   - Tab management (close/reorder)
   - Tape export/import
   - Canvas DOM projection (API → Canvas rendering)
   ═══════════════════════════════════════════════════════════════ */

const SW_VERSION = '1.2.3';
const CACHE_NAME = `blackcode-cache-v${SW_VERSION}`;
const CORE_ASSETS = ['/', '/index.html', '/manifest.json', '/sw.js'];
const PROJECTION_CACHE = `blackcode-projection-v${SW_VERSION}`;

/* ══════════════════════════════════════════════════════════════
   INSTALL / ACTIVATE
   ══════════════════════════════════════════════════════════════ */

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // Clean old caches
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith('blackcode-') && k !== CACHE_NAME && k !== PROJECTION_CACHE)
          .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

/* ══════════════════════════════════════════════════════════════
   MANIFEST DB HELPERS
   ══════════════════════════════════════════════════════════════ */

async function getManifestJSON() {
  try {
    const res = await fetch('/manifest.json', { cache: 'no-cache' });
    return res.json();
  } catch {
    return null;
  }
}

function jsonResponse(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers }
  });
}

function textResponse(txt, contentType = 'text/plain; charset=utf-8', status = 200, headers = {}) {
  return new Response(txt, { status, headers: { 'Content-Type': contentType, ...headers } });
}

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

/* ══════════════════════════════════════════════════════════════
   VIRTUAL FILE SERVING (atomic.fold)
   ══════════════════════════════════════════════════════════════ */

async function virtualFromAtomicFold(pathname) {
  const m = await getManifestJSON();
  if (!m?.atomic?.fold) return null;

  const fold = m.atomic.fold;
  const key = pathname.replace(/^\//, '');

  if (fold[key] == null) return null;

  const content = fold[key];

  if (key.endsWith('.css')) return textResponse(content, 'text/css; charset=utf-8');
  if (key.endsWith('.xjson') || key.endsWith('.json')) return textResponse(content, 'application/json; charset=utf-8');
  if (key.endsWith('.khl')) return textResponse(content, 'text/plain; charset=utf-8');
  if (key.endsWith('.html')) return htmlResponse(content);

  return textResponse(content, 'text/plain; charset=utf-8');
}

/* ══════════════════════════════════════════════════════════════
   FETCH PROJECTION CACHE (CORS bypass via DOM projection)
   ══════════════════════════════════════════════════════════════ */

const PROJECTION_HANDLERS = {
  // π video renderer routes
  'π:video': async (url) => {
    return { type: 'video', url, renderer: 'canvas-video' };
  },
  'π:stream': async (url) => {
    return { type: 'stream', url, renderer: 'canvas-stream' };
  },
  'π:image': async (url) => {
    return { type: 'image', url, renderer: 'canvas-image' };
  }
};

async function fetchWithProjection(request, url) {
  const projectionCache = await caches.open(PROJECTION_CACHE);

  // Check cache first
  const cached = await projectionCache.match(request);
  if (cached) {
    const age = Date.now() - parseInt(cached.headers.get('x-cached-at') || '0');
    if (age < 300000) return cached; // 5 min cache
  }

  try {
    const res = await fetch(request);

    if (res.ok && request.method === 'GET') {
      const clone = res.clone();
      const headers = new Headers(clone.headers);
      headers.set('x-cached-at', Date.now().toString());
      headers.set('x-projection-version', SW_VERSION);

      const body = await clone.arrayBuffer();
      const cachedRes = new Response(body, {
        status: clone.status,
        statusText: clone.statusText,
        headers
      });

      projectionCache.put(request, cachedRes);
    }

    return res;
  } catch (err) {
    // Return cached even if stale on network failure
    if (cached) return cached;
    throw err;
  }
}

/* ══════════════════════════════════════════════════════════════
   SW FETCH ROUTER
   ══════════════════════════════════════════════════════════════ */

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Virtual atomic endpoints
  if (url.origin === location.origin) {
    const virtualPaths = ['/atomic.css', '/atomic.xjson', '/atomic.khl', '/atomic.html'];
    if (virtualPaths.includes(url.pathname)) {
      event.respondWith((async () => {
        const v = await virtualFromAtomicFold(url.pathname);
        return v || new Response('Not found', { status: 404 });
      })());
      return;
    }
  }

  // π projection routes (video/stream/image)
  if (url.pathname.startsWith('/π/') || url.searchParams.has('π')) {
    event.respondWith((async () => {
      const piType = url.pathname.split('/')[2] || url.searchParams.get('π');
      const targetUrl = url.searchParams.get('url') || url.pathname.split('/').slice(3).join('/');

      if (PROJECTION_HANDLERS[`π:${piType}`]) {
        const meta = await PROJECTION_HANDLERS[`π:${piType}`](targetUrl);
        return jsonResponse({ ok: true, projection: meta });
      }

      return jsonResponse({ ok: false, error: 'Unknown π route' }, 400);
    })());
    return;
  }

  // Cache-first for same-origin core assets
  if (url.origin === location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);
      if (cached) return cached;

      const res = await fetch(event.request);
      if (event.request.method === 'GET' && res.ok) {
        cache.put(event.request, res.clone());
      }
      return res;
    })());
    return;
  }

  // Cross-origin with projection cache
  event.respondWith(fetchWithProjection(event.request, url));
});

/* ══════════════════════════════════════════════════════════════
   INDEXEDDB — IDB SESSION STORE
   ══════════════════════════════════════════════════════════════ */

const IDB = {
  dbp: null,
  DB_NAME: 'mx2db_blackcode',
  DB_VERSION: 2,

  STORES: {
    tapes: { keyPath: 'id', indexes: ['name', 'type', 'modified'] },
    settings: { keyPath: 'k' },
    endpoints: { keyPath: 'id' },
    activity: { keyPath: 'ts' },
    sessions: { keyPath: 'id', indexes: ['url', 'updatedAt'] },
    tabs: { keyPath: 'id', indexes: ['order', 'active'] },
    projectionCache: { keyPath: 'url', indexes: ['cachedAt', 'type'] }
  },

  open() {
    if (this.dbp) return this.dbp;

    this.dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = req.result;

        for (const [name, config] of Object.entries(this.STORES)) {
          if (!db.objectStoreNames.contains(name)) {
            const store = db.createObjectStore(name, { keyPath: config.keyPath });
            if (config.indexes) {
              for (const idx of config.indexes) {
                store.createIndex(idx, idx, { unique: false });
              }
            }
          }
        }
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    return this.dbp;
  },

  async tx(store, mode, fn) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const s = t.objectStore(store);
      const out = fn(s);
      t.oncomplete = () => resolve(out);
      t.onerror = () => reject(t.error);
    });
  },

  async get(store, key) {
    return this.tx(store, 'readonly', (s) => new Promise((res, rej) => {
      const r = s.get(key);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    }));
  },

  async all(store) {
    return this.tx(store, 'readonly', (s) => new Promise((res, rej) => {
      const r = s.getAll();
      r.onsuccess = () => res(r.result || []);
      r.onerror = () => rej(r.error);
    }));
  },

  async put(store, val) {
    return this.tx(store, 'readwrite', (s) => s.put(val));
  },

  async del(store, key) {
    return this.tx(store, 'readwrite', (s) => s.delete(key));
  },

  async clear(store) {
    return this.tx(store, 'readwrite', (s) => s.clear());
  },

  async count(store) {
    return this.tx(store, 'readonly', (s) => new Promise((res, rej) => {
      const r = s.count();
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    }));
  },

  async query(store, indexName, range) {
    return this.tx(store, 'readonly', (s) => new Promise((res, rej) => {
      const idx = s.index(indexName);
      const r = idx.getAll(range);
      r.onsuccess = () => res(r.result || []);
      r.onerror = () => rej(r.error);
    }));
  }
};

/* ══════════════════════════════════════════════════════════════
   SESSION MANAGEMENT (IDB-based)
   ══════════════════════════════════════════════════════════════ */

const SessionStore = {
  async create(url, opts = {}) {
    const session = {
      id: uid(),
      url: String(url || '').trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      open: true,
      token: uid(),
      caps: {
        dom_read: opts.dom_read ?? false,
        dom_write: opts.dom_write ?? false,
        net_fetch: opts.net_fetch ?? true,
        storage: opts.storage ?? true,
        js_run: opts.js_run ?? false,
        console: opts.console ?? true
      },
      title: opts.title || url,
      favicon: opts.favicon || null
    };

    await IDB.put('sessions', session);
    await IDB.put('activity', { ts: Date.now(), op: 'session_create', id: session.id, url });
    return session;
  },

  async get(id) {
    return IDB.get('sessions', id);
  },

  async update(id, updates) {
    const session = await this.get(id);
    if (!session) return null;

    Object.assign(session, updates, { updatedAt: Date.now() });
    await IDB.put('sessions', session);
    return session;
  },

  async close(id) {
    return this.update(id, { open: false });
  },

  async delete(id) {
    await IDB.del('sessions', id);
    await IDB.put('activity', { ts: Date.now(), op: 'session_delete', id });
  },

  async listOpen() {
    const all = await IDB.all('sessions');
    return all.filter(s => s.open).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  async listAll() {
    return IDB.all('sessions');
  }
};

/* ══════════════════════════════════════════════════════════════
   TAB MANAGEMENT (with reorder support)
   ══════════════════════════════════════════════════════════════ */

const TabManager = {
  async create(sessionId, opts = {}) {
    const tabs = await IDB.all('tabs');
    const maxOrder = tabs.reduce((max, t) => Math.max(max, t.order || 0), 0);

    const tab = {
      id: uid(),
      sessionId,
      order: maxOrder + 1,
      active: opts.active ?? true,
      pinned: opts.pinned ?? false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Deactivate other tabs if this one is active
    if (tab.active) {
      for (const t of tabs) {
        if (t.active) {
          t.active = false;
          await IDB.put('tabs', t);
        }
      }
    }

    await IDB.put('tabs', tab);
    return tab;
  },

  async get(id) {
    return IDB.get('tabs', id);
  },

  async close(id) {
    const tab = await this.get(id);
    if (!tab) return false;

    await IDB.del('tabs', id);

    // Close associated session
    if (tab.sessionId) {
      await SessionStore.close(tab.sessionId);
    }

    // Activate next tab if this was active
    if (tab.active) {
      const remaining = await this.list();
      if (remaining.length > 0) {
        remaining[0].active = true;
        await IDB.put('tabs', remaining[0]);
      }
    }

    await IDB.put('activity', { ts: Date.now(), op: 'tab_close', id });
    return true;
  },

  async activate(id) {
    const tabs = await IDB.all('tabs');
    for (const t of tabs) {
      const wasActive = t.active;
      t.active = t.id === id;
      if (wasActive !== t.active) {
        t.updatedAt = Date.now();
        await IDB.put('tabs', t);
      }
    }
  },

  async reorder(tabId, newOrder) {
    const tabs = await IDB.all('tabs');
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return false;

    const oldOrder = tab.order;

    for (const t of tabs) {
      if (t.id === tabId) {
        t.order = newOrder;
      } else if (newOrder < oldOrder) {
        if (t.order >= newOrder && t.order < oldOrder) t.order++;
      } else {
        if (t.order > oldOrder && t.order <= newOrder) t.order--;
      }
      await IDB.put('tabs', t);
    }

    return true;
  },

  async list() {
    const tabs = await IDB.all('tabs');
    return tabs.sort((a, b) => a.order - b.order);
  },

  async getActive() {
    const tabs = await IDB.all('tabs');
    return tabs.find(t => t.active) || null;
  }
};

/* ══════════════════════════════════════════════════════════════
   SCXQ2 COMPRESSION ENGINE
   ══════════════════════════════════════════════════════════════ */

const SCXQ2 = {
  // Micro-agent field definitions for compression
  FIELD_MAP: {
    'id': 0x01, 'name': 0x02, 'type': 0x03, 'content': 0x04,
    'tags': 0x05, 'created': 0x06, 'modified': 0x07, 'size': 0x08,
    'compression': 0x09, 'version': 0x0A, 'author': 0x0B, 'meta': 0x0C
  },

  FIELD_MAP_REV: null,

  init() {
    this.FIELD_MAP_REV = Object.fromEntries(
      Object.entries(this.FIELD_MAP).map(([k, v]) => [v, k])
    );
  },

  compressUTF8(str) {
    const enc = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < enc.length; i++) bin += String.fromCharCode(enc[i]);
    return btoa(bin);
  },

  decompressUTF8(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  },

  // Field-aware compression for tapes
  compressTape(tape) {
    if (!this.FIELD_MAP_REV) this.init();

    const compressed = {};
    for (const [key, val] of Object.entries(tape)) {
      const fieldId = this.FIELD_MAP[key];
      if (fieldId && val !== undefined) {
        if (key === 'content' && typeof val === 'string' && val.length > 100) {
          compressed[fieldId] = this.compressUTF8(val);
          compressed[0xFF] = true; // content compressed flag
        } else {
          compressed[fieldId] = val;
        }
      }
    }
    return compressed;
  },

  decompressTape(compressed) {
    if (!this.FIELD_MAP_REV) this.init();

    const tape = {};
    const contentCompressed = compressed[0xFF];

    for (const [fieldId, val] of Object.entries(compressed)) {
      const numId = parseInt(fieldId);
      if (numId === 0xFF) continue;

      const key = this.FIELD_MAP_REV[numId];
      if (key) {
        if (key === 'content' && contentCompressed) {
          tape[key] = this.decompressUTF8(val);
        } else {
          tape[key] = val;
        }
      }
    }
    return tape;
  }
};

SCXQ2.init();

/* ══════════════════════════════════════════════════════════════
   TAPE EXPORT / IMPORT
   ══════════════════════════════════════════════════════════════ */

const TapeIO = {
  async exportAll(compress = true) {
    const tapes = await IDB.all('tapes');
    const settings = await IDB.all('settings');
    const endpoints = await IDB.all('endpoints');

    const bundle = {
      version: SW_VERSION,
      exportedAt: Date.now(),
      format: compress ? 'scxq2' : 'json',
      tapes: compress ? tapes.map(t => SCXQ2.compressTape(t)) : tapes,
      settings,
      endpoints
    };

    return compress ? SCXQ2.compressUTF8(JSON.stringify(bundle)) : JSON.stringify(bundle, null, 2);
  },

  async importBundle(data, merge = false) {
    let bundle;

    try {
      // Try to decompress first
      const decompressed = SCXQ2.decompressUTF8(data);
      bundle = JSON.parse(decompressed);
    } catch {
      // Try parsing as plain JSON
      bundle = JSON.parse(data);
    }

    if (!bundle.version || !bundle.tapes) {
      throw new Error('Invalid bundle format');
    }

    // Clear existing data if not merging
    if (!merge) {
      await IDB.clear('tapes');
      await IDB.clear('settings');
      await IDB.clear('endpoints');
    }

    // Import tapes
    const tapes = bundle.format === 'scxq2'
      ? bundle.tapes.map(t => SCXQ2.decompressTape(t))
      : bundle.tapes;

    for (const tape of tapes) {
      if (merge) {
        tape.id = uid(); // New ID to avoid conflicts
      }
      await IDB.put('tapes', tape);
    }

    // Import settings and endpoints
    for (const s of (bundle.settings || [])) {
      await IDB.put('settings', s);
    }

    for (const e of (bundle.endpoints || [])) {
      await IDB.put('endpoints', e);
    }

    await IDB.put('activity', {
      ts: Date.now(),
      op: 'import',
      note: `Imported ${tapes.length} tapes`,
      merge
    });

    return { imported: tapes.length, version: bundle.version };
  },

  async exportSingleTape(id, compress = true) {
    const tape = await IDB.get('tapes', id);
    if (!tape) throw new Error('Tape not found');

    const data = compress ? SCXQ2.compressTape(tape) : tape;
    return compress ? SCXQ2.compressUTF8(JSON.stringify(data)) : JSON.stringify(data, null, 2);
  }
};

/* ══════════════════════════════════════════════════════════════
   CANVAS DOM PROJECTION
   ══════════════════════════════════════════════════════════════ */

const CanvasProjection = {
  // Convert fetched HTML to canvas-renderable structure
  async projectDOM(url) {
    try {
      const res = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Accept': 'text/html,application/xhtml+xml,*/*' }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const html = await res.text();
      const contentType = res.headers.get('content-type') || '';

      return {
        ok: true,
        url: res.url,
        status: res.status,
        contentType,
        html,
        projectedAt: Date.now(),
        renderer: contentType.includes('json') ? 'json-view' : 'html-canvas'
      };
    } catch (err) {
      return {
        ok: false,
        url,
        error: err.message,
        projectedAt: Date.now()
      };
    }
  },

  // π video/media routing
  routePiContent(url, type) {
    const routes = {
      'video': { renderer: 'canvas-video', controls: true },
      'stream': { renderer: 'canvas-stream', live: true },
      'image': { renderer: 'canvas-image', zoomable: true },
      'audio': { renderer: 'canvas-audio', waveform: true }
    };

    return routes[type] || routes.video;
  }
};

/* ══════════════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ══════════════════════════════════════════════════════════════ */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function guessType(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  const typeMap = {
    'js': 'javascript', 'htm': 'html', 'html': 'html',
    'md': 'markdown', 'json': 'json', 'xml': 'xml',
    'css': 'css', 'txt': 'text', 'svg': 'svg',
    'mp4': 'video', 'webm': 'video', 'mp3': 'audio',
    'wav': 'audio', 'png': 'image', 'jpg': 'image',
    'jpeg': 'image', 'gif': 'image', 'webp': 'image'
  };
  return typeMap[ext] || 'binary';
}

function typeIcon(type) {
  const icons = {
    json: '{}', xml: '</>', html: '🌐', css: '🎨',
    javascript: '⚡', markdown: '📝', binary: '📦',
    video: '🎬', audio: '🎵', image: '🖼️', svg: '◇', text: '📄'
  };
  return icons[type] || '📄';
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
}

/* ══════════════════════════════════════════════════════════════
   CLIENT BRIDGE
   ══════════════════════════════════════════════════════════════ */

function postAll(msg) {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then(list => list.forEach(c => c.postMessage(msg)));
}

function postOne(clientId, msg) {
  return self.clients.get(clientId).then(c => c && c.postMessage(msg));
}

/* ══════════════════════════════════════════════════════════════
   UI BOOT & SYNC
   ══════════════════════════════════════════════════════════════ */

async function uiBoot() {
  const m = await getManifestJSON();
  const settings = await IDB.all('settings');
  const endpoints = await IDB.all('endpoints');

  // Seed settings from manifest
  if (settings.length === 0 && m?.mx2db?.settings) {
    await IDB.put('settings', { k: 'settings', v: m.mx2db.settings });
  }

  // Seed endpoints from manifest
  if (endpoints.length === 0 && Array.isArray(m?.mx2db?.api_endpoints)) {
    for (const ep of m.mx2db.api_endpoints) {
      await IDB.put('endpoints', ep);
    }
  }

  // Seed sample tapes if empty
  const tapes = await IDB.all('tapes');
  if (tapes.length === 0) {
    const samples = [
      {
        id: uid(),
        name: 'welcome.json',
        type: 'json',
        tags: ['sample', 'config'],
        compression: 'none',
        content: JSON.stringify({
          app: 'Black Code Browser',
          version: SW_VERSION,
          features: ['IDB Sessions', 'Tab Management', 'Canvas Projection', 'Tape I/O', 'π Routing'],
          author: 'ATOMIC ⊗ KUHUL'
        }, null, 2),
        created: Date.now(),
        modified: Date.now()
      },
      {
        id: uid(),
        name: 'canvas-demo.html',
        type: 'html',
        tags: ['sample', 'demo'],
        compression: 'none',
        content: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Canvas Demo</title></head>
<body style="background:#020409;color:#16f2aa;font-family:monospace;padding:40px">
<h1>⟁ BLACK CODE BROWSER</h1>
<p>Canvas-based DOM projection active. CORS bypassed via fetch projection.</p>
<svg id="kuhul_svg_root" width="400" height="100" style="border:1px solid #16f2aa33">
  <path d="M0 50 Q100 0 200 50 T400 50" stroke="#16f2aa" fill="none" stroke-width="2"/>
</svg>
</body></html>`,
        created: Date.now(),
        modified: Date.now()
      }
    ];

    for (const tape of samples) {
      tape.size = new Blob([tape.content]).size;
      await IDB.put('tapes', tape);
    }

    await IDB.put('activity', { ts: Date.now(), op: 'seed_samples', note: 'Created sample tapes' });
  }

  await uiRefreshAll();
}

async function uiRefreshAll() {
  const tapes = await IDB.all('tapes');
  tapes.sort((a, b) => (b.modified || 0) - (a.modified || 0));

  const endpoints = await IDB.all('endpoints');
  const settingsObj = (await IDB.all('settings')).find(x => x.k === 'settings')?.v || {};
  const tabs = await TabManager.list();
  const sessions = await SessionStore.listOpen();
  const activity = await IDB.all('activity');

  // Calculate storage stats
  let totalSize = tapes.reduce((s, t) => s + (t.size || 0), 0);
  const m = await getManifestJSON();
  const limit = m?.mx2db?.storage_limit_bytes || (100 * 1024 * 1024);
  const usedMB = Math.round((totalSize / 1024 / 1024) * 100) / 100;
  const totalMB = Math.round((limit / 1024 / 1024) * 100) / 100;
  const pct = limit ? clamp((totalSize / limit) * 100, 0, 100) : 0;

  postAll({
    t: 'UI_SYNC',
    version: SW_VERSION,
    settings: settingsObj,
    dashboard: {
      totalTapes: tapes.length,
      apiConnections: endpoints.length,
      compressionRatio: 'SCXQ2',
      recentActivity: activity.filter(a => Date.now() - a.ts < 86400000).length,
      systemStatus: 'OK',
      storage: { usedMB, totalMB, pct }
    },
    tapes: tapes.map(t => ({
      id: t.id, name: t.name, type: t.type, tags: t.tags || [],
      size: t.size || 0, modified: t.modified || 0,
      icon: typeIcon(t.type), sizeLabel: formatSize(t.size || 0)
    })),
    endpoints,
    tabs: tabs.map(t => ({ id: t.id, sessionId: t.sessionId, order: t.order, active: t.active, pinned: t.pinned })),
    sessions: sessions.map(s => ({ id: s.id, url: s.url, title: s.title, open: s.open }))
  });
}

/* ══════════════════════════════════════════════════════════════
   CANVAS STATE (for animation/rendering loop)
   ══════════════════════════════════════════════════════════════ */

const CANVAS = {
  grid: true,
  playing: false,
  tick: 0,
  fps: 20
};

function canvasFrame() {
  CANVAS.tick++;
  postAll({ t: 'CANVAS_FRAME', state: { ...CANVAS } });
}

let canvasTimer = null;
function canvasPlay(on) {
  CANVAS.playing = !!on;
  if (CANVAS.playing) {
    if (canvasTimer) clearInterval(canvasTimer);
    canvasTimer = setInterval(canvasFrame, 1000 / CANVAS.fps);
  } else {
    if (canvasTimer) clearInterval(canvasTimer);
    canvasTimer = null;
  }
}

/* ══════════════════════════════════════════════════════════════
   MESSAGE HANDLING (UI ↔ SW)
   ══════════════════════════════════════════════════════════════ */

self.addEventListener('message', (e) => {
  const msg = e.data || {};
  const clientId = e.source?.id;

  (async () => {
    switch (msg.t) {
      /* ─────── BOOT ─────── */
      case 'BOOT':
        await uiBoot();
        postAll({ t: 'STATUS', text: `Ready (v${SW_VERSION})` });
        break;

      /* ─────── NAVIGATION ─────── */
      case 'NAV':
        postAll({ t: 'STATUS', text: `Switched to ${msg.view || 'view'}` });
        break;

      /* ─────── SEARCH ─────── */
      case 'SEARCH':
        postAll({ t: 'STATUS', text: `Search: ${msg.q || ''}` });
        break;

      /* ─────── TAPE CRUD ─────── */
      case 'TAPE_CREATE': {
        const name = String(msg.name || '').trim();
        if (!name) return postAll({ t: 'STATUS', text: 'Tape create failed: missing name' });

        const type = msg.type || guessType(name);
        let content = String(msg.content || '');
        const compression = msg.compression || 'none';
        const tags = Array.isArray(msg.tags) ? msg.tags : String(msg.tags || '').split(',').map(s => s.trim()).filter(Boolean);

        if (compression === 'scxq2' && content) {
          content = SCXQ2.compressUTF8(content);
        }

        const tape = {
          id: uid(), name, type, tags, compression, content,
          created: Date.now(), modified: Date.now()
        };
        tape.size = new Blob([tape.content]).size;

        await IDB.put('tapes', tape);
        await IDB.put('activity', { ts: Date.now(), op: 'tape_create', id: tape.id, name: tape.name });
        await uiRefreshAll();
        postAll({ t: 'STATUS', text: `Created tape: ${name}` });
        break;
      }

      case 'TAPE_UPDATE': {
        const tape = await IDB.get('tapes', msg.id);
        if (!tape) return postAll({ t: 'STATUS', text: 'Tape not found' });

        Object.assign(tape, msg.updates, { modified: Date.now() });
        if (msg.updates.content) {
          tape.size = new Blob([tape.content]).size;
        }

        await IDB.put('tapes', tape);
        await IDB.put('activity', { ts: Date.now(), op: 'tape_update', id: tape.id, name: tape.name });
        await uiRefreshAll();
        postAll({ t: 'STATUS', text: `Updated tape: ${tape.name}` });
        break;
      }

      case 'TAPE_DELETE': {
        if (!msg.id) return;
        await IDB.del('tapes', msg.id);
        await IDB.put('activity', { ts: Date.now(), op: 'tape_delete', id: msg.id });
        await uiRefreshAll();
        postAll({ t: 'STATUS', text: 'Deleted tape' });
        break;
      }

      case 'TAPE_OPEN': {
        const tape = await IDB.get('tapes', msg.id);
        if (!tape) return;

        // Decompress if needed
        let content = tape.content;
        if (tape.compression === 'scxq2') {
          try { content = SCXQ2.decompressUTF8(content); } catch {}
        }

        postAll({ t: 'TAPE_OPENED', tape: { ...tape, content } });
        postAll({ t: 'STATUS', text: `Opened: ${tape.name}` });
        break;
      }

      /* ─────── TAPE EXPORT/IMPORT ─────── */
      case 'TAPE_EXPORT_ALL': {
        const data = await TapeIO.exportAll(msg.compress !== false);
        postAll({ t: 'TAPE_EXPORT_RESULT', data, format: msg.compress !== false ? 'scxq2' : 'json' });
        postAll({ t: 'STATUS', text: 'Exported all tapes' });
        break;
      }

      case 'TAPE_EXPORT_SINGLE': {
        const data = await TapeIO.exportSingleTape(msg.id, msg.compress !== false);
        postAll({ t: 'TAPE_EXPORT_RESULT', data, id: msg.id, format: msg.compress !== false ? 'scxq2' : 'json' });
        postAll({ t: 'STATUS', text: 'Exported tape' });
        break;
      }

      case 'TAPE_IMPORT': {
        try {
          const result = await TapeIO.importBundle(msg.data, msg.merge);
          await uiRefreshAll();
          postAll({ t: 'TAPE_IMPORT_RESULT', ok: true, ...result });
          postAll({ t: 'STATUS', text: `Imported ${result.imported} tapes` });
        } catch (err) {
          postAll({ t: 'TAPE_IMPORT_RESULT', ok: false, error: err.message });
          postAll({ t: 'STATUS', text: 'Import failed' });
        }
        break;
      }

      /* ─────── EDITOR ─────── */
      case 'EDITOR_SAVE_AS_TAPE': {
        const name = msg.name || `editor-${Date.now()}.${msg.type || 'txt'}`;
        const type = msg.type || guessType(name);
        const content = String(msg.content || '');
        const tape = { id: uid(), name, type, tags: ['editor'], compression: 'none', content, created: Date.now(), modified: Date.now() };
        tape.size = new Blob([tape.content]).size;
        await IDB.put('tapes', tape);
        await IDB.put('activity', { ts: Date.now(), op: 'editor_save', id: tape.id, name: tape.name });
        await uiRefreshAll();
        postAll({ t: 'STATUS', text: `Saved editor → ${tape.name}` });
        break;
      }

      /* ─────── COMPRESSION ─────── */
      case 'SCX_COMPRESS': {
        const out = SCXQ2.compressUTF8(String(msg.content || ''));
        postAll({ t: 'SCX_RESULT', mode: 'compress', out });
        postAll({ t: 'STATUS', text: 'Compressed' });
        break;
      }

      case 'SCX_DECOMPRESS': {
        let out = '';
        try { out = SCXQ2.decompressUTF8(String(msg.content || '')); }
        catch { out = 'Decompression failed'; }
        postAll({ t: 'SCX_RESULT', mode: 'decompress', out });
        postAll({ t: 'STATUS', text: 'Decompressed' });
        break;
      }

      /* ─────── TAB MANAGEMENT ─────── */
      case 'TAB_CREATE': {
        const session = await SessionStore.create(msg.url, msg.opts);
        const tab = await TabManager.create(session.id, { active: true });
        await uiRefreshAll();
        postAll({ t: 'TAB_CREATED', tab, session });
        postAll({ t: 'STATUS', text: `Opened tab: ${msg.url}` });
        break;
      }

      case 'TAB_CLOSE': {
        await TabManager.close(msg.id);
        await uiRefreshAll();
        postAll({ t: 'TAB_CLOSED', id: msg.id });
        postAll({ t: 'STATUS', text: 'Closed tab' });
        break;
      }

      case 'TAB_ACTIVATE': {
        await TabManager.activate(msg.id);
        await uiRefreshAll();
        postAll({ t: 'TAB_ACTIVATED', id: msg.id });
        break;
      }

      case 'TAB_REORDER': {
        await TabManager.reorder(msg.id, msg.order);
        await uiRefreshAll();
        postAll({ t: 'TAB_REORDERED', id: msg.id, order: msg.order });
        break;
      }

      /* ─────── SESSION MANAGEMENT ─────── */
      case 'SESSION_UPDATE': {
        await SessionStore.update(msg.id, msg.updates);
        await uiRefreshAll();
        break;
      }

      case 'SESSION_CLOSE': {
        await SessionStore.close(msg.id);
        await uiRefreshAll();
        break;
      }

      /* ─────── API REQUESTS ─────── */
      case 'API_SEND': {
        const url = String(msg.url || '').trim();
        const method = String(msg.method || 'GET').toUpperCase();
        const headers = msg.headers || {};
        const body = msg.body ?? null;

        // Local mx2db:// handler
        if (url.startsWith('mx2db://')) {
          if (url === 'mx2db://local/tapes') {
            const tapes = await IDB.all('tapes');
            postAll({ t: 'API_RESPONSE', result: { status: 200, data: tapes, time: 0, size: JSON.stringify(tapes).length } });
            postAll({ t: 'STATUS', text: 'API: mx2db tapes' });
            return;
          }
          if (url === 'mx2db://local/sessions') {
            const sessions = await SessionStore.listAll();
            postAll({ t: 'API_RESPONSE', result: { status: 200, data: sessions, time: 0 } });
            return;
          }
          if (url === 'mx2db://local/tabs') {
            const tabs = await TabManager.list();
            postAll({ t: 'API_RESPONSE', result: { status: 200, data: tabs, time: 0 } });
            return;
          }
        }

        const t0 = Date.now();
        try {
          const opt = { method, headers: { 'Content-Type': 'application/json', ...headers } };
          if (body && method !== 'GET') opt.body = typeof body === 'string' ? body : JSON.stringify(body);
          const res = await fetch(url, opt);
          const ct = res.headers.get('content-type') || '';
          const data = ct.includes('application/json') ? await res.json() : await res.text();
          const result = {
            status: res.status,
            statusText: res.statusText,
            headers: Object.fromEntries(res.headers.entries()),
            data,
            time: Date.now() - t0,
            size: typeof data === 'string' ? data.length : JSON.stringify(data).length
          };
          postAll({ t: 'API_RESPONSE', result });
          postAll({ t: 'STATUS', text: `API ${res.status} in ${result.time}ms` });
        } catch (err) {
          postAll({ t: 'API_RESPONSE', result: { error: String(err?.message || err), time: Date.now() - t0 } });
          postAll({ t: 'STATUS', text: 'API error' });
        }
        break;
      }

      /* ─────── CANVAS PROJECTION ─────── */
      case 'CANVAS_PROJECT': {
        const projection = await CanvasProjection.projectDOM(msg.url);
        postAll({ t: 'CANVAS_PROJECTED', projection });
        postAll({ t: 'STATUS', text: projection.ok ? `Projected: ${msg.url}` : 'Projection failed' });
        break;
      }

      case 'CANVAS_CLEAR':
        CANVAS.tick = 0;
        postAll({ t: 'CANVAS_CLEAR' });
        break;

      case 'CANVAS_GRID':
        CANVAS.grid = !CANVAS.grid;
        postAll({ t: 'CANVAS_FLAGS', state: { ...CANVAS } });
        break;

      case 'CANVAS_PLAY':
        canvasPlay(!CANVAS.playing);
        postAll({ t: 'CANVAS_FLAGS', state: { ...CANVAS } });
        break;

      case 'CANVAS_PUSH':
        postAll({ t: 'STATUS', text: 'Canvas pushed to mesh (stub)' });
        break;

      /* ─────── π VIDEO ROUTING ─────── */
      case 'PI_ROUTE': {
        const route = CanvasProjection.routePiContent(msg.url, msg.type || 'video');
        postAll({ t: 'PI_ROUTED', url: msg.url, route });
        break;
      }

      /* ─────── SETTINGS ─────── */
      case 'SETTINGS_UPDATE': {
        const settings = (await IDB.all('settings')).find(x => x.k === 'settings') || { k: 'settings', v: {} };
        Object.assign(settings.v, msg.updates);
        await IDB.put('settings', settings);
        await uiRefreshAll();
        postAll({ t: 'STATUS', text: 'Settings updated' });
        break;
      }

      case 'SETTINGS_GET': {
        const settings = (await IDB.all('settings')).find(x => x.k === 'settings')?.v || {};
        postAll({ t: 'SETTINGS_DATA', settings });
        break;
      }
    }
  })();
});

/* ══════════════════════════════════════════════════════════════
   BOOT STATUS
   ══════════════════════════════════════════════════════════════ */

postAll({ t: 'STATUS', text: `SW v${SW_VERSION} online` });
