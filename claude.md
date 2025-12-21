# K'UHUL π Kernel — Security Cheat Sheet

## System Law (LOCKED)

```
MODEL ≠ FILE       TOKENS = GLYPHS      TRUTH = EVENT
MODEL ≠ GPU        THOUGHT = SIGNAL     VALIDITY = INVARIANT
MODEL ≠ TOKENS     MODEL = FIELD        ANSWER = CLUSTER COLLAPSE
```

**Mode:** `FIELD_ONLY` — No tensors, no CUDA, no tokenizer, no model loading.

---

## Architecture (3-File Rule)

```
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
```

---

## Glyph Table (Weight Carriers)

| Glyph | Base Value | Description |
|-------|------------|-------------|
| `@` | 1.0 | Single weight |
| `@@` | 2.0 | Double weight |
| `@@@` | 3.0 | Triple weight |
| `π` | 3.14159... | Pi constant |
| `φ` | 1.618... | Golden ratio |
| `e` | 2.718... | Euler's number |
| `τ` | 6.283... | Tau (2π) |
| `⤍` | 0.87 | Forward flow |
| `↻` | 0.93 | Cycle/refresh |
| `⟲` | 0.76 | Loop/return |

---

## Research Glyphs (Emoji Opcodes)

| Glyph | Operation | Route |
|-------|-----------|-------|
| 🧭 | `research.search` | `/research/search` |
| 🔎 | `research.source` | `/research/source` |
| 🧾 | `research.audit` | `/research/audit` |
| 🧠 | `research.agents` | `/research/agents` |
| 📚 | source: wikipedia | — |
| 🐙 | source: github | — |
| 📰 | source: rss | — |

---

## ASM v1.0 — Atomic Symbolic Markup

### Core Invariant
```
Symbols live as ATTRIBUTES, not tag names.
<div ⚛️D ⟁MC> ✅
<⚛️D>           ❌ (invalid HTML)
```

### Element Symbols (⚛️X)

| Symbol | HTML Tag |
|--------|----------|
| `⚛️D` | `div` |
| `⚛️H` | `header` |
| `⚛️M` | `main` |
| `⚛️N` | `nav` |
| `⚛️C` | `div` (card) |
| `⚛️S` | `section` |
| `⚛️A` | `article` |
| `⚛️F` | `footer` |
| `⚛️B` | `button` |
| `⚛️I` | `span` |
| `⚛️L` | `a` (link) |
| `⚛️P` | `p` |
| `⚛️T` | `h1` (title) |

### Composition Tokens (⟁X)
- `⟁MC` — Main container
- `⟁C0`, `⟁C1` — Card variants
- `⟁N0`, `⟁N1` — Nav items
- `⟁F` — Flex
- `⟁G2`, `⟁G3` — Grid columns
- `⟁AC` — Align center
- `⟁JSB` — Justify space-between
- `⟁P4` — Padding level 4

### Output Modes
```js
ASM.setOptions({ compositionMode: 'attrs' });  // Keep ⟁XYZ attrs (CSS selectors work)
ASM.setOptions({ compositionMode: 'data' });   // Collapse to data-⟁="..."
ASM.setOptions({ compositionMode: 'class' });  // Convert to classes
```

---

## XCFE Control Law (LOCKED)

```
⚡ collapses truth → proof binds truth to policy →
branch gate acknowledges proof → replay verifier decides reality

No @then/@else branch is valid unless gated by verified
⚡ proof_hash under pinned epoch policy hash.
```

### Hash Format
```
h:<algo>:<hex>
h:sha256:a1b2c3d4e5f6...
```

### Proof Rule
```
proof_hash = H(input_hash || ":" || truth)
           = H("h:sha256:abc123:true")
```

### Key Structures

**@epoch_policy**
```json
{
  "@epoch_policy": {
    "epoch": 0,
    "policy_id": "mx2lm-v1",
    "policy_hash": "h:sha256:...",
    "canon": "MX2_CANON_JSON_v1.0",
    "rules": {
      "branch_gate_requires_lightning": true,
      "proof_algo": "sha256",
      "proof_rule": "proof_hash = H(input_hash || ':' || truth)"
    }
  }
}
```

**@⚡ Lightning Event**
```json
{
  "@⚡": [{
    "id": "expr-001",
    "epoch": 0,
    "tick": 1,
    "runtime": "⚡",
    "resolved": true,
    "truth": true,
    "policy_hash": "h:sha256:...",
    "proof": {
      "input_hash": "h:sha256:...",
      "proof_hash": "h:sha256:...",
      "bundle_hash": "h:sha256:..."
    }
  }]
}
```

