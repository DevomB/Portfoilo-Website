"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MATRIX_RANKS, RANGE_PRESETS, cellIndex, cellOf, classLabel, rangeComboCount } from "@/lib/handMatrix";

/* The Landscape.
   169 starting hands as an isometric terrain: height is equity against N
   random opponents on the current board, computed by the poker-calculations
   engine through /api/poker/landscape. A new board tweens the surface from
   the old heights to the new ones — every deformation is a real change in
   equity, never sampling noise (the API is seeded per request shape). */

type Quote = {
  equities: (number | null)[];
  board: string[];
  villains: number;
  iters: number;
  engine: "native" | "js";
  threads: number;
  ms: number;
  cached: boolean;
};

const SUIT_GLYPH: Record<string, string> = { s: "♠", h: "♥", d: "♦", c: "♣" };
const SUIT_RED = new Set(["h", "d"]);
const ALL_CARDS = MATRIX_RANKS.split("").flatMap((r) => ["s", "h", "d", "c"].map((s) => r + s));

// terrain geometry (SVG viewBox units)
const W = 820;
const H = 520;
const CX = W / 2;
const CY = H / 2 + 40;
const SCALE = 26;   // world unit → px
const HEIGHT = 190; // px at equity 1.0

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** sequential single-hue ramp (purple, dark→light) for 0..1 — text never wears it */
function ramp(t: number, shade: number): string {
  const L = 0.28 + 0.5 * clamp(t, 0, 1);         // OKLCH-ish lightness proxy
  const l = clamp(L * (0.75 + 0.35 * shade), 0, 1);
  const c = 0.16 + 0.1 * t;
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} 300)`;
}

export default function Landscape() {
  const [board, setBoard] = useState<string[]>([]);
  // the API prices 0, 3, 4 or 5 cards; while a flop is being picked one card at
  // a time, the terrain stays on the last complete board
  const boardForApi = useMemo(() => (board.length < 3 ? [] : board), [board]);
  const [villains, setVillains] = useState<1 | 2 | 3>(1);
  const [range, setRange] = useState<boolean[]>(() => new Array(169).fill(true));
  const [painting, setPainting] = useState<boolean | null>(null); // value being painted during drag
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [view, setView] = useState({ az: 0.62, el: 0.95 });
  const drag = useRef<{ x: number; y: number; az: number; el: number } | null>(null);
  const [dragging, setDragging] = useState(false); // render-side mirror of drag.current (cursor)

  // displayed heights tween toward the latest quote
  const [shown, setShown] = useState<Float32Array>(() => new Float32Array(169));
  const shownRef = useRef(shown);
  useEffect(() => { shownRef.current = shown; }, [shown]);
  const target = useRef<Float32Array>(new Float32Array(169));
  const reqKey = useMemo(() => `${[...boardForApi].sort().join(",")}|${villains}`, [boardForApi, villains]);
  const pending = !quote || `${[...quote.board].sort().join(",")}|${quote.villains}` !== reqKey;

  // fetch equities for the current board / villain count
  useEffect(() => {
    const ac = new AbortController();
    fetch("/api/poker/landscape", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ board: boardForApi, villains }),
      signal: ac.signal,
    })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
        setError(null);
        setQuote(data as Quote);
      })
      .catch((e: unknown) => {
        if ((e as Error).name === "AbortError") return;
        setError((e as Error).message);
      });
    return () => ac.abort();
  }, [boardForApi, villains]);

  // tween shown → target when a new quote lands (reduced-motion: snap in one
  // frame). Every state write happens inside a frame callback, never
  // synchronously in the effect body.
  useEffect(() => {
    if (!quote) return;
    for (let k = 0; k < 169; k++) target.current[k] = quote.equities[k] ?? 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = Float32Array.from(shownRef.current);
    const t0 = performance.now();
    const DUR = reduce ? 0 : 700;
    let raf = 0;
    const step = (now: number) => {
      const u = DUR === 0 ? 1 : clamp((now - t0) / DUR, 0, 1);
      const e = 1 - Math.pow(1 - u, 3); // easeOut cubic
      const next = new Float32Array(169);
      for (let k = 0; k < 169; k++) next[k] = from[k]! + (target.current[k]! - from[k]!) * e;
      setShown(next);
      if (u < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [quote]);

  // ── projection ──────────────────────────────────────────────────────────
  const project = useCallback(
    (i: number, j: number, h: number) => {
      const u = j - 6, v = i - 6;
      const ca = Math.cos(view.az), sa = Math.sin(view.az);
      const ur = u * ca - v * sa, vr = u * sa + v * ca;
      const se = Math.sin(view.el), ce = Math.cos(view.el);
      return { x: CX + ur * SCALE, y: CY + vr * SCALE * ce - h * HEIGHT * se, depth: vr };
    },
    [view],
  );

  // triangles, painter-sorted far→near, with a slope shade
  const tris = useMemo(() => {
    const dead = quote ? quote.equities.map((e) => e === null) : new Array(169).fill(false);
    const P: { x: number; y: number; depth: number }[] = [];
    for (let k = 0; k < 169; k++) {
      const { i, j } = cellOf(k);
      P.push(project(i, j, shown[k]!));
    }
    const out: { pts: string; depth: number; fill: string; k: number }[] = [];
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 12; j++) {
        const a = cellIndex(i, j), b = cellIndex(i, j + 1), c = cellIndex(i + 1, j + 1), d = cellIndex(i + 1, j);
        for (const [p, q, r] of [[a, b, c], [a, c, d]] as const) {
          const A = P[p]!, B = P[q]!, C = P[r]!;
          const ha = shown[p]!, hb = shown[q]!, hc = shown[r]!;
          const mean = (ha + hb + hc) / 3;
          // shade from the height gradient across the triangle (fake light from the upper-left)
          const slope = ((hb - ha) + (hc - ha)) * 2.2;
          const shade = clamp(0.55 + slope, 0.25, 1);
          const inRange = range[p] && range[q] && range[r];
          const isDead = dead[p] || dead[q] || dead[r];
          const fill = isDead
            ? "rgb(var(--brand-purple-rgb) / 0.08)"
            : inRange
              ? ramp(mean, shade)
              : `oklch(${(22 + 18 * mean).toFixed(1)}% 0.02 300)`; // outside the painted range: muted
          out.push({ pts: `${A.x.toFixed(1)},${A.y.toFixed(1)} ${B.x.toFixed(1)},${B.y.toFixed(1)} ${C.x.toFixed(1)},${C.y.toFixed(1)}`, depth: (A.depth + B.depth + C.depth) / 3, fill, k: p });
        }
      }
    }
    out.sort((s, t) => s.depth - t.depth);
    return out;
  }, [project, range, quote, shown]);

  // hover: nearest vertex to the pointer (a 24px+ hit area by construction)
  const svgRef = useRef<SVGSVGElement>(null);
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag.current) {
      const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y;
      setView({ az: drag.current.az + dx * 0.008, el: clamp(drag.current.el - dy * 0.006, 0.35, 1.45) });
      return;
    }
    const svg = svgRef.current; if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W, py = ((e.clientY - rect.top) / rect.height) * H;
    let best = -1, bd = Infinity;
    for (let k = 0; k < 169; k++) {
      const { i, j } = cellOf(k);
      const p = project(i, j, shown[k]!);
      const d = (p.x - px) ** 2 + (p.y - py) ** 2;
      if (d < bd) { bd = d; best = k; }
    }
    setHover(bd < 30 * 30 ? best : null);
  };

  // ── board editing ───────────────────────────────────────────────────────
  const inBoard = (c: string) => board.includes(c);
  const dealCard = (c: string) => {
    if (inBoard(c) || board.length >= 5) return;
    // the first three cards are the flop; the API accepts 0/3/4/5, so buffer until 3
    setBoard((b) => [...b, c]);
  };
  const dealRandom = (count: number) => {
    const free = ALL_CARDS.filter((c) => !inBoard(c));
    const picks: string[] = [];
    while (picks.length < count && free.length) picks.push(free.splice(Math.floor(Math.random() * free.length), 1)[0]!);
    setBoard((b) => [...b, ...picks].slice(0, 5));
  };

  // ── range painting ──────────────────────────────────────────────────────
  const paintCell = (k: number, value: boolean) => setRange((r) => (r[k] === value ? r : r.map((v, i) => (i === k ? value : v))));
  const applyPreset = (key: string) => {
    const preset = RANGE_PRESETS.find((p) => p.key === key)!;
    setRange(Array.from({ length: 169 }, (_, k) => preset.classes.has(classLabel(cellOf(k).i, cellOf(k).j))));
  };
  const rangeCombos = useMemo(() => rangeComboCount(range, boardForApi), [range, boardForApi]);
  const rangePct = ((rangeCombos / 1326) * 100).toFixed(1);

  // ranked list for the tooltip
  const ranks = useMemo(() => {
    if (!quote) return null;
    const order = quote.equities.map((e, k) => ({ e: e ?? -1, k })).sort((a, b) => b.e - a.e);
    const r = new Array<number>(169);
    order.forEach((o, idx) => { r[o.k] = idx + 1; });
    return r;
  }, [quote]);

  const hoverCell = hover !== null ? cellOf(hover) : null;
  const hoverEq = hover !== null && quote ? quote.equities[hover] : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      {/* ── terrain ── */}
      <div className="card-soft p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-2">
          <p className="font-mono text-fluid-xs text-muted">
            equity vs{" "}
            <span className="inline-flex gap-1">
              {([1, 2, 3] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setVillains(n)}
                  className={`rounded px-1.5 py-0.5 transition-colors ${villains === n ? "bg-accent-bg text-accent-dim" : "text-muted hover:text-ink"}`}
                >
                  {n}
                </button>
              ))}
            </span>{" "}
            random opponent{villains > 1 ? "s" : ""} · drag to rotate
          </p>
          <p className="font-mono text-[0.6rem] text-muted/70">
            {quote
              ? `${quote.engine === "native" ? "C++ engine" : "js fallback"} · ${quote.iters} iters/hand · ${quote.threads} threads · ${quote.cached ? "cached" : `${quote.ms} ms`}`
              : "pricing…"}
          </p>
        </div>

        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className={`w-full h-auto select-none touch-none ${pending ? "opacity-70" : ""} transition-opacity`}
            role="img"
            aria-label={`Equity terrain over 169 starting hands${boardForApi.length ? ` on board ${boardForApi.join(" ")}` : " preflop"}`}
            onPointerMove={onMove}
            onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY, az: view.az, el: view.el }; setDragging(true); (e.target as Element).setPointerCapture?.(e.pointerId); }}
            onPointerUp={() => { drag.current = null; setDragging(false); }}
            onPointerLeave={() => { drag.current = null; setDragging(false); setHover(null); }}
            style={{ cursor: dragging ? "grabbing" : "crosshair" }}
          >
            {/* ground plane */}
            {(() => {
              const c = [project(0, 0, 0), project(0, 12, 0), project(12, 12, 0), project(12, 0, 0)];
              return <polygon points={c.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} fill="rgb(var(--brand-purple-rgb) / 0.05)" stroke="rgb(var(--brand-purple-rgb) / 0.18)" strokeWidth={1} />;
            })()}
            {/* surface */}
            {tris.map((t, idx) => (
              <polygon key={idx} points={t.pts} fill={t.fill} stroke={t.fill} strokeWidth={0.6} />
            ))}
            {/* axis labels: ranks along the two front edges */}
            {MATRIX_RANKS.split("").map((r, i) => {
              const a = project(i, -0.9, 0), b = project(-0.9, i, 0);
              return (
                <g key={r} fontFamily="var(--font-mono), monospace" fontSize={11} fill="var(--color-muted)">
                  <text x={a.x} y={a.y + 4} textAnchor="middle">{r}</text>
                  <text x={b.x} y={b.y + 4} textAnchor="middle">{r}</text>
                </g>
              );
            })}
            {/* hovered vertex */}
            {hoverCell && (() => {
              const p = project(hoverCell.i, hoverCell.j, shown[hover!]!);
              const g = project(hoverCell.i, hoverCell.j, 0);
              return (
                <g>
                  <line x1={g.x} y1={g.y} x2={p.x} y2={p.y} stroke="var(--color-secondary)" strokeWidth={1} strokeOpacity={0.7} />
                  <circle cx={p.x} cy={p.y} r={5} fill="var(--color-secondary)" stroke="var(--color-bg)" strokeWidth={2} />
                </g>
              );
            })()}
          </svg>

          {hoverCell && hoverEq !== null && hoverEq !== undefined && (
            <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-accent/25 bg-surface px-3 py-2 shadow-card">
              <p className="font-sans text-fluid-lg font-semibold leading-none text-ink">
                {(hoverEq * 100).toFixed(1)}%
                <span className="ml-2 font-mono text-fluid-xs font-normal text-muted">{classLabel(hoverCell.i, hoverCell.j)}</span>
              </p>
              <p className="mt-1 font-mono text-[0.6rem] text-muted">
                #{ranks?.[hover!]} of 169 · {range[hover!] ? "in your range" : "outside your range"}
              </p>
            </div>
          )}
          {hoverCell && hoverEq === null && (
            <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-border bg-surface px-3 py-2">
              <p className="font-mono text-fluid-xs text-muted">{classLabel(hoverCell.i, hoverCell.j)} · no live combo on this board</p>
            </div>
          )}
          {error && (
            <p className="absolute right-3 top-3 font-mono text-[0.62rem] text-danger">{error}</p>
          )}
        </div>
      </div>

      {/* ── controls ── */}
      <div className="space-y-6">
        {/* board */}
        <div className="card-soft p-4">
          <div className="flex items-center justify-between">
            <p className="font-mono text-fluid-xs text-muted">board</p>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => dealRandom(board.length < 3 ? 3 - board.length : 1)} disabled={board.length >= 5}
                      className="chip-soft px-2.5 py-1 font-mono text-[0.62rem] text-ink disabled:opacity-40 hover:border-accent/40 transition-colors">
                {board.length < 3 ? "deal flop" : board.length === 3 ? "turn" : board.length === 4 ? "river" : "full"}
              </button>
              <button type="button" onClick={() => setBoard([])} disabled={board.length === 0}
                      className="chip-soft px-2.5 py-1 font-mono text-[0.62rem] text-muted disabled:opacity-40 hover:text-ink transition-colors">
                clear
              </button>
            </div>
          </div>
          <div className="mt-3 flex gap-1.5 min-h-[3.2rem]">
            {Array.from({ length: 5 }, (_, i) => board[i]).map((c, i) => (
              <button
                key={i}
                type="button"
                onClick={() => c && setBoard((b) => b.filter((x) => x !== c))}
                title={c ? "remove" : undefined}
                className={`h-12 w-9 rounded-md border font-mono text-sm font-bold ${c ? "border-card-edge bg-white" : "border-dashed border-accent/20 bg-accent/5"}`}
                style={{ color: c && SUIT_RED.has(c[1]!) ? "var(--color-card-red)" : "var(--color-card-black)" }}
              >
                {c ? <>{c[0] === "T" ? "10" : c[0]}<span className="block text-[0.7rem] leading-none">{SUIT_GLYPH[c[1]!]}</span></> : null}
              </button>
            ))}
          </div>
          {board.length > 0 && board.length < 3 && (
            <p className="mt-2 font-mono text-[0.6rem] text-muted">pick {3 - board.length} more for the flop</p>
          )}
          {/* picker */}
          <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
            {(["s", "h", "d", "c"] as const).map((s) => (
              <div key={s} className="contents">
                <span className="font-mono text-[0.7rem]" style={{ color: SUIT_RED.has(s) ? "var(--color-card-red)" : "var(--color-ink)" }}>{SUIT_GLYPH[s]}</span>
                <div className="flex flex-wrap gap-[3px]">
                  {MATRIX_RANKS.split("").map((r) => {
                    const c = r + s; const used = inBoard(c);
                    return (
                      <button key={c} type="button" onClick={() => dealCard(c)} disabled={used || board.length >= 5}
                              className={`h-5 w-[1.15rem] rounded-sm font-mono text-[0.6rem] transition-colors ${used ? "bg-accent/30 text-ink/40" : "bg-surface-elevated text-muted hover:text-ink hover:bg-accent-bg"} disabled:cursor-default`}>
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* range painter */}
        <div className="card-soft p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-fluid-xs text-muted">your range · {rangeCombos} combos · {rangePct}%</p>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {RANGE_PRESETS.map((p) => (
              <button key={p.key} type="button" onClick={() => applyPreset(p.key)}
                      className="chip-soft px-2 py-0.5 font-mono text-[0.6rem] text-muted hover:text-ink hover:border-accent/40 transition-colors">
                {p.label}
              </button>
            ))}
            <button type="button" onClick={() => setRange(new Array(169).fill(false))}
                    className="chip-soft px-2 py-0.5 font-mono text-[0.6rem] text-muted hover:text-ink transition-colors">
              none
            </button>
          </div>
          <div
            className="mt-3 grid select-none touch-none"
            style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))", gap: 2 }}
            onPointerLeave={() => setPainting(null)}
            onPointerUp={() => setPainting(null)}
          >
            {Array.from({ length: 169 }, (_, k) => {
              const { i, j } = cellOf(k);
              const on = range[k];
              const eq = quote?.equities[k];
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on}
                  aria-label={classLabel(i, j)}
                  onPointerDown={(e) => { e.preventDefault(); const v = !on; setPainting(v); paintCell(k, v); }}
                  onPointerEnter={() => { if (painting !== null) paintCell(k, painting); }}
                  onMouseEnter={() => setHover(k)}
                  onMouseLeave={() => setHover(null)}
                  className={`aspect-square rounded-[2px] font-mono text-[0.5rem] leading-none transition-colors ${on ? "text-ink" : "text-muted/40"}`}
                  style={{
                    background: on
                      ? `rgb(var(--brand-green-rgb) / ${0.18 + 0.5 * (eq ?? 0.5)})`
                      : "rgb(var(--brand-purple-rgb) / 0.07)",
                    outline: hover === k ? "1px solid var(--color-secondary)" : undefined,
                  }}
                >
                  {classLabel(i, j)}
                </button>
              );
            })}
          </div>
          <p className="mt-2 font-mono text-[0.58rem] text-muted/70">click or drag to paint · cells shade by equity</p>
        </div>
      </div>
    </div>
  );
}
