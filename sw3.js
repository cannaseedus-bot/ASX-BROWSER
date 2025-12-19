/* sw.js — BLACK CODE BROWSER Kernel Router + MX2DB + UI Bridge
   - Serves virtual files: /atomic.css /atomic.xjson /atomic.khl from manifest.json
   - Owns all application logic (tabs/views/tapes/api/canvas)
   - Minimal DOM bridge via postMessage (no extra JS files)
*/

const CACHE = 'blackcode-cache-v1';
const CORE = ['/', '/index.html', '/manifest.json', '/sw.js', '/atomic.css', '/atomic.xjson', '/atomic.khl'];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CORE.filter(Boolean));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    await self.clients.claim();
  })());
});

/* ------------------------------
   Manifest DB helpers (MX2DB in manifest.json)
------------------------------ */
async function getManifestJSON() {
  const res = await fetch('/manifest.json', { cache: 'no-cache' });
  return res.json();
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

async function virtualFromAtomicFold(pathname) {
  const m = await getManifestJSON();
  const fold = m?.atomic?.fold || {};
  const key = pathname.replace(/^\//, ''); // atomic.css / atomic.xjson / atomic.khl
  if (fold[key] == null) return null;

  if (key.endsWith('.css')) return textResponse(fold[key], 'text/css; charset=utf-8');
  if (key.endsWith('.xjson') || key.endsWith('.json')) return textResponse(fold[key], 'application/json; charset=utf-8');
  if (key.endsWith('.khl')) return textResponse(fold[key], 'text/plain; charset=utf-8');
  return textResponse(fold[key], 'text/plain; charset=utf-8');
}

/* ------------------------------
   SW Fetch Router
------------------------------ */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Virtual atomic endpoints
  if (url.origin === location.origin && (url.pathname === '/atomic.css' || url.pathname === '/atomic.xjson' || url.pathname === '/atomic.khl')) {
    event.respondWith((async () => {
      const v = await virtualFromAtomicFold(url.pathname);
      return v || new Response('Not found', { status: 404 });
    })());
    return;
  }

  // Cache-first for same-origin core assets
  if (url.origin === location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(event.request);
      if (cached) return cached;

      const res = await fetch(event.request);
      // cache GET only
      if (event.request.method === 'GET' && res.ok) cache.put(event.request, res.clone());
      return res;
    })());
    return;
  }

  // Cross-origin: network (optionally cache GET if enabled later)
  event.respondWith(fetch(event.request));
});

/* ------------------------------
   Client Bridge: DOM + App Logic
------------------------------ */
function postAll(msg) {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then(list => list.forEach(c => c.postMessage(msg)));
}

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

async function mx2dbStats() {
  const m = await getManifestJSON();
  const db = m.mx2db || {};
  const tapes = db.tapes || [];
  let totalSize = 0;
  for (const t of tapes) totalSize += (t.size || 0);
  const limit = db.storage_limit_bytes || (100 * 1024 * 1024);
  const usedMB = Math.round((totalSize / 1024 / 1024) * 100) / 100;
  const totalMB = Math.round((limit / 1024 / 1024) * 100) / 100;
  const pct = limit ? clamp((totalSize / limit) * 100, 0, 100) : 0;
  return { totalTapes: tapes.length, totalSize, usedMB, totalMB, pct, recentActivity: (db.activity || []).filter(a => Date.now() - a.ts < 86400000).length };
}

/* Note:
   Browsers do not allow a SW to write files back to manifest.json on disk.
   So "MX2DB in manifest" here is treated as the *authoritative schema + export*.
   Runtime storage uses IndexedDB; export/import uses the manifest schema.
*/
const IDB = {
  dbp: null,
  open() {
    if (this.dbp) return this.dbp;
    this.dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open('mx2db_blackcode', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('tapes')) db.createObjectStore('tapes', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'k' });
        if (!db.objectStoreNames.contains('endpoints')) db.createObjectStore('endpoints', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('activity')) db.createObjectStore('activity', { keyPath: 'ts' });
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
  }
};

/* ------------------------------
   SCXQ2 (safe placeholder): base64 pack/unpack
   (You can swap in your real SCXQ2 fieldmap/binary later)
------------------------------ */
const SCXQ2 = {
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
  }
};

function uid() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2));
}

function guessType(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (ext === 'js') return 'javascript';
  if (ext === 'htm' || ext === 'html') return 'html';
  if (ext === 'md') return 'markdown';
  if (['json','xml','css','javascript','html','markdown'].includes(ext)) return ext;
  return 'binary';
}

function typeIcon(type) {
  return ({ json:'{}', xml:'</>', html:'🌐', css:'🎨', javascript:'⚡', markdown:'📝', binary:'📦' }[type] || '📄');
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
}

