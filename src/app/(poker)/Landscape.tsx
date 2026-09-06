"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Terrain, { type TriFill } from "@/app/(poker)/Terrain";
import BoardPicker from "@/app/(poker)/BoardPicker";
import RangePainter from "@/app/(poker)/RangePainter";
import { cellOf, classLabel } from "@/app/(poker)/handMatrix";

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
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState<number | null>(null);

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

  const target = useMemo(() => Float32Array.from({ length: 169 }, (_, k) => quote?.equities[k] ?? 0), [quote]);

  const triFill = useCallback<TriFill>(
    (p, q, r, mean, shade) => {
      const dead = quote ? quote.equities[p] === null || quote.equities[q] === null || quote.equities[r] === null : false;
      if (dead) return "rgb(var(--brand-purple-rgb) / 0.08)";
      const inRange = range[p] && range[q] && range[r];
      return inRange ? ramp(mean, shade) : `oklch(${(22 + 18 * mean).toFixed(1)}% 0.02 300)`; // outside the painted range: muted
    },
    [quote, range],
  );

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
  const shade = useCallback((k: number) => quote?.equities[k] ?? 0.5, [quote]);

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

        <Terrain
          target={target}
          triFill={triFill}
          hover={hover}
          onHover={setHover}
          pending={pending}
          ariaLabel={`Equity terrain over 169 starting hands${boardForApi.length ? ` on board ${boardForApi.join(" ")}` : " preflop"}`}
        >
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
        </Terrain>
      </div>

      {/* ── controls ── */}
      <div className="space-y-6">
        <BoardPicker board={board} onChange={setBoard} variant="streets" />
        <RangePainter
          title="your range"
          range={range}
          setRange={setRange}
          board={boardForApi}
          hover={hover}
          onHover={setHover}
          shade={shade}
          caption="click or drag to paint · cells shade by equity"
        />
      </div>
    </div>
  );
}
