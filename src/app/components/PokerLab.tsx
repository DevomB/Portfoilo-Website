"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dealRandomHoleCards } from "@/lib/pokerCards";

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const SUITS = [
  { code: "h", label: "♥", red: true },
  { code: "d", label: "♦", red: true },
  { code: "c", label: "♣", red: false },
  { code: "s", label: "♠", red: false },
];

type CardData = { rank: string; suitLabel: string; red: boolean; code: string; isHero: boolean };

// Fixed fan slots: index 0 = far left (bottom of stack), index 6 = far right (top, cut off)
// Rotation and y-offset per slot for a hand-of-cards fan effect
const FAN_ROTATION = [-22, -15, -9, -3, 4, 10, 16];
const FAN_Y = [-6, -12, -16, -18, -14, -8, 0]; // arc — middle cards peak higher

function parseCodes(line: string): string[] {
  return line.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
}

function parseCards(line: string, isHero: boolean): CardData[] {
  return parseCodes(line)
    .map((code) => {
      const rank = code.slice(0, -1);
      const suitCode = code.slice(-1);
      const suit = SUITS.find((s) => s.code === suitCode);
      if (!suit || !rank) return null;
      return { rank, suitLabel: suit.label, red: suit.red, code, isHero };
    })
    .filter((x): x is CardData => x !== null);
}

// ── Playing card — big version for the fan ────────────────
function FanCard({
  card,
  fanIndex,
}: {
  card: CardData;
  fanIndex: number;
}) {
  const color = card.red ? "#b83232" : "#1c1916";
  const rotation = FAN_ROTATION[fanIndex] ?? 0;
  const yOffset = FAN_Y[fanIndex] ?? 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, rotate: rotation + 15 }}
      animate={{ opacity: 1, y: yOffset, rotate: rotation }}
      exit={{ opacity: 0, y: 30, rotate: rotation + 8 }}
      transition={{
        duration: 0.38,
        delay: fanIndex * 0.04,
        ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
      }}
      style={{
        width: 86,
        height: 122,
        borderRadius: 10,
        background: "linear-gradient(160deg, #ffffff 0%, #fdfaf4 100%)",
        border: card.isHero ? "2px solid #276787" : "1.5px solid #cfc3a6",
        boxShadow: card.isHero
          ? "0 8px 28px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.12), 0 0 0 2px rgba(39,103,135,0.18)"
          : "0 6px 22px rgba(0,0,0,0.18), 0 2px 5px rgba(0,0,0,0.1)",
        position: "relative",
        flexShrink: 0,
        userSelect: "none",
        transformOrigin: "bottom center",
        zIndex: fanIndex,
        marginLeft: fanIndex > 0 ? -58 : 0,
      }}
    >
      {/* top-left pip */}
      <div
        style={{
          position: "absolute", top: 7, left: 8,
          color, lineHeight: 1,
          fontFamily: "var(--font-mono), ui-monospace, monospace",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800 }}>{card.rank}</div>
        <div style={{ fontSize: 11, marginTop: 2 }}>{card.suitLabel}</div>
      </div>

      {/* center suit */}
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          color, fontSize: 40, lineHeight: 1,
        }}
      >
        {card.suitLabel}
      </div>

      {/* bottom-right pip (rotated 180°) */}
      <div
        style={{
          position: "absolute", bottom: 7, right: 8,
          color, lineHeight: 1, transform: "rotate(180deg)",
          fontFamily: "var(--font-mono), ui-monospace, monospace",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 800 }}>{card.rank}</div>
        <div style={{ fontSize: 11, marginTop: 2 }}>{card.suitLabel}</div>
      </div>
    </motion.div>
  );
}

// ── Equity result type ─────────────────────────────────────
type EquityResult = {
  equity: number;
  iterations: number;
  durationMs: number;
  iterationsPerSec: number;
};