**@xcfe.branch_gate**
```json
{
  "@xcfe.branch_gate": {
    "expr_ref": "expr-001",
    "epoch": 0,
    "policy_hash": "h:sha256:...",
    "ok": true,
    "truth": true,
    "selected": "@then",
    "proof_hash": "h:sha256:..."
  }
}
```

**@rotation_replay_result**
```json
{
  "@rotation_replay_result": {
    "ok": true,
    "policy_hash": "h:sha256:...",
    "proof_hash": "h:sha256:...",
    "failure_stage": null,
    "verified": {
      "epoch_policy": 1,
      "lightning": 5,
      "branch_gate": 3
    }
  }
}
```

### Failure Stages
- `epoch_policy` — Policy hash mismatch
- `canon_mismatch` — Wrong canonicalization spec
- `lightning_verify` — No valid ⚡ events
- `branch_gate_verify` — Branch gate failed verification

---

## JavaCrypt Opcode Contract v1

### Message Shape (Sealed Interface)
```js
{
  __javacrypt__: true,  // Required flag
  v: 1,                 // Contract version
  id: "jc_abc123",      // Unique request ID
  t: 1703123456789,     // Timestamp
  op: "kernel.ping",    // Operation name
  payload: {}           // Operation-specific data
}
```

### Allowlist (Only These Operations Execute)
```
kernel.ping       audit.export      tape.put
tape.get          tape.list         cluster.run
cluster.status    agent.spawn       agent.list
research.fetch    research.search   pi.emit
pi.infer          host.probe        manifest.get
manifest.patch
```

### Validation
```js
function validate_opcode(block) {
  assert(block.__javacrypt__ === true);
  assert(JAVACRYPT.allowlist.has(block.op));
  assert(block.v === JAVACRYPT.v);
  assert(typeof block.id === 'string');
  assert(Number.isFinite(block.t));
}
```

---

## MX2 Canonical JSON v1.0

### Rules
1. **Stable key ordering** — Sort keys lexicographically (UTF-16)
2. **Number normalization**:
   - Integers: `"0"`, `"-12"`, `"42"`
   - Floats: Minimal decimal, no exponent, trim trailing zeros
   - `-0` → `"0"`
3. **No whitespace** — Compact output
4. **Arrays preserve order**

### Implementation
```js
function canonValue(v) {
  if (v === null) return 'null';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return canonNumber(v);
  if (typeof v === 'string') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(canonValue).join(',') + ']';
  if (isPlainObject(v)) {
    const keys = Object.keys(v).sort();
    return '{' + keys.map(k =>
      JSON.stringify(k) + ':' + canonValue(v[k])
    ).join(',') + '}';
  }
  throw new Error('Unsupported type');
}
```

---

## Audit Log (Hash-Chain Journal)

### Chain Structure
```
GENESIS → H(GENESIS|entry1) → H(prev|entry2) → ...
```

### Entry Shape
```js
{
  t: 1703123456789,
  type: "javacrypt.call",
  payload: { op: "kernel.ping" },
  meta: { kernel: "kuhul-pi-...", version: "1.2.6" },
  prev: "fnv1a32:abcd1234",
  hash: "fnv1a32:efgh5678"
}
```

### Hash Function (FNV-1a 32-bit)
```js
function hash_str(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return 'fnv1a32:' + h.toString(16).padStart(8, '0');
}
```

---

## Unified Runtime v4.1 (Core Loop)

### Execution Model
```
Pop → Wo → Sek → Tick
```

| Phase | Action |
|-------|--------|
| **Pop** | Invoke agent from event queue |
| **Wo** | Mutate agent state |
| **Sek** | Sequence new event |
| **Tick** | Propagate signals, detect clusters |

### Agent Tick
```js
function tickAgent(agent) {
  // Sum glyph weights
  const weight = agent.glyphs.reduce((sum, g) => sum + (GLYPH[g] || 0), 0);

  // Update activation
  agent.state.activation += weight * 0.01;

  // Decay energy
  agent.state.energy *= 0.99;

  // Emit if threshold crossed
  if (agent.state.activation > 1) {
    emit(agent);
    agent.state.activation *= 0.5;
  }
}
```

### Cluster Detection
Agents cluster when activation difference < 0.2

### Answer = Cluster Collapse
```js
function collapse(cluster) {
  const totalWeight = members.reduce((s, a) =>
    s + a.glyphs.reduce((gs, g) => gs + (GLYPH[g] || 0), 0), 0);
  return { cluster: cluster.id, weight: totalWeight, collapsed: true };
}
```