/* ------------------------------
   UI messages
------------------------------ */
async function uiBoot() {
  // seed defaults from manifest into IDB if empty
  const m = await getManifestJSON();
  const settings = await IDB.all('settings');
  const endpoints = await IDB.all('endpoints');

  if (settings.length === 0 && m?.mx2db?.settings) {
    await IDB.put('settings', { k: 'settings', v: m.mx2db.settings });
  }
  if (endpoints.length === 0 && Array.isArray(m?.mx2db?.api_endpoints)) {
    for (const ep of m.mx2db.api_endpoints) await IDB.put('endpoints', ep);
  }

  // seed sample tapes if none
  const tapes = await IDB.all('tapes');
  if (tapes.length === 0) {
    const sample1 = {
      id: uid(),
      name: 'example.json',
      type: 'json',
      tags: ['sample','config','json'],
      compression: 'none',
      content: JSON.stringify({ app:'Black Code Browser', version:'1.0.0', features:['Tape Storage','API Explorer','Canvas','SCXQ2 Placeholder'], author:'ATOMIC ⊗ SW Kernel' }, null, 2),
      created: Date.now(), modified: Date.now()
    };
    sample1.size = new Blob([sample1.content]).size;

    const sample2 = {
      id: uid(),
      name: 'hello.html',
      type: 'html',
      tags: ['sample','html','demo'],
      compression: 'none',
      content: "<!doctype html><html><head><meta charset='utf-8'><title>Hello</title></head><body style='background:#020409;color:#16f2aa;font-family:monospace;padding:40px'><h1>Hello from Black Code Browser</h1><p>Stored as a tape.</p></body></html>",
      created: Date.now(), modified: Date.now()
    };
    sample2.size = new Blob([sample2.content]).size;

    await IDB.put('tapes', sample1);
    await IDB.put('tapes', sample2);
    await IDB.put('activity', { ts: Date.now(), op: 'seed_samples', note: 'Created sample tapes' });
  }

  await uiRefreshAll();
}

async function uiRefreshAll() {
  const tapes = await IDB.all('tapes');
  tapes.sort((a,b)=> (b.modified||0) - (a.modified||0));
  const endpoints = await IDB.all('endpoints');
  const settingsObj = (await IDB.all('settings')).find(x => x.k === 'settings')?.v || {};

  // dashboard stats from IDB
  let totalSize = tapes.reduce((s,t)=> s + (t.size||0), 0);
  const limit = (await getManifestJSON())?.mx2db?.storage_limit_bytes || (100 * 1024 * 1024);
  const usedMB = Math.round((totalSize/1024/1024)*100)/100;
  const totalMB = Math.round((limit/1024/1024)*100)/100;
  const pct = limit ? clamp((totalSize/limit)*100,0,100) : 0;

  postAll({
    t: 'UI_SYNC',
    settings: settingsObj,
    dashboard: {
      totalTapes: tapes.length,
      apiConnections: endpoints.length,
      compressionRatio: '—',        // will become real when SCXQ2 fieldmap/binary is wired
      recentActivity: (await IDB.all('activity')).filter(a => Date.now() - a.ts < 86400000).length,
      communityPosts: 0,
      systemStatus: 'OK',
      storage: { usedMB, totalMB, pct }
    },
    tapes: tapes.map(t => ({
      id: t.id, name: t.name, type: t.type, tags: t.tags || [],
      size: t.size || 0, modified: t.modified || 0, icon: typeIcon(t.type), sizeLabel: formatSize(t.size||0)
    })),
    endpoints
  });
}

/* ------------------------------
   Canvas: simple “mesh canvas” render loop driven by SW events
------------------------------ */
const CANVAS = {
  grid: true,
  playing: false,
  tick: 0
};

function canvasFrame() {
  CANVAS.tick++;
  postAll({ t:'CANVAS_FRAME', state:{...CANVAS} });
}

let canvasTimer = null;
function canvasPlay(on) {
  CANVAS.playing = !!on;
  if (CANVAS.playing) {
    if (canvasTimer) clearInterval(canvasTimer);
    canvasTimer = setInterval(canvasFrame, 50);
  } else {
    if (canvasTimer) clearInterval(canvasTimer);
    canvasTimer = null;
  }
}

