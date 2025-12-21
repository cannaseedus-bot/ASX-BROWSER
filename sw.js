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

   ═══════════════════════════════════════════════════════════════════════════════ */

/// <reference lib="webworker" />
/* global self, clients, indexedDB, caches, fetch, Response, Headers, Blob, URL, TextEncoder, TextDecoder, Worker */

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

/* ═══════════════════════════════════════════════════════════════════════════════
   [1] IMMUTABLE KERNEL CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════════ */

const KERNEL = Object.freeze({
  v: "1.2.3",
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
    staticName: "mx2lm-static-v1.2.3",
    runtimeName: "mx2lm-runtime-v1.2.3",
    projectionName: "mx2lm-projection-v1.2.3",
  }),

  // JavaCrypt sandbox limits
  limits: Object.freeze({
    maxPayloadBytes: 256 * 1024,
    maxResultBytes: 256 * 1024,
    maxExecMs: 1200,
    maxOps: 10_000,
    maxJobsInFlight: 64,
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
  }),

  // SCXQ2 field map for compression
  fieldMap: Object.freeze({
    'id': 0x01, 'name': 0x02, 'type': 0x03, 'content': 0x04,
    'tags': 0x05, 'created': 0x06, 'modified': 0x07, 'size': 0x08,
    'compression': 0x09, 'version': 0x0A, 'author': 0x0B, 'meta': 0x0C
  }),
});

/* ═══════════════════════════════════════════════════════════════════════════════
   [2] IDB STORAGE LAYER
   ═══════════════════════════════════════════════════════════════════════════════ */

const utf8 = {
  enc: new TextEncoder(),
  dec: new TextDecoder(),
};

const DB = {
  name: "mx2lm_kernel_db",
  v: 2,
  stores: {
    kv: "kv",
    tapes: "tapes",
    sessions: "sessions",
    tabs: "tabs",
    activity: "activity",
    endpoints: "endpoints",
    settings: "settings",
    projectionCache: "projectionCache",
  },
};

function idbOpen() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB.name, DB.v);
    req.onupgradeneeded = () => {
      const db = req.result;
      // Create all stores
      for (const [name] of Object.entries(DB.stores)) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name);
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(store, key) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const os = tx.objectStore(store);
    const req = os.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(store, key, value) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const os = tx.objectStore(store);
    const req = os.put(value, key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

async function idbDel(store, key) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const os = tx.objectStore(store);
    const req = os.delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

async function idbAll(store) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const os = tx.objectStore(store);
    const req = os.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function idbAllKeys(store) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readonly");
    const os = tx.objectStore(store);
    const req = os.getAllKeys();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function idbClear(store) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(store, "readwrite");
    const os = tx.objectStore(store);
    const req = os.clear();
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
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
  return next;
}

// Virtual file serving from atomic.fold
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
   [4] JAVACRYPT EXECUTION FIREWALL
   ═══════════════════════════════════════════════════════════════════════════════ */

const JavaCrypt = (() => {
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
            // Return glyph base weight
            const glyphTable = {
              "@": 1.0, "@@": 2.0, "@@@": 3.0,
              "π": Math.PI, "φ": 1.6180339887, "e": Math.E,
              "τ": Math.PI * 2, "⤍": 0.87, "↻": 0.93, "⟲": 0.76
            };
            S.out.push(glyphTable[op.glyph] || 0);
          } else if (t === "tokenize.pi") {
            // π token emission
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
      const result = await JavaCrypt.exec(job.program || {}, job.caps || {});
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

  // π Token Emission (NO TOKENIZER)
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
   [6] OPTIONAL NATIVE HOST BRIDGE (mx2lm-host.exe / kuhul_pi_merged_runtime.py)
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

  // Forward inference to Python host
  async function infer(query, events = [], ticks = 50) {
    const p = await probe(false);
    if (!p.ok) {
      // Fallback: run locally via Cluster
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

  // CORS preflight
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
    return jsonResponse({ ok: true });
  }

  // JavaCrypt Exec
  if (path === KERNEL.routes.exec && req.method === "POST") {
    const body = (await readJson()) || {};
    if (!body.program) return badRequest("missing_program");
    try {
      const result = await JavaCrypt.exec(body.program, body.caps || {});
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

  // π Infer (uses Host if available)
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

  // Only same-origin routing
  if (url.origin !== self.location.origin) {
    // Cross-origin with projection cache for CORS bypass
    return fetchWithProjection(req, url);
  }

  // Kernel API
  if (url.pathname.startsWith(KERNEL.routes.apiPrefix)) {
    return handleApi(req);
  }

  // Dynamic manifest (unless seed fetch)
  if (url.pathname === KERNEL.routes.manifest && !url.searchParams.has("__seed")) {
    const dyn = await getDynamicManifest();
    return jsonResponse(dyn, 200, {
      "Content-Type": "application/manifest+json; charset=utf-8",
    });
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
      projection: {
        type: piType,
        url: targetUrl,
        renderer: `canvas-${piType}`
      }
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

// Projection cache for cross-origin (CORS bypass via caching)
async function fetchWithProjection(request, url) {
  const projectionCache = await caches.open(KERNEL.cache.projectionName);

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
    // Precache minimal assets
    const cache = await caches.open(KERNEL.cache.staticName);
    await cache.addAll([
      "/",
      KERNEL.routes.manifest + "?__seed=1",
      "/sw.js",
    ]);

    // Boot cluster
    Cluster.init(4);

    // Seed dynamic manifest if not present
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

    // Clean old caches
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k.startsWith('mx2lm-') && !Object.values(KERNEL.cache).includes(k))
          .map(k => caches.delete(k))
    );

    // Probe host in background
    Host.probe(false).catch(() => {});

    // Notify clients
    const list = await self.clients.matchAll({ includeUncontrolled: true });
    for (const c of list) {
      c.postMessage({
        type: "mx2.kernel.ready",
        kernel: { v: KERNEL.v, name: KERNEL.name, mode: KERNEL.mode }
      });
    }
  })());
});

