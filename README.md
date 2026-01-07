<img style="width:70px;" src="https://github.com/cannaseedus-bot/ASX-BROWSER/blob/main/asx.png">

# ASX Browser

An experimental explorer for the Atomic Symbolic Markup stack: a symbolic HTML dialect (⚛️ structural glyphs) plus a semantic styling alphabet (⟁ glyphs) that feeds a Pi kernel and SCX runtime. This repo packages the symbolic grammar, transformation contract, and Python pipeline that walks a bundle file into a physics-ready world specification.

## Quick start

1. Provide a bundle that follows the `%pi` schema (see `π-bundle.schema.json` for shape hints). A minimal invocation expects world, bodies, and constraints keys plus an optional `⟁tree` binding map.
2. Run the CLI to tick the kernel and emit projections:
   ```bash
   python main.py <bundle.json> [ticks]
   ```
   Each tick prints a JSON payload containing the epoch, tick metadata, projected body states, and queued symbolic intents.

## Repository map

- `main.py` — CLI entry point that loads a bundle, builds `PiWorldSpec` + bodies/constraints, and advances the `PiKernel` tick loop.
- `pi_kernel.py` — kernel orchestrating simulation state, constraint solving, and event handling.
- `pi_types.py` — dataclasses describing world, body, constraint, and projection primitives.
- `pi_constraints.py`, `pi_fields.py`, `pi_hash.py`, `pi_symbolic.py` — supporting modules for forces, hashing, symbolic intent handling, and constraint implementations.
- `index.html`, `black-code-editor.html`, `quantum-runtime.html` — front-end experiment surfaces for rendering and interacting with the symbolic markup.
- `manifest*.json`, `pi.*.schema.json`, `π-bundle.schema.json` — schema and manifest references for browser/runtime integrations.

## Symbolic token quick reference

```
📊 SCXQ2 Token Dictionary
⚛D  = <div>                        ⟁D   = <div class="dashboard">
⚛H  = <header>                     ⟁H   = <h1 class="title">
⚛M  = <main>                       ⟁M   = <main class="dashboard-content">
⚛N  = <nav>                        ⟁B   = <button class="nav-btn">
⚛C  = <div class="card">           ⟁MC  = <div class="metric-card">
⟁T   = <h1 class="title">            ⟁MV  = <div class="metric-value">
⟁NB  = <button class="nav-btn">      ⟁N0  = active state
⟁C0  = Performance card              ⟁N1  = inactive state
⟁C1  = Uptime card                  ⟁N2  = inactive state
```

1) SCXQ2 Structural Tokens
2) KUHUL Semantic Tokens
3) HTML Elements

## Formal grammar (reference)

Think of it as **HTML + two symbolic channels**:

- **⚛️ channel**: structural element glyphs (maps to actual tags).
- **⟁ channel**: semantic/atomic glyphs (maps to roles, states, utilities).

### Lexical elements

**Glyph tokens:**

- Structural glyph: `⚛️D`, `⚛️H`, `⚛️M`, `⚛️N`, `⚛️C`, `⚛️S`, `⚛️A`, `⚛️F`, `⚛️B`, `⚛️I`, `⚛️L`, `⚛️P`, `⚛️T`
- Semantic glyph: core layout (`⟁D`, `⟁H`, `⟁M`, `⟁MC`, `⟁MV`, `⟁NB`, `⟁T`, `⟁SD`, `⟁SL`, `⟁SN`, `⟁CA`, `⟁GR`, `⟁GC2`, `⟁GC3`, `⟁GC4`), state/variant glyphs (`⟁N0`, `⟁N1`, `⟁N2`, `⟁C0..⟁C3`, `⟁S0..⟁S3`), and utilities (`⟁F`, `⟁FC`, `⟁FR`, `⟁AC`, `⟁JC`, `⟁JSB`, `⟁G1..⟁G3`, `⟁P2..⟁P4`, `⟁WF`, `⟁HF`, etc.).

### High-level grammar (EBNF)

