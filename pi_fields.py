from __future__ import annotations
from typing import Any, Callable, Dict, List
from pi_types import PiBody, Vec3, vadd, vmul, vnorm

FieldCalc = Callable[[Dict[str, Any], PiBody], Vec3]

class PiFieldCompositor:
    """
    Pure force resolution.
    - No DOM
    - No time ownership
    - No state mutation beyond returning vectors
    """
    def __init__(self) -> None:
        self._calcs: Dict[str, FieldCalc] = {}

    def register(self, field_type: str, calc: FieldCalc) -> None:
        self._calcs[field_type] = calc

    def total_force(self, fields: List[Dict[str, Any]], body: PiBody) -> Vec3:
        total: Vec3 = (0.0, 0.0, 0.0)
        for f in fields:
            ft = f.get("field_type")
            params = f.get("parameters", {})
            calc = self._calcs.get(ft)
            if not calc:
                continue
            total = vadd(total, calc(params, body))
        return total

def calc_wind(params: Dict[str, Any], body: PiBody) -> Vec3:
    if body.is_static():
        return (0.0, 0.0, 0.0)
    direction = params.get("direction", [1, 0, 0])
    strength = float(params.get("strength", 0.5))
    d = vnorm((float(direction[0]), float(direction[1]), float(direction[2])))
    # drag scales the wind effect slightly (still “field”, not “material”)
    s = strength * max(0.0, 1.0 - min(1.0, body.drag))
    return vmul(d, s)

def calc_attraction_well(params: Dict[str, Any], body: PiBody) -> Vec3:
    if body.is_static():
        return (0.0, 0.0, 0.0)
    cx, cy, cz = params.get("position", [0, 0, 0])
    strength = float(params.get("strength", 2.0))
    radius = float(params.get("radius", 5.0))
    power = float(params.get("falloff_power", 2.0))

    dx = float(cx) - body.position[0]
    dy = float(cy) - body.position[1]
    dz = float(cz) - body.position[2]
    dist = (dx*dx + dy*dy + dz*dz) ** 0.5
    if dist <= 1e-6 or dist > radius:
        return (0.0, 0.0, 0.0)

    # normalized distance in (0,1]
    nd = max(1e-3, dist / radius)
    mag = strength * (1.0 / (nd ** power))
    d = vnorm((dx, dy, dz))
    return vmul(d, mag)

def default_field_compositor() -> PiFieldCompositor:
    comp = PiFieldCompositor()
    comp.register("wind", calc_wind)
    comp.register("attraction_well", calc_attraction_well)
    return comp
