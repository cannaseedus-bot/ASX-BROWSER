from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

Vec3 = Tuple[float, float, float]
Quat = Tuple[float, float, float, float]

def vadd(a: Vec3, b: Vec3) -> Vec3:
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])

def vsub(a: Vec3, b: Vec3) -> Vec3:
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])

def vmul(a: Vec3, s: float) -> Vec3:
    return (a[0] * s, a[1] * s, a[2] * s)

def vlen(a: Vec3) -> float:
    return (a[0]*a[0] + a[1]*a[1] + a[2]*a[2]) ** 0.5

def vnorm(a: Vec3) -> Vec3:
    L = vlen(a)
    if L <= 1e-12:
        return (0.0, 0.0, 0.0)
    return (a[0]/L, a[1]/L, a[2]/L)

@dataclass(frozen=True)
class PiWorldSpec:
    gravity: Vec3 = (0.0, 9.81, 0.0)
    air_density: float = 1.225
    air_viscosity: float = 0.000018
    dt: float = 1.0 / 60.0
    substeps: int = 1
    integrator: str = "semi_implicit"  # locked default
    solver_iterations: int = 8
    fields: List[Dict[str, Any]] = field(default_factory=list)

@dataclass
class PiBody:
    id: str
    mass: float = 1.0
    position: Vec3 = (0.0, 0.0, 0.0)
    velocity: Vec3 = (0.0, 0.0, 0.0)
    rotation: Quat = (0.0, 0.0, 0.0, 1.0)
    shape: str = "box"
    size: Vec3 = (1.0, 1.0, 0.1)
    friction: float = 0.45
    restitution: float = 0.08
    drag: float = 0.02
    flags: List[str] = field(default_factory=list)

    # bindings (projection only, not authority)
    role: str = "ui.node"
    bind_dom: Optional[str] = None
    dom_key: Optional[str] = None

    # runtime accumulators (π-only)
    force: Vec3 = (0.0, 0.0, 0.0)

    def is_static(self) -> bool:
        return "static" in self.flags or self.mass <= 0.0

@dataclass(frozen=True)
class PiConstraint:
    id: str
    type: str  # "spring" supported here
    a: str
    b: str
    params: Dict[str, Any]

@dataclass
class PiEvent:
    """
    Event bus is kernel-owned: events become forces. No DOM/JS ownership here.
    """
    type: str  # e.g. "impulse", "attraction", "route_intent"
    target: Optional[str] = None
    payload: Dict[str, Any] = field(default_factory=dict)

@dataclass
class PiProjection:
    """
    Read-only output for CSS-VER projection: mapping body_id -> CSS vars or transforms.
    """
    bodies: Dict[str, Dict[str, Any]]

@dataclass
class PiTickResult:
    epoch: int
    tick: int
    projection: PiProjection
    tick_hash: str
    prev_hash: str