/* ------------------------------
   Message handling (UI -> SW)
------------------------------ */
self.addEventListener('message', (e) => {
  const msg = e.data || {};
  (async () => {
    switch (msg.t) {
      case 'BOOT':
        await uiBoot();
        postAll({ t:'STATUS', text:'Ready' });
        break;

      case 'NAV':
        // purely informational; UI handles showing views
        postAll({ t:'STATUS', text:`Switched to ${msg.view || 'view'}` });
        break;

      case 'SEARCH':
        // UI will filter locally; here we can add future mesh search
        postAll({ t:'STATUS', text:`Search: ${msg.q || ''}` });
        break;

      case 'TAPE_CREATE': {
        const name = String(msg.name || '').trim();
        if (!name) return postAll({ t:'STATUS', text:'Tape create failed: missing name' });

        const type = msg.type || guessType(name);
        let content = String(msg.content || '');
        const compression = msg.compression || 'none';
        const tags = Array.isArray(msg.tags) ? msg.tags : String(msg.tags||'').split(',').map(s=>s.trim()).filter(Boolean);

        if (compression === 'scxq2' && content) content = SCXQ2.compressUTF8(content);

        const tape = {
          id: uid(), name, type, tags,
          compression,
          content,
          created: Date.now(),
          modified: Date.now()
        };
        tape.size = new Blob([tape.content]).size;
        await IDB.put('tapes', tape);
        await IDB.put('activity', { ts: Date.now(), op:'tape_create', id:tape.id, name:tape.name });

        await uiRefreshAll();
        postAll({ t:'STATUS', text:`Created tape: ${name}` });
        break;
      }

      case 'TAPE_DELETE': {
        const id = msg.id;
        if (!id) return;
        await IDB.del('tapes', id);
        await IDB.put('activity', { ts: Date.now(), op:'tape_delete', id });
        await uiRefreshAll();
        postAll({ t:'STATUS', text:`Deleted tape` });
        break;
      }

      case 'TAPE_OPEN': {
        const tapes = await IDB.all('tapes');
        const t = tapes.find(x => x.id === msg.id);
        if (!t) return;
        postAll({ t:'TAPE_OPENED', tape: t });
        postAll({ t:'STATUS', text:`Opened: ${t.name}` });
        break;
      }

      case 'EDITOR_SAVE_AS_TAPE': {
        const name = msg.name || `editor-${Date.now()}.${msg.type||'txt'}`;
        const type = msg.type || guessType(name);
        const content = String(msg.content || '');
        const tape = { id: uid(), name, type, tags:['editor'], compression:'none', content, created: Date.now(), modified: Date.now() };
        tape.size = new Blob([tape.content]).size;
        await IDB.put('tapes', tape);
        await IDB.put('activity', { ts: Date.now(), op:'editor_save', id:tape.id, name:tape.name });
        await uiRefreshAll();
        postAll({ t:'STATUS', text:`Saved editor → ${tape.name}` });
        break;
      }

      case 'SCX_COMPRESS': {
        const raw = String(msg.content || '');
        const out = SCXQ2.compressUTF8(raw);
        postAll({ t:'SCX_RESULT', mode:'compress', out });
        postAll({ t:'STATUS', text:'Compressed' });
        break;
      }

      case 'SCX_DECOMPRESS': {
        const b64 = String(msg.content || '');
        let out = '';
        try { out = SCXQ2.decompressUTF8(b64); } catch { out = 'Decompression failed'; }
        postAll({ t:'SCX_RESULT', mode:'decompress', out });
        postAll({ t:'STATUS', text:'Decompressed' });
        break;
      }

      case 'API_SEND': {
        const url = String(msg.url || '').trim();
        const method = String(msg.method || 'GET').toUpperCase();
        const headers = msg.headers || {};
        const body = msg.body ?? null;

        // local mx2db:// handler
        if (url.startsWith('mx2db://')) {
          if (url === 'mx2db://local/tapes') {
            const tapes = await IDB.all('tapes');
            postAll({ t:'API_RESPONSE', result: { status:200, data:tapes, time:0, size:JSON.stringify(tapes).length } });
            postAll({ t:'STATUS', text:'API: mx2db tapes' });
            return;
          }
        }

        const t0 = Date.now();
        try {
          const opt = { method, headers: { 'Content-Type':'application/json', ...headers } };
          if (body && method !== 'GET') opt.body = (typeof body === 'string') ? body : JSON.stringify(body);
          const res = await fetch(url, opt);
          const ct = res.headers.get('content-type') || '';
          const data = ct.includes('application/json') ? await res.json() : await res.text();
          const result = { status: res.status, statusText: res.statusText, headers: Object.fromEntries(res.headers.entries()), data, time: Date.now() - t0, size: (typeof data === 'string' ? data.length : JSON.stringify(data).length) };
          postAll({ t:'API_RESPONSE', result });
          postAll({ t:'STATUS', text:`API ${res.status} in ${result.time}ms` });
        } catch (err) {
          postAll({ t:'API_RESPONSE', result: { error: String(err?.message || err), time: Date.now() - t0 } });
          postAll({ t:'STATUS', text:'API error' });
        }
        break;
      }

      /* Canvas controls */
      case 'CANVAS_CLEAR':
        CANVAS.tick = 0;
        postAll({ t:'CANVAS_CLEAR' });
        break;
      case 'CANVAS_GRID':
        CANVAS.grid = !CANVAS.grid;
        postAll({ t:'CANVAS_FLAGS', state:{...CANVAS} });
        break;
      case 'CANVAS_PLAY':
        canvasPlay(!CANVAS.playing);
        postAll({ t:'CANVAS_FLAGS', state:{...CANVAS} });
        break;
      case 'CANVAS_PUSH':
        // stub: future mesh.broadcast with your KLH mesh routes
        postAll({ t:'STATUS', text:'Canvas pushed to mesh (stub)' });
        break;
    }
  })();
});

/* ------------------------------
   UI Helper: Auto-send initial STATUS
------------------------------ */
postAll({ t:'STATUS', text:'SW online' });
