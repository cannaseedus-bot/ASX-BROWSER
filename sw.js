/* ═══════════════════════════════════════════════════════════════════════════════
   sw.js — K'UHUL π KERNEL (SEALED)
   ASX / MX2LM / BLACK CODE BROWSER
   ═══════════════════════════════════════════════════════════════════════════════

   ARCHITECTURE:
   ┌─────────────────────────────────────────────────────────────┐
   │                        index.html                           │
   │                (Ghost Shell / Canvas / UI)                  │
   │   - No logic, No authority, All actions → sw.js             │
   └───────────────────────▲─────────────────────────────────────┘
                           │ fetch / postMessage
   ┌───────────────────────┴─────────────────────────────────────┐
   │                         sw.js                                │
   │                  K'UHUL π KERNEL (SEALED)                    │
   └───────────────────────┬─────────────────────────────────────┘
                           │ localhost (optional)
   ┌───────────────────────┴─────────────────────────────────────┐
   │                  mx2lm-host.exe (OPTIONAL)                  │
   │        Python / Native Acceleration / Model Bridge           │
   └─────────────────────────────────────────────────────────────┘

   SECTIONS:
   [0] Kernel Header & Law
   [1] Immutable Kernel Constants
   [2] IDB Storage Layer
   [3] Manifest Projection Engine
   [4] JavaCrypt Execution Firewall
   [5] π-K'UHUL Cluster Runtime
   [6] Optional Native Host Bridge (mx2lm-host.exe)
   [7] Internal REST / Message Router
   [8] Fetch Strategy & Cache
   [9] Lifecycle & Boot Sequencing
   [10] Message / Agent Bridge
   [11] Stable Stringify + Hash (FNV-1a)
   [12] Audit Log (Hash-Chain Journal)
   [13] JavaCrypt Opcode Contract v1
   [14] JavaCrypt Dispatch Table (Audited)
   [15] Research Agent Registry
   [16] Research Routes & Implementations
   [17] Research Glyphs (PART D)
   [18] Proxy Bridge Client (PART E)
   [19] Unified Runtime v4.1 (K'UHUL π Core Loop)

   ═══════════════════════════════════════════════════════════════════════════════ */

/// <reference lib="webworker" />
/* global self, clients, indexedDB, caches, fetch, Response, Headers, Blob, URL, TextEncoder, TextDecoder, Worker */

'use strict';

/* ═══════════════════════════════════════════════════════════════════════════════
   [0] KERNEL HEADER & LAW
   ═══════════════════════════════════════════════════════════════════════════════ */

const SYSTEM_MODE = "FIELD_ONLY";

if (SYSTEM_MODE !== "FIELD_ONLY") {
  throw new Error("Tensor-based inference is forbidden. K'UHUL π operates in FIELD_ONLY mode.");
}

/**
 * SYSTEM LAW (LOCKED):
 * MODEL ≠ FILE       TOKENS = GLYPHS      TRUTH = EVENT
 * MODEL ≠ GPU        THOUGHT = SIGNAL     VALIDITY = INVARIANT
 * MODEL ≠ TOKENS     MODEL = FIELD        ANSWER = CLUSTER COLLAPSE
 */

const KUHUL_KERNEL_ID = "kuhul-pi-" + Date.now().toString(36);
const KUHUL_KERNEL_VERSION = "1.2.5";

/* ═══════════════════════════════════════════════════════════════════════════════
   [1] IMMUTABLE KERNEL CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════════ */

const KERNEL = Object.freeze({
  v: KUHUL_KERNEL_VERSION,
  id: KUHUL_KERNEL_ID,
  name: "K'UHUL π KERNEL",
  build: "mx2lm-blackcode-kernel",
  mode: SYSTEM_MODE,

  // Glyph Table (compressed weight carriers)
  glyphs: Object.freeze({
    "@":   { base: 1.0 },
    "@@":  { base: 2.0 },
    "@@@": { base: 3.0 },
    "π":   { base: Math.PI },
    "φ":   { base: 1.6180339887 },
    "e":   { base: Math.E },
    "τ":   { base: Math.PI * 2 },
    "⤍":   { base: 0.87 },
    "↻":   { base: 0.93 },
    "⟲":   { base: 0.76 },
  }),

  // Optional native host ports
  hostCandidates: Object.freeze([
    "http://127.0.0.1:8081",   // kuhul_pi_merged_runtime.py default
    "http://127.0.0.1:61680",
    "http://127.0.0.1:61681",
  ]),

  // Cache names
  cache: Object.freeze({
    staticName: `mx2lm-static-v${KUHUL_KERNEL_VERSION}`,
    runtimeName: `mx2lm-runtime-v${KUHUL_KERNEL_VERSION}`,
    projectionName: `mx2lm-projection-v${KUHUL_KERNEL_VERSION}`,
    researchName: `mx2lm-research-v${KUHUL_KERNEL_VERSION}`,
  }),

  // JavaCrypt sandbox limits
  limits: Object.freeze({
    maxPayloadBytes: 256 * 1024,
    maxResultBytes: 256 * 1024,
    maxExecMs: 1200,
    maxOps: 10_000,
    maxJobsInFlight: 64,
    maxTapeSize: 1024 * 1024, // 1MB per tape
    maxQueryLen: 280,
    maxResults: 10,
    maxFetchMs: 12_000,
    maxBytes: 300_000,
  }),

  // Kernel API routes
  routes: Object.freeze({
    manifest: "/manifest.json",
    apiPrefix: "/_mx2/api",
    exec: "/_mx2/api/exec",
    clusterRun: "/_mx2/api/cluster/run",
    clusterStatus: "/_mx2/api/cluster/status",
    hostProbe: "/_mx2/api/host/probe",
    hostProxy: "/_mx2/api/host/proxy",
    storageGet: "/_mx2/api/storage/get",
    storagePut: "/_mx2/api/storage/put",
    piEmit: "/_mx2/api/pi/emit",
    piInfer: "/_mx2/api/pi/infer",
    auditExport: "/_mx2/api/audit/export",
  }),

  // Research config
  research: Object.freeze({
    mode: 'PROXY', // 'DIRECT' | 'PROXY'
    proxyBase: '/api/research',
    allowlistDomains: Object.freeze([
      'en.wikipedia.org',
      'api.github.com',
      'raw.githubusercontent.com',
      'hnrss.org',
      'www.reddit.com',
      'rss.nytimes.com',
    ]),
  }),

  // SCXQ2 field map for compression
  fieldMap: Object.freeze({
    'id': 0x01, 'name': 0x02, 'type': 0x03, 'content': 0x04,
    'tags': 0x05, 'created': 0x06, 'modified': 0x07, 'size': 0x08,
    'compression': 0x09, 'version': 0x0A, 'author': 0x0B, 'meta': 0x0C
  }),
});

// Kernel state (mutable runtime state)
const KernelState = {
  tapes: new Map(),
  agents: new Map(),
  metrics: {
    messages: 0,
    fetches: 0,
    errors: 0,
  },
};

/* ═══════════════════════════════════════════════════════════════════════════════
   [2] IDB STORAGE LAYER
   ═══════════════════════════════════════════════════════════════════════════════ */

const utf8 = {
  enc: new TextEncoder(),
  dec: new TextDecoder(),
};

const DB = {
  name: "mx2lm_kernel_db",
  v: 3,
  stores: {
    kv: "kv",
    tapes: "tapes",
    sessions: "sessions",
    tabs: "tabs",
    activity: "activity",
    endpoints: "endpoints",
    settings: "settings",
    projectionCache: "projectionCache",
    audit: "audit",
  },
};

