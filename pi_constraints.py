from __future__ import annotations
from typing import Dict, List
from pi_types import PiBody, PiConstraint, Vec3, vsub, vlen, vnorm, vmul, vadd

def solve_springs(bodies_by_id: Dict[str, PiBody], constraints: List[PiConstraint]) -> None:
    """
    Constraint solve is kernel-owned.
    We implement spring forces (Hooke + damping) as force accumulators.
    """
    for c in constraints:
        if c.type != "spring":
            continue
        a = bodies_by_id.get(c.a)
        b = bodies_by_id.get(c.b)
        if not a or not b:
            continue

        rest = float(c.params.get("rest_length", 1.0))
        k = float(c.params.get("stiffness", 40.0))
        damp = float(c.params.get("damping", 6.0))

        delta = vsub(b.position, a.position)
        dist = vlen(delta)
        if dist <= 1e-9:
            continue

        dirv = vnorm(delta)
        x = dist - rest

        # relative velocity along spring axis
        rv = vsub(b.velocity, a.velocity)
        rel = rv[0]*dirv[0] + rv[1]*dirv[1] + rv[2]*dirv[2]

        # Hooke + damping
        fmag = (k * x) + (damp * rel)
        f = vmul(dirv, fmag)

        if not a.is_static():
            a.force = vadd(a.force, f)
        if not b.is_static():
            b.force = vadd(b.force, vmul(f, -1.0))
