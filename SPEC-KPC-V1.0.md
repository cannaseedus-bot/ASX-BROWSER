# K'UHUL π VIRTUAL CLUSTER SPECIFICATION V1.0
## "Emergent Compute via Mathematical Regeneration"

**Document:** SPEC-KPC-V1.0
**Status:** Formal Specification
**Date:** December 14, 2024
**Authors:** The XJSON Foundation & K'UHUL Protocol Initiative

---

## 1. EXECUTIVE SUMMARY

The K'UHUL π Virtual Cluster is a **browser-native distributed computing system** that enables large language model inference without traditional weight storage. Instead of storing billions of parameters, nodes regenerate weights using mathematical constants (π, e, φ, τ) and maintain consistency via WebRTC mesh networking with real-time synchronization.

### Core Innovation: Mathematical Regeneration
```javascript
// Traditional approach (16GB storage):
weights = load_from_disk("model.bin")  // 16GB file

// K'UHUL π approach (0.5KB specification):
weights = regenerate_weights(seed, π, φ, position)
```

---

## 2. ARCHITECTURAL OVERVIEW

### 2.1 System Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| **π-Node** | Virtual compute unit | Web Worker + IndexedDB |
| **Mesh Network** | P2P communication | WebRTC + SimplePeer |
| **Sync Engine** | State synchronization | CRDT (Conflict-free) |
| **Math Kernel** | Weight regeneration | π/e/φ/τ functions |
| **ASX Runtime** | UI orchestration | XCFE-lite components |

### 2.2 Cluster Topology
```
                    [Bootstrap Server]
                           |
          +----------------+----------------+
          |                                 |
    [π-Node 0] -- WebRTC -- [π-Node 1]     [π-Node 2]
          |                   |              |
          +----- WebRTC ------+--------------+
                           |
                     [π-Node 3]
```

---

## 3. NODE STATE MACHINE

```
BOOTSTRAP → DISCOVERING → CONNECTING → SYNCING → READY
                                          ↓
                                      DEGRADED ←→ RECOVERING
                                          ↓
                                       OFFLINE
```

### Valid State Transitions

| From | To |
|------|-----|
| BOOTSTRAP | DISCOVERING |
| DISCOVERING | CONNECTING, OFFLINE |
| CONNECTING | SYNCING, DEGRADED |
| SYNCING | READY, RECOVERING |
| READY | DEGRADED, RECOVERING, OFFLINE |
| DEGRADED | RECOVERING, OFFLINE |
| RECOVERING | READY, DEGRADED, OFFLINE |

---

## 4. MESH NETWORK PROTOCOL

### 4.1 Connection Phases
1. **Discovery** — Query signaling server for peers
2. **Connection** — WebRTC handshake with ICE/STUN
3. **Mesh Formation** — Connect to minimum 3 peers
4. **Health Monitoring** — Heartbeat every 5 seconds

### 4.2 Data Channel Configuration
```javascript
{
  ordered: true,
  maxRetransmits: 3
}
```

---

## 5. CRDT SYNC ENGINE

### 5.1 Merge Rules
- **Last-Write-Wins** with timestamp comparison
- **Vector Clock** for tie-breaking by nodeId
- **Checksum** validation on weight updates

### 5.2 Consensus Protocol
- **Threshold:** 67% agreement required
- **Phases:** Propose → Broadcast → Consensus → Execute
- **Rollback:** Automatic on execution failure

---

## 6. MATHEMATICAL REGENERATION

### 6.1 Constants
```javascript
{
  π: 3.141592653589793,
  e: 2.718281828459045,
  φ: 1.618033988749895,
  τ: 6.283185307179586
}
```

### 6.2 Regeneration Function
```javascript
f(x, c) = sin(x * c * π) * cos(x * e) * (1 + φ * tanh(x))
```

### 6.3 Weight Generation
1. Hash seed with layer + position
2. Iterate dimensions using rotating constants (π, e, φ)
3. Apply regeneration function
4. Normalize to unit length

---

## 7. RECOVERY STRATEGIES

| Order | Strategy | Description |
|-------|----------|-------------|
| 1 | `reconnectPeers` | Attempt to reconnect to known peers |
| 2 | `resyncState` | Re-synchronize state from healthy peers |
| 3 | `resetMathEngine` | Clear cache and regenerate weights |
| 4 | `hardReset` | Full node reset and re-bootstrap |

---

## 8. SECURITY MODEL

### 8.1 Threat Mitigations

| Threat | Mitigation |
|--------|------------|
| Sybil Attacks | Proof-of-π computational work |
| Eclipse Attacks | Multiple signaling servers |
| Data Tampering | Cryptographic signatures |
| DoS Attacks | Rate limiting + proof-of-work |

### 8.2 Message Signing
All sync messages must be HMAC-signed with peer's private key.

---

## 9. PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| Node startup | < 5 seconds |
| Mesh formation | < 10 seconds (4 nodes) |
| Weight regeneration | < 50ms per 1000-dim layer |
| Sync latency | < 200ms p95 |
| Recovery time | < 30 seconds |

---

## 10. SYSTEM REQUIREMENTS

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Browser | Chrome 87+ | Chrome 120+ |
| Memory | 512MB/node | 2GB/node |
| Storage | 50MB IndexedDB | 500MB |
| Network | 5Mbps | 100Mbps+ |
| CPU | 2 cores | 4+ cores |

---

**END OF SPECIFICATION V1.0**
