import { NextResponse } from "next/server";
import poker from "poker-calculations";
import { canonicalizeHand } from "@/lib/pokerCards";

export const runtime = "nodejs";

function parseCodes(line: string): string[] {
  return line
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Expected JSON object." }, { status: 400 });
  }

  const { heroLine, boardLine, iterations, seed } = body as Record<
    string,
    unknown
  >;

  if (typeof heroLine !== "string" || typeof boardLine !== "string") {
    return NextResponse.json(
      { error: "heroLine and boardLine must be strings." },
      { status: 400 },
    );
  }

  const heroCodes = parseCodes(heroLine);
  const boardCodes = parseCodes(boardLine);

  const it =
    typeof iterations === "number" && Number.isFinite(iterations)
      ? Math.min(250_000, Math.max(500, Math.floor(iterations)))
      : 6000;

  const sd =
    typeof seed === "number" && Number.isFinite(seed)
      ? seed >>> 0
      : 2_463_534_242;

  if (heroCodes.length !== 2) {
    return NextResponse.json(
      { error: "Hero needs exactly two hole cards." },
      { status: 400 },
    );
  }

  const boardLen = boardCodes.length;
  if (![0, 3, 4, 5].includes(boardLen)) {
    return NextResponse.json(
      { error: "Board must have 0, 3, 4, or 5 cards." },
      { status: 400 },
    );
  }

  let hero: string[];
  let board: string[];
  try {
    hero = canonicalizeHand(heroCodes);
    board = canonicalizeHand(boardCodes);
    const used = new Set([...hero, ...board]);
    if (used.size !== hero.length + board.length) {
      return NextResponse.json(
        { error: "Duplicate cards between hero and board." },
        { status: 400 },
      );
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid cards.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const t0 = performance.now();
  let equityFraction: number;
  try {
    equityFraction = poker.simulateHandOutcome(hero, board, it, sd, 1);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Simulation failed.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  const t1 = performance.now();
  const durationMs = t1 - t0;
  const sec = Math.max(durationMs / 1000, 1e-6);

  return NextResponse.json({
    equity: equityFraction * 100,
    iterations: it,
    seed: sd,
    durationMs,
    iterationsPerSec: it / sec,
    heroDisplay: hero,
    boardDisplay: board,
  });
}
