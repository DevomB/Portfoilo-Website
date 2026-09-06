import { NextResponse } from "next/server";
import os from "node:os";
import type { PokerCalculationsNative } from "poker-calculations";
import { canonicalizeHand } from "@/app/(poker)/poker";
import { simulateEquityMonteCarloJs } from "@/app/(poker)/poker";
import { cellOf, liveCombos } from "@/app/(poker)/handMatrix";

/* The Landscape: equity for every one of the 169 starting-hand classes on a
   given board against N random opponents, computed by the real
   poker-calculations engine (C++ via N-API), threaded, deterministic per seed.

   POST { board: string[] (0, 3, 4 or 5 cards), villains: 1|2|3, iters?: number }
   ->   { equities: (number|null)[169], ... }   null = no live combo on this board

   Every class is represented by up to two concrete combos that do not collide
   with the board (spread across suit patterns), with the iteration budget split
   between them. Seeds are derived from (class, board, villains), so the same
   request always returns the same terrain — a deformation on screen is a real
   board change, never sampling noise. Responses are memoised in-process. */

export const runtime = "nodejs";

const THREADS = Math.min(16, Math.max(2, os.cpus().length));
const DEFAULT_ITERS = 400;
const MAX_ITERS = 2000;

let nativePoker: PokerCalculationsNative | "unavailable" | undefined;
async function loadNative(): Promise<PokerCalculationsNative | null> {
  if (nativePoker === "unavailable") return null;
  if (nativePoker !== undefined) return nativePoker;
  try {
    const mod = await import("poker-calculations");
    nativePoker = mod.default as PokerCalculationsNative;
    return nativePoker;
  } catch {
    nativePoker = "unavailable";
    return null;
  }
}

// FNV-1a — a stable 32-bit seed from the request shape
function seedFor(parts: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < parts.length; i++) {
    h ^= parts.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

type Result = {
  equities: (number | null)[];
  board: string[];
  villains: number;
  iters: number;
  engine: "native" | "js";
  threads: number;
  ms: number;
};

const cache = new Map<string, Result>();
const CACHE_MAX = 512;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { board: rawBoard, villains: rawVillains, iters: rawIters } = (body ?? {}) as Record<string, unknown>;

  if (!Array.isArray(rawBoard) || !rawBoard.every((c) => typeof c === "string")) {
    return NextResponse.json({ error: "board must be an array of card codes." }, { status: 400 });
  }
  if (![0, 3, 4, 5].includes(rawBoard.length)) {
    return NextResponse.json({ error: "board must have 0, 3, 4 or 5 cards." }, { status: 400 });
  }
  let board: string[];
  try {
    board = canonicalizeHand(rawBoard as string[]);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
  const villains = typeof rawVillains === "number" && [1, 2, 3].includes(rawVillains) ? rawVillains : 1;
  const iters =
    typeof rawIters === "number" && Number.isFinite(rawIters)
      ? Math.min(MAX_ITERS, Math.max(100, Math.floor(rawIters)))
      : DEFAULT_ITERS;

  const key = `${[...board].sort().join(",")}|${villains}|${iters}`;
  const hit = cache.get(key);
  if (hit) {
    // refresh LRU position
    cache.delete(key);
    cache.set(key, hit);
    return NextResponse.json({ ...hit, cached: true });
  }

  const native = await loadNative();
  const t0 = performance.now();
  const equities: (number | null)[] = new Array(169).fill(null);

  for (let k = 0; k < 169; k++) {
    const { i, j } = cellOf(k);
    const live = liveCombos(i, j, board);
    if (live.length === 0) continue;
    // two representatives spread across suit patterns, budget split between them
    const reps = live.length > 1 ? [live[0]!, live[Math.floor(live.length / 2)]!] : [live[0]!];
    const per = Math.ceil(iters / reps.length);
    let acc = 0;
    for (let r = 0; r < reps.length; r++) {
      const seed = seedFor(`${k}|${r}|${key}`);
      const hero = reps[r]!;
      acc += native
        ? native.parallelHandSimulation(hero, board, per, seed, villains, THREADS)
        : simulateEquityMonteCarloJs(hero, board, per, seed); // fallback is heads-up only
    }
    equities[k] = acc / reps.length;
  }

  const result: Result = {
    equities,
    board,
    villains: native ? villains : 1,
    iters,
    engine: native ? "native" : "js",
    threads: native ? THREADS : 1,
    ms: Math.round(performance.now() - t0),
  };
  cache.set(key, result);
  if (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value as string);
  return NextResponse.json({ ...result, cached: false });
}
