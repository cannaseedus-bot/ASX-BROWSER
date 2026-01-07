# Plan

Near-term improvements and guardrails for ASX Browser development.

## Documentation
- Add a worked bundle example (world + bodies + constraints + ⟁tree) and reference it from the README quick start.
- Document how front-end glyph markup flows into the Python kernel (DOM → Symbolic Layout IR → PiKernel intents).

## Tooling and testing
- Add a minimal test harness for `pi_kernel.py` to verify tick determinism and constraint satisfaction against fixtures.
- Provide a lint/format step for the Python modules (black/ruff) and wire it into CI.

## Features
- Expand the semantic glyph table with concrete UI mappings (e.g., inventory windows, chat overlays) and example fragments.
- Build a small demo scene in `index.html` that exercises the bundle parser and shows the projected state stream.
- Sketch an adapter that converts SCXQ2 token streams into bundle-friendly JSON for round-trip experiments.