let _dbPromise = null;

function openDB() {
  if (_dbPromise) return _dbPromise;

  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB.name, DB.v);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of Object.values(DB.stores)) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name);
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return _dbPromise;
}

// Shorthand IDB helpers
function idb_tx(db, store, mode = 'readonly') {
  return db.transaction(store, mode).objectStore(store);
}

function idb_get(db, store, key) {
  return new Promise((resolve, reject) => {
    const req = idb_tx(db, store).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idb_put(db, store, key, val) {
  return new Promise((resolve, reject) => {
    const req = idb_tx(db, store, 'readwrite').put(val, key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

function idb_del(db, store, key) {
  return new Promise((resolve, reject) => {
    const req = idb_tx(db, store, 'readwrite').delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

function idb_all(db, store) {
  return new Promise((resolve, reject) => {
    const req = idb_tx(db, store).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

// Async wrappers
async function idbGet(store, key) {
  const db = await openDB();
  return idb_get(db, store, key);
}

async function idbPut(store, key, value) {
  const db = await openDB();
  return idb_put(db, store, key, value);
}

async function idbDel(store, key) {
  const db = await openDB();
  return idb_del(db, store, key);
}

async function idbAll(store) {
  const db = await openDB();
  return idb_all(db, store);
}

async function idbClear(store) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const req = idb_tx(db, store, 'readwrite').clear();
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════════
   [17] RESEARCH GLYPHS (PART D)
   ═══════════════════════════════════════════════════════════════════════════════ */

const RESEARCH_GLYPHS = Object.freeze({
  '🧭': { op: 'research.search',  route: '/research/search' },
  '🔎': { op: 'research.source',  route: '/research/source' },
  '🧾': { op: 'research.audit',   route: '/research/audit' },
  '🧠': { op: 'research.agents',  route: '/research/agents' },
  '📚': { source: 'wikipedia' },
  '🐙': { source: 'github' },
  '📰': { source: 'rss' },
});

// Packet Model (Auditable Envelope)
function createPacket(op, query, source, n = 10, mode = 'DIRECT', meta = {}) {
  return {
    '⟁v': 1,
    '@t': Date.now(),
    '@op': op,
    '@q': safeText(query, KERNEL.limits.maxQueryLen),
    '@source': source,
    '@n': clampInt(n, 1, KERNEL.limits.maxResults, 10),
    '@mode': mode,
    '@meta': meta,
  };
}

// SHA-256 Proof (via SubtleCrypto)
async function sha256Proof(packet) {
  const json = stable_stringify(packet);
  const data = utf8.enc.encode(json);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return { proof: 'sha256:' + hex, packet };
}

// Cache Key for research packets
function researchCacheKey(packet) {
  return `research:${packet['@source']}:${packet['@q']}:${packet['@n']}`;
}

// Glyph Router: emoji → route/source
function glyphRoute(glyph) {
  return RESEARCH_GLYPHS[glyph] || null;
}

// Resolve glyph to research packet
function resolveGlyph(glyph, query, n = 10) {
  const def = glyphRoute(glyph);
  if (!def) return null;

  if (def.source) {
    return createPacket('research.fetch', query, def.source, n, KERNEL.research.mode);
  }
  if (def.op && def.route) {
    return createPacket(def.op, query, 'router', n, 'DIRECT');
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   [11] STABLE STRINGIFY + HASH (FNV-1a)
   ═══════════════════════════════════════════════════════════════════════════════ */

function stable_stringify(obj) {
  if (obj === null || obj === undefined) return String(obj);
  if (typeof obj !== 'object') return JSON.stringify(obj);

  if (Array.isArray(obj)) {
    return '[' + obj.map(stable_stringify).join(',') + ']';
  }

  const keys = Object.keys(obj).sort();
  return '{' + keys.map(k => JSON.stringify(k) + ':' + stable_stringify(obj[k])).join(',') + '}';
}

// FNV-1a 32-bit (fast, deterministic, no dependencies)
function hash_str(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return 'fnv1a32:' + h.toString(16).padStart(8, '0');
}

/* ═══════════════════════════════════════════════════════════════════════════════
   [12] AUDIT LOG (HASH-CHAIN JOURNAL)
   ═══════════════════════════════════════════════════════════════════════════════ */

const AUDIT = {
  enabled: true,
  chain_head: 'GENESIS',
  log: [],
  max: 2048,
};

function audit_event(type, payload, meta = {}) {
  if (!AUDIT.enabled) return null;

  const entry = {
    t: Date.now(),
    type,
    payload: payload ?? null,
    meta: {
      ...meta,
      kernel: KUHUL_KERNEL_ID,
      version: KUHUL_KERNEL_VERSION
    },
    prev: AUDIT.chain_head,
  };

  // Hash chain: head = H(prev + canonical(entry w/o hash))
  entry.hash = hash_str(entry.prev + '|' + stable_stringify({
    t: entry.t, type: entry.type, payload: entry.payload, meta: entry.meta, prev: entry.prev
  }));

  AUDIT.chain_head = entry.hash;

  AUDIT.log.push(entry);
  if (AUDIT.log.length > AUDIT.max) AUDIT.log.shift();

  return entry;
}

function audit_export(limit = 256) {
  return {
    ok: true,
    head: AUDIT.chain_head,
    log: AUDIT.log.slice(-limit),
    kernel: KUHUL_KERNEL_ID,
    version: KUHUL_KERNEL_VERSION,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════════
   [13] JAVACRYPT OPCODE CONTRACT v1
   ═══════════════════════════════════════════════════════════════════════════════ */

const JAVACRYPT = {
  v: 1,
  allowlist: new Set([
    'kernel.ping',
    'audit.export',
    'tape.put',
    'tape.get',
    'tape.list',
    'cluster.run',
    'cluster.status',
    'agent.spawn',
    'agent.list',
    'research.fetch',
    'research.search',
    'pi.emit',
    'pi.infer',
    'host.probe',
    'manifest.get',
    'manifest.patch',
  ])
};

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function validate_opcode(block) {
  assert(block && typeof block === 'object', 'JavaCrypt: opcode must be object');
  assert(typeof block.op === 'string', 'JavaCrypt: missing op');
  assert(JAVACRYPT.allowlist.has(block.op), `JavaCrypt: op not allowed → ${block.op}`);
  assert(block.v === JAVACRYPT.v, `JavaCrypt: bad v (expected ${JAVACRYPT.v})`);
  assert(block.id && typeof block.id === 'string', 'JavaCrypt: missing id');
  assert(block.t && Number.isFinite(block.t), 'JavaCrypt: missing t');
  assert(block.payload === undefined || typeof block.payload === 'object', 'JavaCrypt: payload must be object');
  return true;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   [3] MANIFEST PROJECTION ENGINE
   ═══════════════════════════════════════════════════════════════════════════════ */

const MANIFEST_KEY = "manifest.mutable";
const MANIFEST_SEED_KEY = "manifest.seed.cached";

function deepMerge(a, b) {
  if (a && b && typeof a === "object" && typeof b === "object") {
    const out = Array.isArray(a) ? a.slice() : { ...a };
    for (const k of Object.keys(b)) {
      const av = out[k];
      const bv = b[k];
      if (av && bv && typeof av === "object" && typeof bv === "object" && !Array.isArray(bv)) {
        out[k] = deepMerge(av, bv);
      } else {
        out[k] = bv;
      }
    }
    return out;
  }
  return b ?? a;
}

async function getSeedManifest() {
  const cached = await idbGet(DB.stores.kv, MANIFEST_SEED_KEY);
  if (cached) return cached;

  try {
    const url = new URL(KERNEL.routes.manifest, self.location.origin);
    url.searchParams.set("__seed", "1");
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (res.ok) {
      const seed = await res.json();
      await idbPut(DB.stores.kv, MANIFEST_SEED_KEY, seed);
      return seed;
    }
  } catch { /* fallback below */ }

  // Minimal seed fallback
  return {
    name: "MX2LM OS — K'UHUL π",
    short_name: "MX2LM",
    version: KERNEL.v,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#16f2aa",
    description: "K'UHUL π three-file OS (index.html + sw.js + manifest.json)",
    icons: [],
    mx2: {
      law: "ASX = XCFE = XJSON = KUHUL = AST = ATOMIC_BLOCK",
      kernel: { v: KERNEL.v, mode: KERNEL.mode },
      tapes: { index: [], byId: {} },
      settings: {},
      session: { canvasTabs: [], activeTab: null },
    },
    atomic: {
      fold: {
        "atomic.css": `:root{--bg:#020617;--fg:#e6fffa;--accent:#16f2aa}`,
        "atomic.xjson": `{"version":"${KERNEL.v}","mode":"${KERNEL.mode}"}`,
      }
    }
  };
}

async function getDynamicManifest() {
  const seed = await getSeedManifest();
  const mutable = (await idbGet(DB.stores.kv, MANIFEST_KEY)) || {};
  return deepMerge(seed, mutable);
}

async function patchMutableManifest(patchObj) {
  const cur = (await idbGet(DB.stores.kv, MANIFEST_KEY)) || {};
  const next = deepMerge(cur, patchObj);
  await idbPut(DB.stores.kv, MANIFEST_KEY, next);
  audit_event('manifest.patch', { keys: Object.keys(patchObj) });
  return next;
}

async function virtualFromAtomicFold(pathname) {
  const m = await getDynamicManifest();
  if (!m?.atomic?.fold) return null;

  const fold = m.atomic.fold;
  const key = pathname.replace(/^\//, '');

  if (fold[key] == null) return null;

  const content = fold[key];
  const ct = key.endsWith('.css') ? 'text/css; charset=utf-8'
           : key.endsWith('.json') || key.endsWith('.xjson') ? 'application/json; charset=utf-8'
           : key.endsWith('.html') ? 'text/html; charset=utf-8'
           : 'text/plain; charset=utf-8';

  return new Response(content, {
    status: 200,
    headers: { "Content-Type": ct, "Cache-Control": "no-store" }
  });
}

/* ═══════════════════════════════════════════════════════════════════════════════
   [4] JAVACRYPT EXECUTION FIREWALL (Worker-based sandbox)
   ═══════════════════════════════════════════════════════════════════════════════ */

const JavaCryptWorker = (() => {
  let execWorker = null;
  let execWorkerBusy = false;

  function bytesOf(obj) {
    try {
      return utf8.enc.encode(typeof obj === "string" ? obj : JSON.stringify(obj)).byteLength;
    } catch {
      return Infinity;
    }
  }

  function ensureWorker() {
    if (execWorker) return execWorker;

    const workerSource = `
      // JavaCrypt Worker — sandboxed execution
      // NO DOM. NO network. NO importScripts.
      const ENC = new TextEncoder();

      function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

      // π-KUHUL op interpreter (glyph-weighted)
      function runProgram(prog, limits) {
        const started = Date.now();
        const maxOps = limits.maxOps || 10000;

        const S = { vars: Object.create(null), out: [] };
        const ops = Array.isArray(prog.ops) ? prog.ops : [];

        for (let i = 0; i < ops.length; i++) {
          if (i > maxOps) throw new Error("maxOps exceeded");
          if (Date.now() - started > (limits.maxExecMs || 1200)) throw new Error("timeout");

          const op = ops[i] || {};
          const t = op.op;

          if (t === "set") {
            S.vars[String(op.k || "")] = op.v;
          } else if (t === "push") {
            S.out.push(op.v);
          } else if (t === "math.add") {
            S.out.push(Number(op.a || 0) + Number(op.b || 0));
          } else if (t === "math.mul") {
            S.out.push(Number(op.a || 0) * Number(op.b || 0));
          } else if (t === "math.sin") {
            S.out.push(Math.sin(Number(op.a || 0)));
          } else if (t === "math.pi") {
            S.out.push(Math.PI * Number(op.factor || 1));
          } else if (t === "glyph.weight") {
            const glyphTable = {
              "@": 1.0, "@@": 2.0, "@@@": 3.0,
              "π": Math.PI, "φ": 1.6180339887, "e": Math.E,
              "τ": Math.PI * 2, "⤍": 0.87, "↻": 0.93, "⟲": 0.76
            };
            S.out.push(glyphTable[op.glyph] || 0);
          } else if (t === "tokenize.pi") {
            const n = clamp(Number(op.n || 24), 1, 256);
            const seed = Number(op.seed || 1);
            const glyphs = ["@", "@@", "@@@", "π", "φ", "e", "τ", "⤍", "↻", "⟲"];
            const tokens = [];
            for (let j = 0; j < n; j++) {
              const g = glyphs[(seed + j * 7) % glyphs.length];
              const strength = Math.abs(Math.sin(seed + j));
              tokens.push({ glyph: g, strength, phase: j });
            }
            S.out.push({ tokens });
          } else {
            throw new Error("op_not_allowed:" + t);
          }
        }

        return { vars: S.vars, out: S.out, ms: Date.now() - started };
      }

      self.onmessage = (ev) => {
        const msg = ev.data || {};
        const id = msg.id;
        try {
          if (msg.type !== "exec") throw new Error("bad_type");
          const result = runProgram(msg.program || {}, msg.limits || {});
          const bytes = ENC.encode(JSON.stringify(result)).byteLength;
          if (bytes > (msg.limits?.maxResultBytes || 262144)) throw new Error("result_too_large");
          self.postMessage({ id, ok: true, result });
        } catch (e) {
          self.postMessage({ id, ok: false, error: String(e?.message || e) });
        }
      };
    `;

    const blob = new Blob([workerSource], { type: "application/javascript" });
    execWorker = new Worker(URL.createObjectURL(blob));
    return execWorker;
  }

  async function exec(program, caps = {}) {
    const payloadBytes = bytesOf(program);
    if (payloadBytes > KERNEL.limits.maxPayloadBytes) {
      throw new Error("payload_too_large");
    }

    if (execWorkerBusy) {
      throw new Error("executor_busy");
    }
    execWorkerBusy = true;

    const worker = ensureWorker();
    const id = "jc_" + Math.random().toString(16).slice(2);

    const limits = {
      maxExecMs: KERNEL.limits.maxExecMs,
      maxOps: KERNEL.limits.maxOps,
      maxResultBytes: KERNEL.limits.maxResultBytes,
    };

    const res = await new Promise((resolve) => {
      const onMsg = (ev) => {
        const msg = ev.data || {};
        if (msg.id !== id) return;
        worker.removeEventListener("message", onMsg);
        resolve(msg);
      };
      worker.addEventListener("message", onMsg);
      worker.postMessage({ id, type: "exec", program, limits });

      setTimeout(() => {
        worker.removeEventListener("message", onMsg);
        resolve({ id, ok: false, error: "timeout_host" });
      }, limits.maxExecMs + 200);
    });

    execWorkerBusy = false;

    if (!res.ok) throw new Error(res.error || "exec_failed");
    return res.result;
  }

  return { exec, bytesOf };
})();

/* ═══════════════════════════════════════════════════════════════════════════════
   [5] π-K'UHUL CLUSTER RUNTIME
   ═══════════════════════════════════════════════════════════════════════════════ */

const Cluster = (() => {
  const state = {
    boot: Date.now(),
    jobsTotal: 0,
    jobsOk: 0,
    jobsFail: 0,
    inFlight: 0,
    workers: [],
    rr: 0,
  };

  function init(n = 4) {
    state.workers = [];
    for (let i = 0; i < n; i++) {
      state.workers.push({
        id: i,
        state: "ready",
        jobsOk: 0,
        jobsFail: 0,
        lastMs: 0,
      });
    }
    audit_event('cluster.init', { workers: n });
  }

  async function runJob(job) {
    if (state.inFlight >= KERNEL.limits.maxJobsInFlight) {
      return { ok: false, error: "cluster_backpressure" };
    }

    const worker = state.workers[state.rr % state.workers.length];
    state.rr++;
    state.inFlight++;
    state.jobsTotal++;
    worker.state = "busy";

    try {
      const result = await JavaCryptWorker.exec(job.program || {}, job.caps || {});
      worker.jobsOk++;
      worker.lastMs = result.ms || 0;
      state.jobsOk++;
      return { ok: true, worker: worker.id, result };
    } catch (e) {
      worker.jobsFail++;
      state.jobsFail++;
      return { ok: false, worker: worker.id, error: String(e?.message || e) };
    } finally {
      worker.state = "ready";
      state.inFlight--;
    }
  }

  async function runBatch(jobs = []) {
    const started = Date.now();
    const results = [];
    const concurrency = Math.min(state.workers.length, 8);
    let idx = 0;

    async function pump() {
      while (idx < jobs.length) {
        const j = jobs[idx++];
        const r = await runJob(j);
        results.push(r);
      }
    }

    const runners = [];
    for (let i = 0; i < concurrency; i++) runners.push(pump());
    await Promise.all(runners);

    const elapsed = (Date.now() - started) / 1000;
    const okCount = results.filter((r) => r.ok).length;

    return {
      ok: true,
      total: jobs.length,
      completed: okCount,
      failed: jobs.length - okCount,
      elapsed_s: Math.round(elapsed * 100) / 100,
      throughput: elapsed > 0 ? Math.round((jobs.length / elapsed) * 10) / 10 : 0,
      results,
    };
  }

  function status() {
    return {
      ok: true,
      kernel: KERNEL.v,
      mode: KERNEL.mode,
      up_s: Math.floor((Date.now() - state.boot) / 1000),
      workers: state.workers.length,
      inFlight: state.inFlight,
      jobsTotal: state.jobsTotal,
      jobsOk: state.jobsOk,
      jobsFail: state.jobsFail,
      workerStates: state.workers.map((w) => ({
        id: w.id,
        state: w.state,
        jobsOk: w.jobsOk,
        jobsFail: w.jobsFail,
        lastMs: w.lastMs,
      })),
    };
  }

  function piEmit(query, steps = 24) {
    const seed = query.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
    const glyphKeys = Object.keys(KERNEL.glyphs);
    const tokens = [];

    for (let i = 0; i < steps; i++) {
      const glyph = glyphKeys[(seed + i * 7) % glyphKeys.length];
      const strength = Math.abs(Math.sin(seed + i)) * KERNEL.glyphs[glyph].base;
      tokens.push({ glyph, strength, phase: i });
    }

    return tokens;
  }

  return { init, runJob, runBatch, status, piEmit };
})();

/* ═══════════════════════════════════════════════════════════════════════════════
   [6] OPTIONAL NATIVE HOST BRIDGE
   ═══════════════════════════════════════════════════════════════════════════════ */

const Host = (() => {
  let cached = { ok: false, base: null, ts: 0 };

  async function probe(force = false) {
    const ttl = 5000;
    if (!force && cached.ts && Date.now() - cached.ts < ttl) return cached;

    for (const base of KERNEL.hostCandidates) {
      try {
        const res = await fetch(base + "/", { method: "GET" });
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          cached = { ok: true, base, ts: Date.now(), runtime: data.runtime || "unknown" };
          audit_event('host.probe', { base, ok: true });
          return cached;
        }
      } catch { /* continue */ }
    }
    cached = { ok: false, base: null, ts: Date.now() };
    return cached;
  }

  async function proxy(path, init) {
    const p = await probe(false);
    if (!p.ok) return { ok: false, error: "host_not_found" };

    const url = p.base + path;
    try {
      const res = await fetch(url, init);
      const ct = res.headers.get("content-type") || "application/octet-stream";
      const buf = await res.arrayBuffer();
      return { ok: res.ok, status: res.status, contentType: ct, body: buf };
    } catch (e) {
      return { ok: false, error: String(e?.message || e) };
    }
  }

  async function infer(query, events = [], ticks = 50) {
    const p = await probe(false);
    if (!p.ok) {
      const tokens = Cluster.piEmit(query, 24);
      return {
        ok: true,
        local: true,
        answer: "Local π emission (no host)",
        tokens,
        confidence: 0.5,
        agents: tokens.length,
      };
    }

    try {
      const res = await fetch(p.base + "/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, events, ticks }),
      });
      const data = await res.json();
      return { ok: true, local: false, ...data };
    } catch (e) {
      return { ok: false, error: String(e?.message || e) };
    }
  }

  return { probe, proxy, infer };
})();

/* ═══════════════════════════════════════════════════════════════════════════════
   [15] RESEARCH AGENT REGISTRY
   ═══════════════════════════════════════════════════════════════════════════════ */

const AgentBus = (() => {
  const agents = new Map();
  const log = [];

  function logEvent(evt) {
    log.push({ t: Date.now(), ...evt });
    if (log.length > 400) log.shift();
  }

  function register(def) {
    agents.set(def.id, {
      ...def,
      state: 'idle',
      calls: 0,
      lastMs: 0,
      lastAt: 0,
      errors: 0,
    });
    logEvent({ k: 'agent.register', id: def.id, caps: def.caps || [] });
    KernelState.agents.set(def.id, def);
    return def.id;
  }

  async function run(id, input, runner) {
    const a = agents.get(id);
    if (!a) throw new Error(`Unknown agent: ${id}`);

    a.state = 'processing';
    a.calls++;
    a.lastAt = Date.now();
    logEvent({ k: 'agent.start', id, input: { q: safeText(input.q, 64) } });

    const t0 = Date.now();
    try {
      const out = await runner(a, input);
      a.lastMs = Date.now() - t0;
      a.state = 'idle';
      logEvent({ k: 'agent.ok', id, ms: a.lastMs, n: out?.items?.length ?? 0 });
      return out;
    } catch (e) {
      a.lastMs = Date.now() - t0;
      a.state = 'idle';
      a.errors++;
      logEvent({ k: 'agent.err', id, ms: a.lastMs, err: String(e?.message || e) });
      throw e;
    }
  }

  function list() {
    return [...agents.values()].map(({ runner, ...rest }) => rest);
  }

  function getAudit() {
    return log.slice(-200);
  }

  return { register, run, list, getAudit };
})();

// Register research agents
AgentBus.register({ id: 'agent.research.router', caps: ['research.dispatch', 'normalize.results'] });
AgentBus.register({ id: 'agent.research.wikipedia', caps: ['source.wikipedia', 'summary'] });
AgentBus.register({ id: 'agent.research.github', caps: ['source.github', 'repos', 'issues'] });
AgentBus.register({ id: 'agent.research.rss', caps: ['source.rss', 'headlines'] });

/* ═══════════════════════════════════════════════════════════════════════════════
   [14] JAVACRYPT DISPATCH TABLE (AUDITED)
   ═══════════════════════════════════════════════════════════════════════════════ */

const JavaCryptOps = {
  'kernel.ping': async () => ({
    ok: true,
    kernel: KUHUL_KERNEL_ID,
    version: KUHUL_KERNEL_VERSION,
    head: AUDIT.chain_head
  }),

  'audit.export': async () => audit_export(),

  'tape.put': async ({ tape_id, tape }) => {
    assert(typeof tape_id === 'string' && tape_id.length < 256, 'tape.put: invalid tape_id');
    const size = stable_stringify(tape).length;
    assert(size <= KERNEL.limits.maxTapeSize, `tape.put: tape too large (${size})`);

    const db = await openDB();
    await idb_put(db, 'tapes', tape_id, tape);

    KernelState.tapes.set(tape_id, { size, t: Date.now() });
    return { ok: true, tape_id, size };
  },

  'tape.get': async ({ tape_id }) => {
    assert(typeof tape_id === 'string', 'tape.get: invalid tape_id');
    const db = await openDB();
    const tape = await idb_get(db, 'tapes', tape_id);
    return { ok: true, tape_id, tape: tape ?? null };
  },

  'tape.list': async () => {
    const db = await openDB();
    const keys = await new Promise((resolve, reject) => {
      const req = idb_tx(db, 'tapes').getAllKeys();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
    return { ok: true, tapes: keys };
  },

  'cluster.run': async ({ job }) => {
    assert(job && typeof job === 'object', 'cluster.run: missing job');
    const result = await Cluster.runJob(job);
    return { ok: true, ...result };
  },

  'cluster.status': async () => Cluster.status(),

  'agent.spawn': async ({ agent }) => {
    assert(agent && typeof agent === 'object', 'agent.spawn: missing agent');
    assert(typeof agent.id === 'string', 'agent.spawn: agent.id required');
    AgentBus.register(agent);
    return { ok: true, id: agent.id };
  },

  'agent.list': async () => ({
    ok: true,
    agents: [...KernelState.agents.keys()]
  }),

  'research.search': async ({ q, n }) => {
    const input = { q: safeText(q, KERNEL.limits.maxQueryLen), n: clampInt(n, 1, KERNEL.limits.maxResults, 10) };
    const out = await AgentBus.run('agent.research.router', input, researchDispatch);
    return { ok: true, query: input.q, items: normalizeItems(out.items) };
  },

  'pi.emit': async ({ query, steps }) => {
    const tokens = Cluster.piEmit(query || '', steps || 24);
    return { ok: true, tokens };
  },

  'pi.infer': async ({ query, events, ticks }) => {
    return Host.infer(query || '', events || [], ticks || 50);
  },

  'host.probe': async () => Host.probe(true),

  'manifest.get': async () => ({ ok: true, manifest: await getDynamicManifest() }),

  'manifest.patch': async ({ patch }) => {
    assert(patch && typeof patch === 'object', 'manifest.patch: invalid patch');
    await patchMutableManifest(patch);
    return { ok: true };
  },
};

async function javacrypt_execute(block) {
  validate_opcode(block);

  audit_event('javacrypt.call', { op: block.op, id: block.id }, { client: block.client ?? 'unknown' });

  const handler = JavaCryptOps[block.op];
  assert(typeof handler === 'function', `JavaCrypt: missing handler for ${block.op}`);

  const result = await handler(block.payload || {});
  audit_event('javacrypt.result', { op: block.op, id: block.id, ok: !!result?.ok });

  return result;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   [16] RESEARCH ROUTES & IMPLEMENTATIONS
   ═══════════════════════════════════════════════════════════════════════════════ */

function safeText(s, maxLen) {
  const t = String(s ?? '').trim();
  return t.length > maxLen ? t.slice(0, maxLen) : t;
}

function clampInt(n, lo, hi, fallback) {
  const x = Number.parseInt(String(n ?? ''), 10);
  if (Number.isFinite(x)) return Math.max(lo, Math.min(hi, x));
  return fallback;
}

function isAllowedUrl(u) {
  try {
    const url = new URL(u);
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      KERNEL.research.allowlistDomains.includes(url.hostname)
    );
  } catch {
    return false;
  }
}

async function fetchWithTimeout(url, init = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort('timeout'), KERNEL.limits.maxFetchMs);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(t);
  }
}

function normalizeItems(items) {
  return (items || [])
    .filter(Boolean)
    .slice(0, KERNEL.limits.maxResults)
    .map((x) => ({
      title: safeText(x.title ?? x.name ?? 'Untitled', 120),
      url: safeText(x.url ?? x.html_url ?? '', 500),
      snippet: safeText(x.snippet ?? x.description ?? '', 240),
      source: safeText(x.source ?? 'unknown', 40),
      published: x.published ?? null,
    }));
}

async function researchDispatch(_agent, input) {
  const jobs = [
    AgentBus.run('agent.research.wikipedia', input, researchWikipedia),
    AgentBus.run('agent.research.github', input, researchGitHub),
  ];

  const settled = await Promise.allSettled(jobs);
  const merged = [];
  for (const s of settled) {
    if (s.status === 'fulfilled' && Array.isArray(s.value?.items)) merged.push(...s.value.items);
  }

  const seen = new Set();
  const items = [];
  for (const it of merged) {
    const u = String(it.url || '');
    if (!u || seen.has(u)) continue;
    seen.add(u);
    items.push(it);
    if (items.length >= input.n) break;
  }

  return { items };
}

async function researchWikipedia(_agent, input) {
  if (KERNEL.research.mode === 'PROXY') {
    return proxyCall('wikipedia', input);
  }

  const u = new URL('https://en.wikipedia.org/w/api.php');
  u.searchParams.set('action', 'opensearch');
  u.searchParams.set('search', input.q);
  u.searchParams.set('limit', String(input.n));
  u.searchParams.set('namespace', '0');
  u.searchParams.set('format', 'json');
  u.searchParams.set('origin', '*');

  const res = await fetchWithTimeout(u.toString());
  if (!res.ok) throw new Error(`Wikipedia HTTP ${res.status}`);
  const data = await res.json();

  const titles = data?.[1] || [];
  const snippets = data?.[2] || [];
  const urls = data?.[3] || [];

  const items = titles.map((t, i) => ({
    title: t,
    url: urls[i],
    snippet: snippets[i],
    source: 'wikipedia',
  }));

  return { items };
}

async function researchGitHub(_agent, input) {
  if (KERNEL.research.mode === 'PROXY') {
    return proxyCall('github', input);
  }

  const u = new URL('https://api.github.com/search/repositories');
  u.searchParams.set('q', input.q);
  u.searchParams.set('per_page', String(Math.min(input.n, 10)));

  const res = await fetchWithTimeout(u.toString(), {
    headers: { 'accept': 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
  const data = await res.json();

  const items = (data.items || []).map((r) => ({
    title: r.full_name,
    url: r.html_url,
    snippet: r.description || '',
    source: 'github',
    published: r.pushed_at || null,
  }));

  return { items };
}

async function proxyCall(source, input) {
  const u = new URL(`${KERNEL.research.proxyBase}/${encodeURIComponent(source)}`, self.location.origin);

  const res = await fetchWithTimeout(u.toString(), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ q: input.q, n: input.n }),
  });

  if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`);

  const txt = await res.text();
  if (txt.length > KERNEL.limits.maxBytes) throw new Error('Proxy payload too large');

  const data = JSON.parse(txt);
  return { items: data.items || [] };
}

/* ═══════════════════════════════════════════════════════════════════════════════
   [18] PROXY BRIDGE CLIENT (PART E)
   ═══════════════════════════════════════════════════════════════════════════════ */

const ProxyBridge = (() => {
  let hostBase = null;
  let lastProbe = 0;

  async function probeHost(force = false) {
    const ttl = 10000;
    if (!force && hostBase && Date.now() - lastProbe < ttl) {
      return { ok: true, base: hostBase };
    }

    for (const base of KERNEL.hostCandidates) {
      try {
        const res = await fetchWithTimeout(base + '/', { method: 'GET' });
        if (res.ok) {
          hostBase = base;
          lastProbe = Date.now();
          return { ok: true, base };
        }
      } catch { /* continue */ }
    }

    hostBase = null;
    return { ok: false, base: null };
  }

  async function send(packet) {
    const probe = await probeHost();
    if (!probe.ok) {
      return { ok: false, error: 'host_unavailable', packet };
    }

    // Generate proof before sending
    const { proof } = await sha256Proof(packet);

    const payload = {
      packet,
      proof,
      kernel: KUHUL_KERNEL_ID,
      t: Date.now(),
    };

    try {
      const res = await fetchWithTimeout(probe.base + '/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`);

      const data = await res.json();

      // Verify response has expected structure
      if (!verifyResponse(data, packet)) {
        throw new Error('Response verification failed');
      }

      audit_event('proxy.success', { op: packet['@op'], source: packet['@source'] });
      return { ok: true, ...data };
    } catch (e) {
      audit_event('proxy.error', { op: packet['@op'], error: String(e?.message || e) });
      return { ok: false, error: String(e?.message || e), packet };
    }
  }

  function verifyResponse(data, packet) {
    // Basic structural verification
    if (!data || typeof data !== 'object') return false;
    if (data.error) return true; // Error responses are valid
    if (!Array.isArray(data.items)) return false;

    // Verify items don't exceed requested count
    if (data.items.length > packet['@n'] + 2) return false;

    return true;
  }

  async function execGlyph(glyph, query, n = 10) {
    const packet = resolveGlyph(glyph, query, n);
    if (!packet) {
      return { ok: false, error: 'invalid_glyph', glyph };
    }

    // Check cache first
    const cacheKey = researchCacheKey(packet);
    const cache = await caches.open(KERNEL.cache.researchName);
    const cached = await cache.match(cacheKey);

    if (cached) {
      const age = Date.now() - parseInt(cached.headers.get('x-cached-at') || '0');
      if (age < 300000) { // 5 min cache
        const data = await cached.json();
        return { ok: true, cached: true, ...data };
      }
    }

    // Execute via proxy or direct
    let result;
    if (packet['@mode'] === 'PROXY') {
      result = await send(packet);
    } else {
      // Direct mode: use AgentBus
      const input = { q: packet['@q'], n: packet['@n'] };
      const source = packet['@source'];

      if (source === 'wikipedia') {
        result = await AgentBus.run('agent.research.wikipedia', input, researchWikipedia);
      } else if (source === 'github') {
        result = await AgentBus.run('agent.research.github', input, researchGitHub);
      } else {
        result = await AgentBus.run('agent.research.router', input, researchDispatch);
      }
      result = { ok: true, items: result.items || [] };
    }

    // Cache successful results
    if (result.ok && result.items) {
      const headers = new Headers({
        'Content-Type': 'application/json',
        'x-cached-at': Date.now().toString(),
      });
      const body = JSON.stringify({ items: result.items, packet });
      await cache.put(cacheKey, new Response(body, { headers }));
    }

    return result;
  }

  return { probeHost, send, execGlyph, verifyResponse };
})();

/* ═══════════════════════════════════════════════════════════════════════════════
   [19] UNIFIED RUNTIME v4.1 (K'UHUL π CORE LOOP)
   ═══════════════════════════════════════════════════════════════════════════════ */

const UnifiedRuntime = (() => {
  // Glyph weight table (flat lookup)
  const GLYPH = Object.freeze({
    '@': 1.0, '@@': 2.0, '@@@': 3.0,
    'π': Math.PI, 'φ': 1.618, 'e': Math.E,
    'τ': Math.PI * 2, '⤍': 0.87, '↻': 0.93, '⟲': 0.76,
  });

  // Agent state container
  const agents = new Map();
  const eventQueue = [];
  const clusters = [];
  let tickCount = 0;

  // Create agent (atomic block)
  function createAgent(id, glyphs = ['@'], meta = {}) {
    const agent = {
      id,
      glyphs,
      state: {
        activation: 0,
        energy: 1.0,
        phase: 0,
      },
      meta,
      events: [],
      created: Date.now(),
    };
    agents.set(id, agent);
    return agent;
  }

  // Pop: invoke agent from queue
  function pop() {
    return eventQueue.shift() || null;
  }

  // Wo: mutate agent state
  function wo(agent, mutation) {
    if (!agent) return;
    Object.assign(agent.state, mutation);
    agent.state.phase++;
  }

  // Sek: sequence event
  function sek(event) {
    eventQueue.push({
      t: Date.now(),
      tick: tickCount,
      ...event,
    });
  }

  // Emit: propagate signal from agent
  function emit(agent) {
    if (!agent) return;
    const signal = {
      from: agent.id,
      activation: agent.state.activation,
      energy: agent.state.energy,
      glyphs: agent.glyphs,
      t: Date.now(),
    };
    agent.events.push(signal);
    sek({ type: 'emit', agent: agent.id, signal });
    audit_event('runtime.emit', { agent: agent.id, activation: agent.state.activation });
  }

  // Tick agent: update activation based on glyph weights
  function tickAgent(agent) {
    if (!agent) return;

    // Sum glyph weights
    const weight = agent.glyphs.reduce((sum, g) => sum + (GLYPH[g] || 0), 0);

    // Update activation (accumulate)
    agent.state.activation += weight * 0.01;

    // Decay energy
    agent.state.energy *= 0.99;

    // Emit if activation threshold crossed
    if (agent.state.activation > 1) {
      emit(agent);
      agent.state.activation *= 0.5; // Reset after emit
    }
  }

  // Detect clusters: find agents with similar activation patterns
  function detectClusters() {
    const active = [...agents.values()].filter(a => a.state.activation > 0.3);
    if (active.length < 2) return [];

    const detected = [];
    const used = new Set();

    for (const a of active) {
      if (used.has(a.id)) continue;

      const cluster = [a];
      used.add(a.id);

      for (const b of active) {
        if (used.has(b.id)) continue;

        // Cluster if activation difference < 0.2
        const diff = Math.abs(a.state.activation - b.state.activation);
        if (diff < 0.2) {
          cluster.push(b);
          used.add(b.id);
        }
      }

      if (cluster.length >= 2) {
        detected.push({
          id: 'cluster-' + Date.now().toString(36),
          agents: cluster.map(x => x.id),
          avgActivation: cluster.reduce((s, x) => s + x.state.activation, 0) / cluster.length,
          t: Date.now(),
        });
      }
    }

    clusters.push(...detected);
    return detected;
  }

  // Collapse: produce answer from cluster
  function collapse(cluster) {
    if (!cluster || !cluster.agents?.length) return null;

    const members = cluster.agents.map(id => agents.get(id)).filter(Boolean);
    if (!members.length) return null;

    // Compute weighted answer
    const totalWeight = members.reduce((s, a) => {
      return s + a.glyphs.reduce((gs, g) => gs + (GLYPH[g] || 0), 0);
    }, 0);

    const answer = {
      cluster: cluster.id,
      agents: cluster.agents,
      weight: totalWeight,
      activation: cluster.avgActivation,
      collapsed: true,
      t: Date.now(),
    };

    audit_event('runtime.collapse', { cluster: cluster.id, weight: totalWeight });
    return answer;
  }

  // Main clock: tick all agents
  function tick() {
    tickCount++;

    // Process event queue
    let event = pop();
    while (event) {
      // Handle event based on type
      if (event.type === 'spawn') {
        createAgent(event.id, event.glyphs, event.meta);
      }
      event = pop();
    }

    // Tick all agents
    for (const agent of agents.values()) {
      tickAgent(agent);
    }

    // Detect and process clusters
    const newClusters = detectClusters();
    const answers = newClusters.map(collapse).filter(Boolean);

    return {
      tick: tickCount,
      agents: agents.size,
      clusters: newClusters.length,
      answers,
    };
  }

  // Run N ticks
  function run(n = 1) {
    const results = [];
    for (let i = 0; i < n; i++) {
      results.push(tick());
    }
    return {
      ticks: n,
      final: results[results.length - 1],
      answers: results.flatMap(r => r.answers),
    };
  }

  // Status
  function status() {
    return {
      tickCount,
      agents: agents.size,
      clusters: clusters.length,
      queueLength: eventQueue.length,
      agentList: [...agents.keys()],
    };
  }

  // Spawn agent via event
  function spawn(id, glyphs = ['@'], meta = {}) {
    sek({ type: 'spawn', id, glyphs, meta });
    return id;
  }

  return {
    GLYPH,
    createAgent,
    spawn,
    tick,
    run,
    status,
    detectClusters,
    collapse,
    pop,
    wo,
    sek,
    emit,
  };
})();

/* ═══════════════════════════════════════════════════════════════════════════════
   [7] INTERNAL REST / MESSAGE ROUTER
   ═══════════════════════════════════════════════════════════════════════════════ */

function jsonResponse(obj, status = 200, headers = {}) {
  const body = utf8.enc.encode(JSON.stringify(obj, null, 2));
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      ...headers,
    },
  });
}

function badRequest(message) {
  return jsonResponse({ ok: false, error: message }, 400);
}

function notFound(message = "Not found") {
  return jsonResponse({ ok: false, error: message }, 404);
}

async function handleResearch(req, url) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405);
  }

  if (url.pathname === '/research/agents') {
    return jsonResponse({ ok: true, mode: KERNEL.research.mode, agents: AgentBus.list() });
  }

  if (url.pathname === '/research/audit') {
    return jsonResponse({ ok: true, audit: AgentBus.getAudit() });
  }

  if (url.pathname === '/research/search') {
    let q = url.searchParams.get('q');
    let n = url.searchParams.get('n');

    if (req.method === 'POST') {
      try {
        const body = await req.json();
        q = q ?? body?.q;
        n = n ?? body?.n;
      } catch { /* ignore */ }
    }

    q = safeText(q, KERNEL.limits.maxQueryLen);
    if (!q) return badRequest('Missing q');

    const maxResults = clampInt(n, 1, KERNEL.limits.maxResults, KERNEL.limits.maxResults);
    const input = { q, n: maxResults };

    const out = await AgentBus.run('agent.research.router', input, researchDispatch);
    return jsonResponse({ ok: true, query: input.q, items: normalizeItems(out.items) });
  }

  return notFound('Unknown research route');
}

async function handleApi(req) {
  const url = new URL(req.url);
  const path = url.pathname;

  async function readJson() {
    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return null;
    const txt = await req.text();
    if (!txt) return null;
    return JSON.parse(txt);
  }

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Audit export
  if (path === KERNEL.routes.auditExport && req.method === "GET") {
    return jsonResponse(audit_export());
  }

  // Storage
  if (path === KERNEL.routes.storageGet && req.method === "GET") {
    const key = url.searchParams.get("key") || "";
    const v = await idbGet(DB.stores.kv, key);
    return jsonResponse({ ok: true, key, value: v ?? null });
  }
  if (path === KERNEL.routes.storagePut && req.method === "POST") {
    const body = (await readJson()) || {};
    if (!body.key) return badRequest("missing_key");
    await idbPut(DB.stores.kv, String(body.key), body.value);
    audit_event('storage.put', { key: body.key });
    return jsonResponse({ ok: true });
  }

  // JavaCrypt Exec
  if (path === KERNEL.routes.exec && req.method === "POST") {
    const body = (await readJson()) || {};
    if (!body.program) return badRequest("missing_program");
    try {
      const result = await JavaCryptWorker.exec(body.program, body.caps || {});
      return jsonResponse({ ok: true, result });
    } catch (e) {
      return jsonResponse({ ok: false, error: String(e?.message || e) }, 500);
    }
  }

  // Cluster
  if (path === KERNEL.routes.clusterRun && req.method === "POST") {
    const body = (await readJson()) || {};
    if (Array.isArray(body.batch)) {
      const out = await Cluster.runBatch(body.batch);
      return jsonResponse(out);
    }
    const out = await Cluster.runJob(body);
    return jsonResponse(out);
  }
  if (path === KERNEL.routes.clusterStatus && req.method === "GET") {
    return jsonResponse(Cluster.status());
  }

  // π Emit
  if (path === KERNEL.routes.piEmit && req.method === "POST") {
    const body = (await readJson()) || {};
    const tokens = Cluster.piEmit(body.query || "", body.steps || 24);
    return jsonResponse({ ok: true, tokens });
  }

  // π Infer
  if (path === KERNEL.routes.piInfer && req.method === "POST") {
    const body = (await readJson()) || {};
    const result = await Host.infer(body.query || "", body.events || [], body.ticks || 50);
    return jsonResponse(result);
  }

  // Host
  if (path === KERNEL.routes.hostProbe && req.method === "GET") {
    const out = await Host.probe(true);
    return jsonResponse(out);
  }
  if (path === KERNEL.routes.hostProxy && req.method === "POST") {
    const body = (await readJson()) || {};
    const proxyPath = String(body.path || "");
    if (!proxyPath.startsWith("/")) return badRequest("path_must_start_with_slash");
    const init = {
      method: body.method || "POST",
      headers: { "Content-Type": "application/json" },
      body: body.body ? JSON.stringify(body.body) : undefined,
    };
    const prox = await Host.proxy(proxyPath, init);
    if (!prox.ok) return jsonResponse(prox, 502);

    return new Response(prox.body, {
      status: prox.status || 200,
      headers: {
        "Content-Type": prox.contentType || "application/octet-stream",
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  return notFound("unknown_api_route");
}

/* ═══════════════════════════════════════════════════════════════════════════════
   [8] FETCH STRATEGY & CACHE
   ═══════════════════════════════════════════════════════════════════════════════ */

async function handleFetch(event) {
  const req = event.request;
  const url = new URL(req.url);

  KernelState.metrics.fetches++;

  // Health check
  if (url.pathname === '/health') {
    return jsonResponse({ ok: true, kernel: KERNEL.v, t: Date.now(), head: AUDIT.chain_head });
  }

  // Research routes
  if (url.pathname.startsWith('/research/')) {
    return handleResearch(req, url);
  }

  // Only same-origin routing
  if (url.origin !== self.location.origin) {
    return fetchWithProjection(req, url);
  }

  // Kernel API
  if (url.pathname.startsWith(KERNEL.routes.apiPrefix)) {
    return handleApi(req);
  }

  // Dynamic manifest
  if (url.pathname === KERNEL.routes.manifest && !url.searchParams.has("__seed")) {
    const dyn = await getDynamicManifest();
    return jsonResponse(dyn, 200, { "Content-Type": "application/manifest+json; charset=utf-8" });
  }

  // Virtual atomic endpoints
  const virtualPaths = ['/atomic.css', '/atomic.xjson', '/atomic.khl', '/atomic.html'];
  if (virtualPaths.includes(url.pathname)) {
    const v = await virtualFromAtomicFold(url.pathname);
    return v || new Response('Not found', { status: 404 });
  }

  // π projection routes
  if (url.pathname.startsWith('/π/') || url.searchParams.has('π')) {
    const piType = url.pathname.split('/')[2] || url.searchParams.get('π');
    const targetUrl = url.searchParams.get('url') || url.pathname.split('/').slice(3).join('/');
    return jsonResponse({
      ok: true,
      projection: { type: piType, url: targetUrl, renderer: `canvas-${piType}` }
    });
  }

  // Cache-first for same-origin
  const cache = await caches.open(KERNEL.cache.staticName);
  const cached = await cache.match(req);
  if (cached) return cached;

  const res = await fetch(req);
  if (req.method === "GET" && res.ok) {
    cache.put(req, res.clone()).catch(() => {});
  }
  return res;
}

async function fetchWithProjection(request, url) {
  const projectionCache = await caches.open(KERNEL.cache.projectionName);

  const cached = await projectionCache.match(request);
  if (cached) {
    const age = Date.now() - parseInt(cached.headers.get('x-cached-at') || '0');
    if (age < 300000) return cached;
  }

  try {
    const res = await fetch(request);

    if (res.ok && request.method === 'GET') {
      const clone = res.clone();
      const headers = new Headers(clone.headers);
      headers.set('x-cached-at', Date.now().toString());
      headers.set('x-kernel-version', KERNEL.v);

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
    if (cached) return cached;
    throw err;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════════
   [9] LIFECYCLE & BOOT SEQUENCING
   ═══════════════════════════════════════════════════════════════════════════════ */

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(KERNEL.cache.staticName);
    await cache.addAll([
      "/",
      KERNEL.routes.manifest + "?__seed=1",
      "/sw.js",
    ]);

    Cluster.init(4);
    audit_event('kernel.install', { v: KERNEL.v });

    const existing = await idbGet(DB.stores.kv, MANIFEST_KEY);
    if (!existing) {
      await patchMutableManifest({
        mx2: {
          kernel: { v: KERNEL.v, mode: KERNEL.mode, installed_at: Date.now() },
          session: { canvasTabs: [], activeTab: null },
          host: { enabled: true },
        },
      });
    }

    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    await self.clients.claim();

    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith('mx2lm-') && !Object.values(KERNEL.cache).includes(k))
          .map(k => caches.delete(k))
    );

    Host.probe(false).catch(() => {});
    audit_event('kernel.activate', { v: KERNEL.v });

    const list = await self.clients.matchAll({ includeUncontrolled: true });
    for (const c of list) {
      c.postMessage({
        type: "mx2.kernel.ready",
        kernel: { v: KERNEL.v, name: KERNEL.name, mode: KERNEL.mode, id: KUHUL_KERNEL_ID }
      });
    }
  })());
});

/* ═══════════════════════════════════════════════════════════════════════════════
   [10] MESSAGE / AGENT BRIDGE (SEALED OPCODE ONLY)
   ═══════════════════════════════════════════════════════════════════════════════ */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function postAll(msg) {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then(list => list.forEach(c => c.postMessage(msg)));
}

self.addEventListener("message", (event) => {
  KernelState.metrics.messages++;

  const source = event.source;
  const data = event.data;

  Promise.resolve().then(async () => {
    if (!data || typeof data !== 'object') throw new Error('Invalid message');

    // JavaCrypt opcode blocks (sealed interface)
    if (data.__javacrypt__ === true) {
      const block = { ...data, client: source?.id || 'client' };
      const result = await javacrypt_execute(block);
      source?.postMessage({ ok: true, id: block.id, result });
      return;
    }

    // Legacy message interface (for compatibility)
    const msg = data;

    if (msg.type === "mx2.ping") {
      source?.postMessage({ type: "mx2.pong", kernel: { v: KERNEL.v, mode: KERNEL.mode, id: KUHUL_KERNEL_ID } });
      return;
    }

    if (msg.type === "mx2.manifest.patch") {
      await patchMutableManifest(msg.patch || {});
      source?.postMessage({ type: "mx2.manifest.patched", ok: true });
      return;
    }

    if (msg.type === "mx2.session.setCanvasTabs") {
      await patchMutableManifest({
        mx2: { session: { canvasTabs: msg.tabs || [], activeTab: msg.activeTab ?? null } },
      });
      source?.postMessage({ type: "mx2.session.saved", ok: true });
      return;
    }

    if (msg.type === "mx2.exec") {
      try {
        const result = await JavaCryptWorker.exec(msg.program || {}, msg.caps || {});
        source?.postMessage({ type: "mx2.exec.result", ok: true, result, rid: msg.rid });
      } catch (e) {
        source?.postMessage({ type: "mx2.exec.result", ok: false, error: String(e), rid: msg.rid });
      }
      return;
    }

    if (msg.type === "mx2.pi.infer") {
      const result = await Host.infer(msg.query || "", msg.events || [], msg.ticks || 50);
      source?.postMessage({ type: "mx2.pi.result", ...result, rid: msg.rid });
      return;
    }

    if (msg.type === "mx2.pi.emit") {
      const tokens = Cluster.piEmit(msg.query || "", msg.steps || 24);
      source?.postMessage({ type: "mx2.pi.tokens", ok: true, tokens, rid: msg.rid });
      return;
    }

    if (msg.type === "mx2.host.probe") {
      const out = await Host.probe(true);
      source?.postMessage({ type: "mx2.host.status", ...out });
      return;
    }

    if (msg.type === "mx2.cluster.status") {
      source?.postMessage({ type: "mx2.cluster.info", ...Cluster.status() });
      return;
    }

    if (msg.type === "mx2.audit.export") {
      source?.postMessage({ type: "mx2.audit.data", ...audit_export() });
      return;
    }

    if (msg.type === "BOOT" || msg.type === "mx2.boot") {
      source?.postMessage({
        type: "mx2.kernel.ready",
        kernel: { v: KERNEL.v, name: KERNEL.name, mode: KERNEL.mode, id: KUHUL_KERNEL_ID },
        glyphs: Object.keys(KERNEL.glyphs),
      });
      postAll({ t: 'STATUS', text: `K'UHUL π Kernel v${KERNEL.v} ready` });
      return;
    }

    // Legacy UI compat
    if (msg.t === 'NAV') {
      postAll({ t: 'STATUS', text: `Switched to ${msg.view || 'view'}` });
      return;
    }
    if (msg.t === 'SEARCH') {
      postAll({ t: 'STATUS', text: `Search: ${msg.q || ''}` });
      return;
    }

    // Unknown
    if (msg.type || msg.t) {
      source?.postMessage({ type: "mx2.kernel.error", ok: false, error: "unknown_message", got: msg.type || msg.t });
    }
  }).catch((err) => {
    KernelState.metrics.errors++;
    source?.postMessage({ ok: false, error: err.message || String(err) });
  });
});

/* ═══════════════════════════════════════════════════════════════════════════════
   FETCH HOOK
   ═══════════════════════════════════════════════════════════════════════════════ */

self.addEventListener("fetch", (event) => {
  event.respondWith(handleFetch(event));
});

/* ═══════════════════════════════════════════════════════════════════════════════
   KERNEL BOOT COMPLETE
   ═══════════════════════════════════════════════════════════════════════════════ */

Cluster.init(4);
audit_event('kernel.boot', { v: KERNEL.v, id: KUHUL_KERNEL_ID });
postAll({ t: 'STATUS', text: `K'UHUL π Kernel v${KERNEL.v} loaded` });