```ebnf
Document      ::= Node*

Node          ::= ElementNode | TextNode

ElementNode   ::= StartTag Node* EndTag

StartTag      ::= "<" TagName Attribute* ">"
EndTag        ::= "</" TagName ">"

TagName       ::= HtmlTagName | GlyphTagName

HtmlTagName   ::= [a-zA-Z][a-zA-Z0-9-]*   (* e.g. div, header, main *)

GlyphTagName  ::= StructuralGlyphTag      (* e.g. ⚛️D, ⚛️H, ⚛️M, ... *)

Attribute     ::= " " AttributeName ("=" AttributeValue)?

AttributeName ::= HtmlAttrName
                | GlyphAttrName

HtmlAttrName  ::= [a-zA-Z_:][a-zA-Z0-9_:\-\.]*

GlyphAttrName ::= GlyphToken               (* e.g. ⟁D, ⟁C0, ⟁NB, ... *)

AttributeValue ::= '"' AttributeValueChars* '"'
                 | "'" AttributeValueChars* "'"

AttributeValueChars ::= [^"'&]  (* simplified *)

TextNode      ::= [^<]+
```

Constraints:

- Elements may be normal HTML tags or structural glyph tags like `<⚛️D>`.
- Attributes may mix standard attributes (`id`, `class`, `data-*`) with symbolic attributes (e.g., `⟁D`, `⟁C0`).

### Symbolic element semantics

```ebnf
StructuralGlyphTag ::= "⚛️" GlyphId
GlyphId            ::= "D" | "H" | "M" | "N" | "C" | "S" | "A" | "F" | "B" | "I" | "L" | "P" | "T"
SemanticGlyphAttr  ::= "⟁" GlyphCode
GlyphCode          ::= "D" | "H" | "M" | "MC" | "MV" | "NB" | "T" | "C0" | "C1" | "C2" | "C3"
                     | "N0" | "N1" | "N2"
                     | "SD" | "SL" | "SN" | "CA"
                     | "GR" | "GC2" | "GC3" | "GC4"
                     | "S0" | "S1" | "S2" | "S3"
                     | "F" | "FC" | "FR" | "AC" | "JC" | "JSB"
                     | "G1" | "G2" | "G3"
                     | "P2" | "P3" | "P4"
                     | "WF" | "HF"
                     | "TXS" | "TXM" | "TXL" | "FWB" | "FWM"
                     | "CTC" | "CT" | "CT2" | "COK" | "CD"
                     | "BGB" | "BGB2" | "BGC"
                     | "BR" | "BRC" | "BR2" | "BR3"
                     | "HP" | "HPF" | "XP" | "XPF"
                     | "INV" | "ITEM"
                     | "WIN" | "WTB" | "WCT" | "WCB" | "WCC" | "WCM" | "WCX"
                     | ...   (* extendable *)
```

Semantics rules:

- Structural glyph tags define the base HTML tag and are preserved as data markers (e.g., `<⚛️D>` → `<div data-⚛="D">`).
- Semantic glyph attributes decorate the element as `data-⟁` attributes and can be combined alongside standard HTML attributes.

## Parser → DOM transformation contract

1. Structural glyph tag `<⚛️X ...>` becomes `<TAG data-⚛="X" ...>`, where `TAG` maps glyphs to familiar elements:
   - `⚛️D → div`, `⚛️H → header`, `⚛️M → main`, `⚛️N → nav`, `⚛️C → div`, `⚛️S → section`, `⚛️A → article`, `⚛️F → footer`, `⚛️B → button`, `⚛️I → span`, `⚛️L → a`, `⚛️P → p`, `⚛️T → h1 (or h*)`.
2. Semantic glyph attributes like `⟁D` or `⟁C0` attach as `data-⟁` flags. Keep the HTML tag chosen by the ⚛️ glyph and avoid flattening semantic glyphs into separate elements.

## Symbolic → SCX mapping (v4.2)

DOM (⚛️/⟁) → **Symbolic Layout IR** → **SCX op sequence**. Geometry primitives (sphere, lattice, torus, etc.) map from symbolic nodes into SCX opcodes through the runtime in `pi_kernel.py` and supporting modules.

For any root (dashboard, window, inventory, etc.), build a tree of symbolic nodes and lower them to runtime intents that the kernel can resolve into bodies, constraints, and UI bindings.

---

For roadmap and upcoming work, see `PLAN.md`.
