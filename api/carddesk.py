"""Card Sum Options Desk — serverless pricing endpoint.

This is the real `cardquant` package (https://pypi.org/project/cardquant) running
on real CPython. Nothing is ported or re-implemented here; this file only parses
the request, calls `CardValuation`, and serialises the result.

Vercel runs this as a Python Function at /api/carddesk (file-name convention).
Locally, `pnpm dev:desk` serves the same handler on 127.0.0.1:8001 and
next.config.js rewrites /api/carddesk to it in development.

GET /api/carddesk?n=10&seen=5,11&strikes=50,60,70,80,90&replacement=0

Every response is a pure function of its query string, so it is cached hard:
in-process (LRU, keyed on the multiset of seen cards — order does not change
the price) and at the CDN (immutable Cache-Control). A state anyone has priced
before is served without touching Python again.
"""

from __future__ import annotations

import functools
import json
import math
import platform
import time
from http.server import BaseHTTPRequestHandler
from importlib.metadata import PackageNotFoundError, version as pkg_version
from urllib.parse import parse_qs, urlparse

from cardquant import CardValuation

# ── limits: keep a single request bounded (the DP is pure Python) ────────────
MAX_N = 12
MAX_STRIKES = 10
MAX_STRIKE = 200
STANDARD_DECK = tuple(range(1, 14)) * 4  # A=1 … K=13, four suits
RANKS = frozenset(range(1, 14))

DEFAULT_N = 10
DEFAULT_STRIKES = (50, 60, 70, 80, 90)

try:
    LIBRARY = f"cardquant {pkg_version('cardquant')}"
except PackageNotFoundError:  # pragma: no cover — local checkouts
    LIBRARY = "cardquant"
RUNTIME = f"cpython {platform.python_version()}"


class BadRequest(ValueError):
    pass


def _int_list(raw: str | None, *, default: tuple[int, ...]) -> tuple[int, ...]:
    if raw is None or raw.strip() == "":
        return default
    out: list[int] = []
    for part in raw.split(","):
        part = part.strip()
        if not part:
            continue
        try:
            out.append(int(part))
        except ValueError as exc:
            raise BadRequest(f"not an integer: {part!r}") from exc
    return tuple(out)


def parse_query(query: str) -> tuple[int, tuple[int, ...], tuple[int, ...], bool]:
    q = {k: v[0] for k, v in parse_qs(query, keep_blank_values=True).items()}

    try:
        n = int(q.get("n", DEFAULT_N))
    except ValueError as exc:
        raise BadRequest("n must be an integer") from exc
    if not 1 <= n <= MAX_N:
        raise BadRequest(f"n must be between 1 and {MAX_N}")

    replacement = q.get("replacement", "0") in ("1", "true", "yes")

    seen = _int_list(q.get("seen"), default=())
    if len(seen) > n:
        raise BadRequest("more seen cards than n")
    for c in seen:
        if c not in RANKS:
            raise BadRequest(f"card rank out of range: {c}")
    if not replacement:
        for r in RANKS:
            if seen.count(r) > 4:
                raise BadRequest(f"more than four of rank {r}")

    strikes = tuple(sorted(set(_int_list(q.get("strikes"), default=DEFAULT_STRIKES))))
    if not strikes:
        raise BadRequest("at least one strike")
    if len(strikes) > MAX_STRIKES:
        raise BadRequest(f"at most {MAX_STRIKES} strikes")
    for k in strikes:
        if not 0 <= k <= MAX_STRIKE:
            raise BadRequest(f"strike out of range: {k}")

    return n, seen, strikes, replacement


def _num(x: float) -> float | None:
    """JSON has no NaN; the library reports NaN for undefined greeks."""
    return None if x is None or (isinstance(x, float) and math.isnan(x)) else float(x)


@functools.lru_cache(maxsize=4096)
def price(n: int, seen_sorted: tuple[int, ...], strikes: tuple[int, ...], replacement: bool) -> dict:
    # The library's own class, its own defaults for the deck, its own greeks.
    cv = CardValuation(
        n=n,
        seen_cards=list(seen_sorted),
        strike_list=list(strikes),
        deck=list(STANDARD_DECK),
        with_replacement=replacement,
        calculate_all_greeks=True,
    )
    rows = []
    for k in strikes:
        opt = cv.options[k]
        rows.append(
            {
                "strike": k,
                "cte": opt.CTE,
                "call": {g: _num(getattr(opt.call, g)) for g in ("theo", "delta", "gamma", "theta", "charm", "color")},
                "put": {g: _num(getattr(opt.put, g)) for g in ("theo", "delta", "gamma", "theta", "charm", "color")},
            }
        )
    return {
        "n": n,
        "seen": list(seen_sorted),
        "sumSeen": sum(seen_sorted),
        "cte": n - len(seen_sorted),
        "future": _num(cv.future),
        "replacement": replacement,
        "strikes": rows,
    }


def handle(query: str) -> tuple[int, dict, bool]:
    """Returns (status, body, cacheable)."""
    try:
        n, seen, strikes, replacement = parse_query(query)
    except BadRequest as exc:
        return 400, {"error": str(exc)}, False

    key = (n, tuple(sorted(seen)), strikes, replacement)
    t0 = time.perf_counter()
    try:
        body = dict(price(*key))
    except ValueError as exc:  # the library's own validation
        return 400, {"error": str(exc)}, False
    ms = (time.perf_counter() - t0) * 1000.0
    body["seen"] = list(seen)  # echo the caller's draw order back
    body["meta"] = {"library": LIBRARY, "runtime": RUNTIME, "ms": round(ms, 2)}
    return 200, body, True


class handler(BaseHTTPRequestHandler):  # noqa: N801 — Vercel's required name
    def do_GET(self) -> None:  # noqa: N802
        status, body, cacheable = handle(urlparse(self.path).query)
        payload = json.dumps(body, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        if cacheable:
            # deterministic → cache at the edge for a year, in the browser for an hour
            self.send_header("Cache-Control", "public, max-age=3600, s-maxage=31536000, immutable")
        else:
            self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *_args) -> None:  # quiet
        pass