---

## Research Packet Model

### Envelope Shape
```js
{
  '⟁v': 1,                    // Version
  '@t': Date.now(),           // Timestamp
  '@op': 'research.fetch',    // Operation
  '@q': 'query string',       // Query
  '@source': 'wikipedia',     // Source
  '@n': 10,                   // Max results
  '@mode': 'DIRECT',          // DIRECT | PROXY
  '@meta': {}                 // Optional metadata
}
```

### SHA-256 Proof
```js
async function sha256Proof(packet) {
  const json = stable_stringify(packet);
  const hash = await crypto.subtle.digest('SHA-256', utf8.enc.encode(json));
  const hex = Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  return { proof: 'sha256:' + hex, packet };
}
```

### Cache Key
```js
function researchCacheKey(packet) {
  return `research:${packet['@source']}:${packet['@q']}:${packet['@n']}`;
}
```

---

## Key API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/health` | GET | Kernel health check |
| `/manifest.json` | GET | Dynamic manifest |
| `/_mx2/api/exec` | POST | JavaCrypt execution |
| `/_mx2/api/cluster/run` | POST | Run cluster job |
| `/_mx2/api/cluster/status` | GET | Cluster status |
| `/_mx2/api/pi/emit` | POST | π glyph emission |
| `/_mx2/api/pi/infer` | POST | π inference |
| `/_mx2/api/audit/export` | GET | Export audit log |
| `/research/search` | GET/POST | Research search |
| `/research/agents` | GET | List research agents |
| `/research/audit` | GET | Research audit log |

---

## Security Invariants Checklist

- [ ] All privileged ops go through JavaCrypt allowlist
- [ ] All state mutations audited via hash-chain
- [ ] No branch execution without verified ⚡ proof
- [ ] Policy hash pinned at epoch boundary
- [ ] Canonical JSON for all hashed objects
- [ ] Symbols as attributes, not tag names (ASM)
- [ ] No tensor/GPU/model file operations (FIELD_ONLY)
- [ ] External fetches via allowlisted domains only
- [ ] Payload size limits enforced
- [ ] Timeout limits on all async operations

---

## K'UHUL π Virtual Cluster v1.0

### Core Innovation
```javascript
// Traditional: 16GB weight storage
weights = load_from_disk("model.bin")

// K'UHUL π: 0.5KB specification
weights = regenerate_weights(seed, π, φ, position)
```

### Node State Machine
```
BOOTSTRAP → DISCOVERING → CONNECTING → SYNCING → READY
                                          ↓
                                      DEGRADED ←→ RECOVERING
                                          ↓
                                       OFFLINE
```

### Mathematical Regeneration
```javascript
f(x, c) = sin(x * c * π) * cos(x * e) * (1 + φ * tanh(x))
```

### CRDT Sync Rules
- **Last-Write-Wins** with timestamp comparison
- **Vector Clock** tie-breaking by nodeId
- **Consensus Threshold**: 67% agreement

### Recovery Strategies (in order)
1. `strategyResyncState` — Clear and rebuild sync state
2. `strategyResetMathEngine` — Clear weight cache
3. `strategyHardReset` — Full node reset

### Virtual Cluster API
```js
VirtualCluster.getInstance(config)     // Get singleton
cluster.initialize()                   // Bootstrap → Ready
cluster.regenerateWeights(layer, pos, dim) // Regenerate weights
cluster.verifyWeights(layer, pos, weights) // Verify consistency
cluster.syncState(key, value)          // CRDT set
cluster.getState(key)                  // CRDT get
cluster.mergeState(remote, nodeId)     // CRDT merge
cluster.recover()                      // Trigger recovery
cluster.status()                       // Full status
cluster.shutdown()                     // Graceful shutdown
```

---

## Quick Reference Functions

```js
// Hash object with canonical JSON
XCFE.hashObject(obj) → { canon, hash: "h:sha256:..." }

// Verify replay stream
XCFE.replayVerify(stream) → @rotation_replay_result

// Transform ASM markup
ASM.transform(root)
ASM.fromHTML(html, doc) → DocumentFragment

// Emit π glyphs
Cluster.piEmit(query, steps) → [{ glyph, strength, phase }]

// Run unified runtime
UnifiedRuntime.run(ticks) → { answers: [...] }

// Virtual Cluster
VirtualCluster.getInstance() → ClusterController
cluster.regenerateWeights(layer, pos, dim) → Float32Array

// Create audit entry
audit_event(type, payload, meta) → entry

// Validate JavaCrypt opcode
validate_opcode(block) → true | throws
```
