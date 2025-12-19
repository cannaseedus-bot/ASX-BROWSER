from __future__ import annotations
from typing import Any, Dict, List, Tuple
from pi_types import (
    PiWorldSpec, PiBody, PiConstraint, PiEvent, PiProjection, PiTickResult,
    Vec3, vadd, vmul
)
from pi_fields import default_field_compositor
from pi_constraints import solve_springs
from pi_symbolic import extract_symbolic_intents
from pi_hash import canonical_state_snapshot, sha256_json

class PiKernel:
    """
    π-KUHUL Kernel (skeleton, but functional)
    - Owns time advancement
    - Owns physics integration
    - Owns constraint solving
    - Owns deterministic hashing
    - Does NOT fetch URLs
    - Does NOT project visuals (only emits projection state)
    """
    def __init__(self, world: PiWorldSpec, bodies: List[PiBody], constraints: List[PiConstraint], tree: Dict[str, Any]) -> None:
        self.world = world
        self.bodies = bodies
        self.constraints = constraints
        self.tree = tree

        self.epoch = 0
        self.tick = 0
        self.prev_hash = "0" * 64

        self.events: List[PiEvent] = []  # kernel-owned event queue
        self.field_comp = default_field_compositor()

        self._bodies_by_id: Dict[str, PiBody] = {b.id: b for b in self.bodies}

        # symbolic scan produces intents (not actions) — this is safe and deterministic
        self.symbolic_intents: List[PiEvent] = extract_symbolic_intents(self.tree)

    def enqueue_event(self, ev: PiEvent) -> None:
        self.events.append(ev)

    # -------------------- Tick Steps (Locked Order) --------------------

    def step_fields(self) -> None:
        fields = self.world.fields
        for b in self.bodies:
            if b.is_static():
                continue
            # gravity (mass-scaled)
            g = self.world.gravity
            b.force = vadd(b.force, (g[0] * b.mass, g[1] * b.mass, g[2] * b.mass))

            # air drag (simple)
            if self.world.air_density > 0.0:
                # quadratic-ish drag term scaled by body.drag
                vx, vy, vz = b.velocity
                speed2 = vx*vx + vy*vy + vz*vz
                drag_mag = 0.5 * self.world.air_density * speed2 * max(0.0, b.drag)
                b.force = vadd(b.force, (-drag_mag * vx, -drag_mag * vy, -drag_mag * vz))

            # custom fields (wind, wells, etc.)
            ff = self.field_comp.total_force(fields, b)
            b.force = vadd(b.force, ff)

    def step_symbolic_forces(self) -> None:
        """
        Events -> forces. Kernel-owned. No JS.
        """
        for ev in self.events:
            if ev.type == "impulse" and ev.target:
                b = self._bodies_by_id.get(ev.target)
                if not b or b.is_static():
                    continue
                imp = ev.payload.get("impulse", [0, 0, 0])
                ix, iy, iz = float(imp[0]), float(imp[1]), float(imp[2])
                # impulse converted into velocity delta
                if b.mass > 0:
                    b.velocity = (b.velocity[0] + ix / b.mass,
                                  b.velocity[1] + iy / b.mass,
                                  b.velocity[2] + iz / b.mass)

            elif ev.type == "attraction" and ev.target:
                b = self._bodies_by_id.get(ev.target)
                if not b or b.is_static():
                    continue
                f = ev.payload.get("force", [0, 0, 0])
                b.force = vadd(b.force, (float(f[0]), float(f[1]), float(f[2])))

            # route_intent is emitted as intent; it is NOT executed here.
            # It can be surfaced to higher layers as “available actions”.

        self.events = []

    def step_constraints(self) -> None:
        solve_springs(self._bodies_by_id, self.constraints)

    def step_integrate(self, dt: float) -> None:
        """
        Semi-implicit Euler (locked default).
        """
        for b in self.bodies:
            if b.is_static():
                b.force = (0.0, 0.0, 0.0)
                continue
            if b.mass <= 0:
                b.force = (0.0, 0.0, 0.0)
                continue

            ax = b.force[0] / b.mass
            ay = b.force[1] / b.mass
            az = b.force[2] / b.mass

            # v <- v + a dt
            b.velocity = (b.velocity[0] + ax * dt,
                          b.velocity[1] + ay * dt,
                          b.velocity[2] + az * dt)

            # p <- p + v dt
            b.position = (b.position[0] + b.velocity[0] * dt,
                          b.position[1] + b.velocity[1] * dt,
                          b.position[2] + b.velocity[2] * dt)

            b.force = (0.0, 0.0, 0.0)

    def step_projection(self) -> PiProjection:
        """
        Output only: CSS-VER reads this. Kernel does not render.
        """
        out: Dict[str, Dict[str, Any]] = {}
        for b in self.bodies:
            out[b.id] = {
                "position": [b.position[0], b.position[1], b.position[2]],
                "rotation": [b.rotation[0], b.rotation[1], b.rotation[2], b.rotation[3]],
                "scale": [1.0, 1.0, 1.0],
                "flags": list(b.flags),
                "@dom_key": b.dom_key,
                "@bind_dom": b.bind_dom,
                "@role": b.role
            }
        return PiProjection(bodies=out)

    def step_seal(self) -> str:
        snap = canonical_state_snapshot(self.epoch, self.tick, self.bodies, self.constraints)
        h = sha256_json({
            "prev": self.prev_hash,
            "snap": snap
        })
        self.prev_hash = h
        return h

    # -------------------- Public API --------------------

    def tick_once(self) -> PiTickResult:
        dt = self.world.dt
        sub = max(1, int(self.world.substeps))
        sub_dt = dt / sub

        for _ in range(sub):
            # LOCKED ORDER
            self.step_fields()
            self.step_symbolic_forces()
            self.step_constraints()
            self.step_integrate(sub_dt)

        proj = self.step_projection()
        h = self.step_seal()

        # advance counters (epoch policy can be tuned later, but kernel-owned)
        self.tick += 1
        if self.tick % 60 == 0:
            self.epoch += 1

        return PiTickResult(
            epoch=self.epoch,
            tick=self.tick,
            projection=proj,
            tick_hash=h,
            prev_hash=self.prev_hash
        )
