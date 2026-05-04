"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { dealRandomHoleCards } from "../../lib/poker/cards.js";
import { simulateEquityAsync } from "../../lib/poker/simulate.js";

function parseCodes(line) {
  return line
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function PokerLab() {
  const [heroLine, setHeroLine] = useState("Ah Kd");
  const [boardLine, setBoardLine] = useState("");
  const [iterations, setIterations] = useState(6000);
  const [seed, setSeed] = useState(2463534242);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [live, setLive] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  const heroCodes = useMemo(() => parseCodes(heroLine), [heroLine]);
  const boardCodes = useMemo(() => parseCodes(boardLine), [boardLine]);

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
    setLive(null);
    const t0 =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    try {
      const result = await simulateEquityAsync({
        heroCodes,
        boardCodes,
        iterations,
        seed: seed >>> 0,
        chunkSize: 800,
        onChunk: (s) => setLive({ ...s }),
      });
      const t1 =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      result.durationMs = t1 - t0;
      const sec = Math.max((t1 - t0) / 1000, 1e-6);
      result.iterationsPerSec = iterations / sec;
      setFinalResult(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Simulation failed.");
    } finally {
      setRunning(false);
    }
  };

  const display = finalResult ?? live;

  return (
    <section id="demo" className="relative z-10 scroll-mt-28 py-16 md:py-24">
      <div className="rounded-2xl border border-border bg-surface/80 p-6 shadow-glow backdrop-blur-md md:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
              Monte Carlo lab
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white md:text-4xl">
              PokerLab · NL Hold&apos;em equity
            </h2>
            <p className="mt-3 max-w-2xl text-muted">
              Uniform random villain hole cards with collision checks, unknown
              board runouts, deterministic{" "}
              <span className="text-accent-purple">mulberry32</span> RNG, and{" "}
              <span className="text-accent-blue">C(7,5)</span> seven-card
              evaluation — all on the main thread in yielding chunks so the UI
              stays responsive.
            </p>
          </div>
          <Link
            href="https://github.com/DevomB/Poker-Bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-accent-blue/40 bg-accent-blue/10 px-4 py-3 text-sm font-medium text-accent-blue transition hover:bg-accent-blue/20"
          >
            Production engine (C++ + CMake + tests)
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-muted">
                Hero hole cards (e.g. Ah Kd)
              </span>
              <input
                value={heroLine}
                onChange={(e) => setHeroLine(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-white outline-none ring-accent-blue/40 focus:ring-2"
                spellCheck={false}
              />
            </label>
            <label className="block">
              <span className="text-sm text-muted">
                Board (optional: 0, 3, 4, or 5 cards — comma or space separated)
              </span>
              <input
                value={boardLine}
                onChange={(e) => setBoardLine(e.target.value)}
                placeholder="Js Ts 2c"
                className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-white outline-none ring-accent-blue/40 focus:ring-2"
                spellCheck={false}
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-muted">Iterations</span>
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
                  className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-white outline-none ring-accent-blue/40 focus:ring-2"
                />
              </label>
              <label className="block">
                <span className="text-sm text-muted">RNG seed (uint32)</span>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) =>
                    setSeed(Number.parseInt(e.target.value, 10) >>> 0 || 0)
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-white outline-none ring-accent-blue/40 focus:ring-2"
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={randomizeHero}
                disabled={running}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-white transition hover:border-accent-blue hover:text-accent-blue disabled:opacity-50"
              >
                Random hero (updates seed)
              </button>
              <button
                type="button"
                onClick={run}
                disabled={running}
                className="rounded-lg bg-accent-blue px-5 py-2 text-sm font-semibold text-bg shadow-glow transition hover:bg-accent-blue-dim disabled:opacity-50"
              >
                {running ? "Running…" : "Run Monte Carlo"}
              </button>
            </div>
            {error ? (
              <p className="rounded-md border border-accent-purple/40 bg-accent-purple/10 px-3 py-2 text-sm text-accent-purple" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="rounded-xl border border-border bg-bg/60 p-6">
            <h3 className="text-lg font-semibold text-white">Live results</h3>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <dt className="text-muted">Hero equity</dt>
              <dd className="text-right font-mono text-xl font-bold text-accent-purple">
                {display ? `${display.equity.toFixed(2)}%` : "—"}
              </dd>
              <dt className="text-muted">Wins / ties / losses</dt>
              <dd className="text-right font-mono text-white">
                {display
                  ? `${display.wins} / ${display.ties} / ${display.losses}`
                  : "—"}
              </dd>
              <dt className="text-muted">Processed</dt>
              <dd className="text-right font-mono text-muted">
                {display
                  ? `${display.processed ?? display.iterations ?? iterations}`
                  : "—"}
              </dd>
              {finalResult ? (
                <>
                  <dt className="text-muted">Throughput</dt>
                  <dd className="text-right font-mono text-accent-blue">
                    {finalResult.iterationsPerSec?.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    iter/s
                  </dd>
                  <dt className="text-muted">Wall time</dt>
                  <dd className="text-right font-mono text-muted">
                    {finalResult.durationMs?.toFixed(1)} ms
                  </dd>
                </>
              ) : null}
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-muted">
              Simplified simulator for portfolio demos — skips burns and live
              betting edges. Compare with the tested C++ library for rigorous
              rules coverage and parallel simulation workers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
