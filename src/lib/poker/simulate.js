import { mulberry32 } from "./rng.js";
import {
  cardKey,
  formatCard,
  fullDeck,
  parseCard,
  shuffleInPlace,
} from "./cards.js";
import { compareSeven } from "./evaluate.js";

function deckMinusUsed(usedKeys) {
  return fullDeck().filter((c) => !usedKeys.has(cardKey(c)));
}

function parseScenario(opts) {
  const hero = [];
  const board = [];
  const used = new Set();

  for (const code of opts.heroCodes) {
    const c = parseCard(code);
    if (!c) throw new Error(`Bad hero card: ${code}`);
    const k = cardKey(c);
    if (used.has(k)) throw new Error(`Duplicate card: ${code}`);
    used.add(k);
    hero.push(c);
  }
  if (hero.length !== 2) throw new Error("Hero needs exactly two hole cards.");

  for (const code of opts.boardCodes) {
    const c = parseCard(code);
    if (!c) throw new Error(`Bad board card: ${code}`);
    const k = cardKey(c);
    if (used.has(k)) throw new Error(`Duplicate card: ${code}`);
    used.add(k);
    board.push(c);
  }

  const boardLen = board.length;
  if (![0, 3, 4, 5].includes(boardLen)) {
    throw new Error("Board must have 0, 3, 4, or 5 cards.");
  }

  return { hero, board, boardLen, used };
}

function runOneIteration(rng, scenario) {
  const { hero, board, boardLen, used } = scenario;
  const deck = deckMinusUsed(used);
  shuffleInPlace(deck, rng);
  const villain = [deck.pop(), deck.pop()];
  const runoutCount = 5 - boardLen;
  const runout = [];
  for (let r = 0; r < runoutCount; r++) {
    runout.push(deck.pop());
  }
  const fullBoard = [...board, ...runout];
  const hero7 = [...hero, ...fullBoard];
  const villain7 = [...villain, ...fullBoard];
  return compareSeven(hero7, villain7);
}

/**
 * @param {{
 *   heroCodes: string[],
 *   boardCodes: string[],
 *   iterations: number,
 *   seed: number,
 * }} opts
 */
export function simulateEquity(opts) {
  const rng = mulberry32(opts.seed >>> 0);
  const scenario = parseScenario(opts);
  let wins = 0;
  let ties = 0;
  let losses = 0;

  for (let i = 0; i < opts.iterations; i++) {
    const cmp = runOneIteration(rng, scenario);
    if (cmp > 0) wins++;
    else if (cmp < 0) losses++;
    else ties++;
  }

  const chopEquity = ties / 2;
  const equity = ((wins + chopEquity) / opts.iterations) * 100;

  return {
    wins,
    ties,
    losses,
    equity,
    iterations: opts.iterations,
    processed: opts.iterations,
    seed: opts.seed >>> 0,
    heroDisplay: scenario.hero.map(formatCard),
    boardDisplay: scenario.board.map(formatCard),
  };
}

/**
 * Chunked simulation — yields to the browser between batches for UI updates.
 * @param {{
 *   heroCodes: string[],
 *   boardCodes: string[],
 *   iterations: number,
 *   seed: number,
 *   chunkSize?: number,
 *   onChunk?: (s: {
 *     wins: number,
 *     ties: number,
 *     losses: number,
 *     processed: number,
 *     total: number,
 *     equity: number
 *   }) => void
 * }} opts
 */
export async function simulateEquityAsync(opts) {
  const rng = mulberry32(opts.seed >>> 0);
  const scenario = parseScenario(opts);
  const total = opts.iterations;
  const chunkSize = opts.chunkSize ?? Math.min(600, Math.max(1, total));
  let wins = 0;
  let ties = 0;
  let losses = 0;

  const emit = (processed) => {
    const chopEquity = ties / 2;
    const equity = ((wins + chopEquity) / processed) * 100;
    opts.onChunk?.({
      wins,
      ties,
      losses,
      processed,
      total,
      equity,
    });
  };

  let processed = 0;
  while (processed < total) {
    const n = Math.min(chunkSize, total - processed);
    for (let i = 0; i < n; i++) {
      const cmp = runOneIteration(rng, scenario);
      if (cmp > 0) wins++;
      else if (cmp < 0) losses++;
      else ties++;
    }
    processed += n;
    emit(processed);
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  const chopEquity = ties / 2;
  const equity = ((wins + chopEquity) / total) * 100;

  return {
    wins,
    ties,
    losses,
    equity,
    iterations: total,
    processed: total,
    seed: opts.seed >>> 0,
    heroDisplay: scenario.hero.map(formatCard),
    boardDisplay: scenario.board.map(formatCard),
  };
}