// ── Main component ─────────────────────────────────────────
export default function PokerLab() {
  const [heroLine, setHeroLine] = useState("Ah Kd");
  const [boardLine, setBoardLine] = useState("");
  const [iterations, setIterations] = useState(6000);
  const [seed, setSeed] = useState(2463534242);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [finalResult, setFinalResult] = useState<EquityResult | null>(null);
  const [cardTarget, setCardTarget] = useState<"hero" | "board">("hero");
  const [pendingRank, setPendingRank] = useState<string | null>(null);

  const heroCodes = useMemo(() => parseCodes(heroLine), [heroLine]);
  const boardCodes = useMemo(() => parseCodes(boardLine), [boardLine]);
  const heroCards = useMemo(() => parseCards(heroLine, true), [heroLine]);
  const boardCards = useMemo(() => parseCards(boardLine, false), [boardLine]);

  // All selected cards assigned to fixed fan slots (hero = slots 0-1, board = slots 2-6)
  const fanCards = useMemo(() => {
    const slots: ({ card: CardData; fanIndex: number } | null)[] = [];
    heroCards.slice(0, 2).forEach((card, i) => slots.push({ card, fanIndex: i }));
    boardCards.slice(0, 5).forEach((card, i) => slots.push({ card, fanIndex: i + 2 }));
    return slots.filter((x): x is { card: CardData; fanIndex: number } => x !== null);
  }, [heroCards, boardCards]);

  const appendCard = useCallback(
    (rank: string, suit: string) => {
      const code = `${rank}${suit}`;
      if (cardTarget === "hero") {
        const next = [...heroCodes];
        setHeroLine(next.length >= 1 ? `${next[0]!} ${code}` : code);
        return;
      }
      const b = [...boardCodes];
      setBoardLine(b.length >= 5 ? [...b.slice(0, 4), code].join(" ") : [...b, code].join(" "));
    },
    [boardCodes, cardTarget, heroCodes],
  );

  const randomizeHero = useCallback(() => {
    const nextSeed = Math.floor(Math.random() * 0xffffffff);
    const [a, b] = dealRandomHoleCards(nextSeed);
    setHeroLine(`${a} ${b}`);
    setSeed(nextSeed >>> 0);
  }, []);

  const run = async () => {
    setError("");
    setFinalResult(null);
    setRunning(true);
    try {
      const res = await fetch("/api/poker/equity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroLine, boardLine, iterations, seed: seed >>> 0 }),
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        const msg =
          data && typeof data === "object" && "error" in data && typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Simulation failed.";
        throw new Error(msg);
      }
      setFinalResult(data as EquityResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Simulation failed.");
    } finally {
      setRunning(false);
    }
  };

  const inputStyle = {
    borderColor: "var(--color-border)",
    background: "var(--color-surface-elevated)",
    fontSize: "16px",
  } as const;

  const inputCls =
    "w-full rounded-md border px-3 py-2 font-mono text-ink outline-none transition-colors focus:border-accent/50";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

      {/* ── LEFT: Controls ───────────────────────────── */}
      <div className="space-y-5">

        {/* Target + picker */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {(["hero", "board"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setCardTarget(t); setPendingRank(null); }}
                className="px-3 py-1.5 rounded-md border font-mono text-fluid-xs font-medium transition-colors"
                style={{
                  borderColor: cardTarget === t ? "var(--color-accent)" : "var(--color-border)",
                  background: cardTarget === t ? "var(--color-accent-bg)" : "transparent",
                  color: cardTarget === t ? "var(--color-accent-dim)" : "var(--color-muted)",
                }}
              >
                {t}
              </button>
            ))}
            {pendingRank && (
              <span className="font-mono text-fluid-xs text-accent ml-1">
                → pick suit for {pendingRank}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {RANKS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setPendingRank((p) => (p === r ? null : r))}
                className="w-9 h-9 font-mono text-fluid-xs font-semibold rounded-md border transition-colors"
                style={{
                  borderColor: pendingRank === r ? "var(--color-accent)" : "var(--color-border)",
                  background: pendingRank === r ? "var(--color-accent-bg)" : "var(--color-surface-elevated)",
                  color: pendingRank === r ? "var(--color-accent)" : "var(--color-ink)",
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {SUITS.map((s) => (
              <button
                key={s.code}
                type="button"
                disabled={!pendingRank}
                onClick={() => {
                  if (!pendingRank) return;
                  appendCard(pendingRank, s.code);
                  setPendingRank(null);
                }}
                className="w-12 h-12 text-xl rounded-md border border-border bg-surface-elevated transition-colors hover:border-accent/40 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ color: s.red ? "#b83232" : "var(--color-ink)" }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-1.5">
          {([["AA", "Ah Ad"], ["AKs", "Ah Kh"], ["AKo", "Ah Kd"]] as [string, string][]).map(
            ([label, val]) => (
              <button
                key={label}
                type="button"
                onClick={() => setHeroLine(val)}
                className="px-2.5 py-1 rounded-md border border-border font-mono text-fluid-xs text-muted hover:text-ink transition-colors"
                style={{ background: "var(--color-surface-elevated)" }}
              >
                {label}
              </button>
            ),
          )}
          <button
            type="button"
            onClick={() => setBoardLine("")}
            className="px-2.5 py-1 rounded-md border border-border font-mono text-fluid-xs text-muted hover:text-ink transition-colors"
            style={{ background: "var(--color-surface-elevated)" }}
          >
            clear board
          </button>
          <button
            type="button"
            onClick={() => setHeroLine("")}
            className="px-2.5 py-1 rounded-md border border-border font-mono text-fluid-xs text-muted hover:text-ink transition-colors"
            style={{ background: "var(--color-surface-elevated)" }}
          >
            clear hero
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <label className="block">
            <span className="font-mono text-fluid-xs text-muted mb-1.5 block">hero hole cards</span>
            <input value={heroLine} onChange={(e) => setHeroLine(e.target.value)} className={inputCls} style={inputStyle} spellCheck={false} autoComplete="off" />
          </label>
          <label className="block">
            <span className="font-mono text-fluid-xs text-muted mb-1.5 block">board — optional (3, 4, or 5 cards)</span>
            <input value={boardLine} onChange={(e) => setBoardLine(e.target.value)} placeholder="Js Ts 2c" className={inputCls} style={inputStyle} spellCheck={false} autoComplete="off" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="font-mono text-fluid-xs text-muted mb-1.5 block">iterations</span>
              <input type="number" min={500} max={250000} step={500} value={iterations}
                onChange={(e) => { const v = Number.parseInt(e.target.value, 10); setIterations(Number.isFinite(v) ? Math.min(250000, Math.max(500, v)) : 6000); }}
                className={inputCls} style={inputStyle} />
            </label>
            <label className="block">
              <span className="font-mono text-fluid-xs text-muted mb-1.5 block">seed (uint32)</span>
              <input type="number" value={seed} onChange={(e) => setSeed(Number.parseInt(e.target.value, 10) >>> 0 || 0)} className={inputCls} style={inputStyle} />
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={randomizeHero}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-fluid-sm font-medium text-muted hover:text-ink transition-colors disabled:opacity-50"
            style={{ background: "var(--color-surface-elevated)" }}
          >
            Random hero
          </button>
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-md px-5 py-2 text-fluid-sm font-semibold transition-colors disabled:opacity-50"
            style={{ background: "var(--color-accent)", color: "var(--color-surface-elevated)" }}
            onMouseEnter={(e) => { if (!running) e.currentTarget.style.background = "var(--color-accent-dim)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-accent)"; }}
          >
            {running ? "Running…" : "Run Monte Carlo"}
          </button>
        </div>

        {error && (
          <p className="rounded-md border px-3 py-2 font-mono text-fluid-xs"
            style={{ borderColor: "rgba(180,50,50,0.3)", background: "rgba(180,50,50,0.06)", color: "#b83232" }}
            role="alert">
            {error}
          </p>
        )}
      </div>

      {/* ── RIGHT: Results + fanned card hand ────────────── */}
      <div
        className="relative rounded-xl border"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-surface-elevated)",
          minHeight: 420,
          overflow: "hidden",
        }}
      >
        <div className="p-5 sm:p-6">
          <p className="font-mono text-fluid-xs text-accent tracking-wide mb-5">// results</p>

          <dl className="space-y-3">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-fluid-sm text-muted">Hero equity</dt>
              <dd
                className="font-mono font-bold tabular-nums"
                style={{
                  fontSize: "var(--text-3xl)",
                  color: finalResult ? "var(--color-accent)" : "var(--color-muted)",
                  opacity: finalResult ? 1 : 0.3,
                }}
              >
                {finalResult ? `${finalResult.equity.toFixed(2)}%` : "—"}
              </dd>
            </div>

            <div className="w-full h-px" style={{ background: "var(--color-border)" }} />

            <div className="flex items-baseline justify-between">
              <dt className="font-mono text-fluid-xs text-muted">iterations</dt>
              <dd className="font-mono text-fluid-xs text-muted tabular-nums">
                {finalResult ? finalResult.iterations.toLocaleString() : "—"}
              </dd>
            </div>
            {finalResult && (
              <>
                <div className="flex items-baseline justify-between">
                  <dt className="font-mono text-fluid-xs text-muted">throughput</dt>
                  <dd className="font-mono text-fluid-xs tabular-nums" style={{ color: "var(--color-accent)" }}>
                    {finalResult.iterationsPerSec.toLocaleString(undefined, { maximumFractionDigits: 0 })} iter/s
                  </dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="font-mono text-fluid-xs text-muted">wall time</dt>
                  <dd className="font-mono text-fluid-xs text-muted tabular-nums">
                    {finalResult.durationMs.toFixed(1)} ms
                  </dd>
                </div>
              </>
            )}
          </dl>

          {!finalResult && !running && (
            <p className="mt-6 font-mono whitespace-pre"
              style={{ fontSize: "0.6rem", color: "var(--color-muted)", opacity: 0.4, lineHeight: 1.7 }}>
              {`SELECT equity\nFROM simulations\nWHERE hero = '${heroLine || "?"}'\nLIMIT 1;`}
            </p>
          )}

          {running && (
            <div className="mt-6 flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
              <span className="font-mono text-fluid-xs text-accent">simulating…</span>
            </div>
          )}

          {/* Card legend */}
          {fanCards.length > 0 && (
            <div className="mt-8 flex items-center gap-3">
              <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--color-accent)", opacity: 0.7, letterSpacing: "0.08em" }}>
                hero
              </span>
              <div className="w-4 h-px" style={{ background: "var(--color-border)" }} />
              <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--color-muted)", opacity: 0.5, letterSpacing: "0.08em" }}>
                board
              </span>
            </div>
          )}
        </div>

        {/* ── Card fan — bottom-right, fanned like a hand ── */}
        <div
          className="absolute flex items-end pointer-events-none"
          style={{ bottom: -18, right: -50 }}
        >
          <AnimatePresence mode="sync">
            {fanCards.map(({ card, fanIndex }) => (
              <FanCard key={card.code} card={card} fanIndex={fanIndex} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
