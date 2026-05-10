"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { dealRandomHoleCards } from "@/lib/pokerCards";

const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const SUITS = [
  { code: "h", label: "♥" },
  { code: "d", label: "♦" },
  { code: "c", label: "♣" },
  { code: "s", label: "♠" },
];

const POKER_CALC_NPM = "https://www.npmjs.com/package/poker-calculations";
const POKER_CALC_REPO = "https://github.com/DevomB/Poker-Calculations";

const inputCls =
  "mt-1.5 min-h-11 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-[16px] text-ink outline-none ring-accent-blue/40 transition placeholder:text-muted/60 focus:border-accent-blue/50 focus:ring-2 sm:text-fluid-base";

function parseCodes(line: string): string[] {
  return line
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatCard(rankChar: string, suitCode: string): string {
  return `${rankChar}${suitCode}`;
}

type EquityResult = {
  equity: number;
  iterations: number;
  seed: number;
  durationMs: number;
  iterationsPerSec: number;
  heroDisplay: string[];
  boardDisplay: string[];
};

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

  const appendCard = useCallback(
    (rankChar: string, suitCode: string) => {
      const code = formatCard(rankChar, suitCode);
      if (cardTarget === "hero") {
        const next = [...heroCodes];
        if (next.length >= 2) {
          setHeroLine(`${next[0]!} ${code}`);
        } else if (next.length === 1) {
          setHeroLine(`${next[0]!} ${code}`);
        } else {
          setHeroLine(code);
        }
        return;
      }
      const b = [...boardCodes];
      if (b.length >= 5) {
        setBoardLine([...b.slice(0, 4), code].join(" "));
      } else {
        setBoardLine([...b, code].join(" "));
      }
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
        body: JSON.stringify({
          heroLine,
          boardLine,
          iterations,
          seed: seed >>> 0,
        }),
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
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

  const display = finalResult;

  const chipBtn =
    "inline-flex min-h-10 min-w-10 touch-manipulation items-center justify-center rounded-lg border border-border bg-surface-elevated text-fluid-sm font-medium text-ink transition hover:border-accent-blue/40 hover:bg-white active:scale-[0.98]";

  return (
    <section id="demo" className="relative z-10 scroll-mt-28 section-y">
      <div className="card-soft p-5 sm:p-8 md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-8">
          <div>
            <p className="text-fluid-xs font-semibold uppercase tracking-[0.24em] text-muted">
              Monte Carlo lab
            </p>
            <h2 className="font-heading mt-3 text-fluid-3xl font-semibold tracking-tight text-ink">
              PokerLab · NL Hold&apos;em equity
            </h2>
            <p className="prose-readable mt-3 max-w-2xl text-fluid-sm leading-relaxed text-muted">
              Monte Carlo equity vs one random villain, optional board runouts,
              and deterministic{" "}
              <span className="font-medium text-accent-purple">uint32</span>{" "}
              seeding. Evaluation runs in{" "}
              <Link
                href={POKER_CALC_NPM}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-blue underline decoration-accent-blue/35 underline-offset-2 hover:decoration-accent-blue"
              >
                poker-calculations
              </Link>
              — the same package I publish for hold&apos;em sims — on the
              server; this page is just the control surface.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-2 md:w-auto md:items-end">
            <Link
              href="https://github.com/DevomB/Poker-Bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 w-full touch-manipulation items-center justify-center rounded-full border border-border bg-surface-elevated px-5 text-fluid-sm font-semibold text-accent-blue transition hover:border-accent-blue/40 hover:bg-accent-blue/10 md:min-h-0 md:w-auto"
            >
              Poker-Bot on GitHub
            </Link>
            <Link
              href={POKER_CALC_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 w-full touch-manipulation items-center justify-center rounded-full border border-border/80 px-4 text-fluid-xs font-medium text-muted transition hover:border-accent-purple/30 hover:text-ink md:w-auto"
            >
              Engine source
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-5">
            <div className="lg:hidden">
              <p className="text-fluid-xs font-medium text-muted">Quick pick</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCardTarget("hero")}
                  className={`min-h-10 touch-manipulation rounded-lg border px-3 text-fluid-xs font-semibold transition ${
                    cardTarget === "hero"
                      ? "border-accent-blue bg-accent-blue/15 text-ink"
                      : "border-border text-muted hover:text-ink"
                  }`}
                >
                  Add to hero
                </button>
                <button
                  type="button"
                  onClick={() => setCardTarget("board")}
                  className={`min-h-10 touch-manipulation rounded-lg border px-3 text-fluid-xs font-semibold transition ${
                    cardTarget === "board"
                      ? "border-accent-blue bg-accent-blue/15 text-ink"
                      : "border-border text-muted hover:text-ink"
                  }`}
                >
                  Add to board
                </button>
              </div>
              <p className="mt-3 text-fluid-xs text-muted">
                Choose rank, then suit to drop one card. Full hero updates the second
                card; board stops at five.
                {pendingRank ? (
                  <span className="ml-2 font-semibold text-accent-blue">
                    · rank {pendingRank}
                  </span>
                ) : null}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {RANKS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPendingRank((p) => (p === r ? null : r))}
                    aria-pressed={pendingRank === r}
                    className={`${chipBtn} ${
                      pendingRank === r
                        ? "border-accent-blue bg-accent-blue/15 text-ink"
                        : ""
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-fluid-xs text-muted">Suits</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {SUITS.map((s) => (
                  <button
                    key={s.code}
                    type="button"
                    disabled={!pendingRank}
                    className={`${chipBtn} min-w-[2.75rem] text-lg leading-none disabled:opacity-35`}
                    onClick={() => {
                      if (!pendingRank) return;
                      appendCard(pendingRank, s.code);
                      setPendingRank(null);
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <p className="text-fluid-xs font-medium text-muted">
                Quick pick (desktop)
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCardTarget("hero")}
                  className={`rounded-md border px-2.5 py-1.5 text-fluid-xs font-medium ${
                    cardTarget === "hero"
                      ? "border-accent-blue/50 bg-accent-blue/10 text-ink"
                      : "border-border text-muted"
                  }`}
                >
                  Hero
                </button>
                <button
                  type="button"
                  onClick={() => setCardTarget("board")}
                  className={`rounded-md border px-2.5 py-1.5 text-fluid-xs font-medium ${
                    cardTarget === "board"
                      ? "border-accent-blue/50 bg-accent-blue/10 text-ink"
                      : "border-border text-muted"
                  }`}
                >
                  Board
                </button>
              </div>
              <div className="mt-3 flex max-w-xl flex-wrap gap-1">
                {RANKS.map((r) =>
                  SUITS.map((s) => (
                    <button
                      key={`${r}${s.code}`}
                      type="button"
                      className="rounded border border-border bg-surface-elevated px-1.5 py-1 text-[11px] font-medium text-muted transition hover:border-accent-blue/35 hover:text-ink"
                      onClick={() => appendCard(r, s.code)}
                    >
                      {r}
                      {s.code}
                    </button>
                  )),
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border pt-4 lg:border-t-0 lg:pt-0">
              <button
                type="button"
                onClick={() => setHeroLine("Ah Ad")}
                className="min-h-10 touch-manipulation rounded-lg border border-border px-3 text-fluid-xs font-medium text-muted transition hover:text-ink"
              >
                Preset AA
              </button>
              <button
                type="button"
                onClick={() => setHeroLine("Ah Kh")}
                className="min-h-10 touch-manipulation rounded-lg border border-border px-3 text-fluid-xs font-medium text-muted transition hover:text-ink"
              >
                Preset AKs
              </button>
              <button
                type="button"
                onClick={() => setHeroLine("Ah Kd")}
                className="min-h-10 touch-manipulation rounded-lg border border-border px-3 text-fluid-xs font-medium text-muted transition hover:text-ink"
              >
                Preset AKo
              </button>
              <button
                type="button"
                onClick={() => setBoardLine("")}
                className="min-h-10 touch-manipulation rounded-lg border border-border px-3 text-fluid-xs font-medium text-muted transition hover:text-ink"
              >
                Clear board
              </button>
              <button
                type="button"
                onClick={() => setHeroLine("")}
                className="min-h-10 touch-manipulation rounded-lg border border-border px-3 text-fluid-xs font-medium text-muted transition hover:text-ink"
              >
                Clear hero
              </button>
            </div>

            <label className="block">
              <span className="text-fluid-sm text-muted">
                Hero hole cards (e.g. Ah Kd)
              </span>
              <input
                value={heroLine}
                onChange={(e) => setHeroLine(e.target.value)}
                className={inputCls}
                spellCheck={false}
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className="text-fluid-sm text-muted">
                Board (optional: 0, 3, 4, or 5 cards — comma or space separated)
              </span>
              <input
                value={boardLine}
                onChange={(e) => setBoardLine(e.target.value)}
                placeholder="Js Ts 2c"
                className={inputCls}
                spellCheck={false}
                autoComplete="off"
              />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-fluid-sm text-muted">Iterations</span>
                <input
                  type="number"
                  min={500}
                  max={250000}
                  step={500}
                  value={iterations}
                  onChange={(e) => {
                    const v = Number.parseInt(e.target.value, 10);
                    setIterations(
                      Number.isFinite(v)
                        ? Math.min(250000, Math.max(500, v))
                        : 6000,
                    );
                  }}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="text-fluid-sm text-muted">RNG seed (uint32)</span>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) =>
                    setSeed(Number.parseInt(e.target.value, 10) >>> 0 || 0)
                  }
                  className={inputCls}
                />
              </label>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={randomizeHero}
                disabled={running}
                className="min-h-11 w-full touch-manipulation rounded-full border border-border px-4 text-fluid-sm font-semibold text-ink transition hover:bg-surface-elevated disabled:opacity-50 sm:min-h-10 sm:w-auto"
              >
                Random hero (updates seed)
              </button>
              <button
                type="button"
                onClick={run}
                disabled={running}
                className="min-h-11 w-full touch-manipulation rounded-full bg-accent-blue px-5 text-fluid-sm font-semibold text-white shadow-card transition hover:bg-accent-blue-dim disabled:opacity-50 sm:min-h-10 sm:w-auto"
              >
                {running ? "Running…" : "Run Monte Carlo"}
              </button>
            </div>
            {error ? (
              <p
                className="rounded-lg border border-accent-purple/35 bg-accent-purple/10 px-3 py-2 text-fluid-sm text-accent-purple"
                role="alert"
              >
                {error}
              </p>
            ) : null}
          </div>

          <div className="card-soft p-5 sm:p-6">
            <h3 className="font-heading text-fluid-lg font-semibold text-ink">
              Results
            </h3>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-fluid-sm">
              <dt className="text-muted">Hero equity</dt>
              <dd className="text-right font-mono text-fluid-xl font-bold text-accent-purple">
                {display ? `${display.equity.toFixed(2)}%` : "—"}
              </dd>
              <dt className="text-muted">Simulations</dt>
              <dd className="text-right font-mono text-muted">
                {display ? display.iterations : "—"}
              </dd>
              {display ? (
                <>
                  <dt className="text-muted">Throughput</dt>
                  <dd className="text-right font-mono text-accent-blue">
                    {display.iterationsPerSec.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    iter/s
                  </dd>
                  <dt className="text-muted">Wall time</dt>
                  <dd className="text-right font-mono text-muted">
                    {display.durationMs.toFixed(1)} ms
                  </dd>
                </>
              ) : null}
            </dl>
            <p className="mt-6 text-fluid-xs leading-relaxed text-muted">
              Demo-only (no burns). For full game coverage and parallel sims, see
              the C++ Poker-Bot repo; this lab uses the published{" "}
              <Link
                href={POKER_CALC_NPM}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue underline decoration-accent-blue/30 underline-offset-2"
              >
                npm
              </Link>{" "}
              build.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