/* ═══════════════════════════════════════════════════════════════════════════════
   [10] MESSAGE / AGENT BRIDGE
   ═══════════════════════════════════════════════════════════════════════════════ */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function postAll(msg) {
  return self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then(list => list.forEach(c => c.postMessage(msg)));
}

self.addEventListener("message", (event) => {
  const msg = event.data || {};
  const src = event.source;

  async function reply(payload) {
    try { src && src.postMessage(payload); } catch {}
  }

  (async () => {
    // Kernel ready check
    if (msg.type === "mx2.ping") {
      await reply({ type: "mx2.pong", kernel: { v: KERNEL.v, mode: KERNEL.mode } });
      return;
    }

    // Manifest patch
    if (msg.type === "mx2.manifest.patch") {
      const patch = msg.patch || {};
      await patchMutableManifest(patch);
      await reply({ type: "mx2.manifest.patched", ok: true });
      return;
    }

    // Session canvas tabs
    if (msg.type === "mx2.session.setCanvasTabs") {
      const tabs = Array.isArray(msg.tabs) ? msg.tabs : [];
      const activeTab = msg.activeTab ?? null;
      await patchMutableManifest({
        mx2: { session: { canvasTabs: tabs, activeTab } },
      });
      await reply({ type: "mx2.session.saved", ok: true });
      return;
    }

    // JavaCrypt exec via message
    if (msg.type === "mx2.exec") {
      try {
        const result = await JavaCrypt.exec(msg.program || {}, msg.caps || {});
        await reply({ type: "mx2.exec.result", ok: true, result, rid: msg.rid || null });
      } catch (e) {
        await reply({ type: "mx2.exec.result", ok: false, error: String(e), rid: msg.rid || null });
      }
      return;
    }

    // π inference via message
    if (msg.type === "mx2.pi.infer") {
      const result = await Host.infer(msg.query || "", msg.events || [], msg.ticks || 50);
      await reply({ type: "mx2.pi.result", ...result, rid: msg.rid || null });
      return;
    }

    // π emit via message
    if (msg.type === "mx2.pi.emit") {
      const tokens = Cluster.piEmit(msg.query || "", msg.steps || 24);
      await reply({ type: "mx2.pi.tokens", ok: true, tokens, rid: msg.rid || null });
      return;
    }

    // Host probe
    if (msg.type === "mx2.host.probe") {
      const out = await Host.probe(true);
      await reply({ type: "mx2.host.status", ...out });
      return;
    }

    // Cluster status
    if (msg.type === "mx2.cluster.status") {
      await reply({ type: "mx2.cluster.info", ...Cluster.status() });
      return;
    }

    // Boot request
    if (msg.type === "BOOT" || msg.type === "mx2.boot") {
      await reply({
        type: "mx2.kernel.ready",
        kernel: { v: KERNEL.v, name: KERNEL.name, mode: KERNEL.mode },
        glyphs: Object.keys(KERNEL.glyphs),
      });
      postAll({ t: 'STATUS', text: `K'UHUL π Kernel v${KERNEL.v} ready` });
      return;
    }

    // UI navigation / search (legacy compat)
    if (msg.t === 'NAV') {
      postAll({ t: 'STATUS', text: `Switched to ${msg.view || 'view'}` });
      return;
    }
    if (msg.t === 'SEARCH') {
      postAll({ t: 'STATUS', text: `Search: ${msg.q || ''}` });
      return;
    }

    // Unknown
    if (msg && (msg.type || msg.t)) {
      await reply({ type: "mx2.kernel.error", ok: false, error: "unknown_message", got: msg.type || msg.t });
    }
  })().catch((e) => {
    reply({ type: "mx2.kernel.error", ok: false, error: String(e) });
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
postAll({ t: 'STATUS', text: `K'UHUL π Kernel v${KERNEL.v} loaded` });
