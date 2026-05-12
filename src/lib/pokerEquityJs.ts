import {
  type Card,
  cardKey,
  fullDeck,
  mulberry32,
  parseCard,
  shuffleInPlace,
} from "./pokerCards";

/** Best 5-card strength as lexicographically comparable tuple (higher wins). */
function evaluateFive(cards: Card[]): number[] {
  const ranks = cards.map((c) => c.rank).sort((a, b) => b - a);
  const suits = cards.map((c) => c.suit);
  const flush = new Set(suits).size === 1;
  const counts = new Map<number, number>();
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1);
  const byFreq = [...counts.entries()].sort((a, b) =>
    a[1] !== b[1] ? b[1] - a[1] : b[0] - a[0],
  );

  const uniqAsc = [...new Set(ranks)].sort((a, b) => a - b);
  let straightHigh = 0;
  if (uniqAsc.length >= 5) {
    for (let i = 0; i <= uniqAsc.length - 5; i++) {
      const slice = uniqAsc.slice(i, i + 5);
      if (slice[4]! - slice[0]! === 4) straightHigh = slice[4]!;
    }
  }
  if (
    uniqAsc.includes(14) &&
    uniqAsc.includes(5) &&
    uniqAsc.includes(4) &&
    uniqAsc.includes(3) &&
    uniqAsc.includes(2)
  ) {
    straightHigh = Math.max(straightHigh, 5);
  }

  if (flush && straightHigh > 0) {
    return [8, straightHigh];
  }

  if (byFreq[0]![1] === 4) {
    const quad = byFreq[0]![0];
    const kicker = byFreq[1]![0];
    return [7, quad, kicker];
  }
  if (byFreq[0]![1] === 3 && byFreq[1]![1] === 2) {
    return [6, byFreq[0]![0], byFreq[1]![0]];
  }
  if (flush) {
    return [5, ...ranks];
  }
  if (straightHigh > 0) {
    return [4, straightHigh];
  }
  if (byFreq[0]![1] === 3) {
    const t = byFreq[0]![0];
    const kickers = ranks.filter((r) => r !== t);
    return [3, t, ...kickers];
  }
  if (byFreq[0]![1] === 2 && byFreq[1]![1] === 2) {
    const hi = Math.max(byFreq[0]![0], byFreq[1]![0]);
    const lo = Math.min(byFreq[0]![0], byFreq[1]![0]);
    const kicker = ranks.find((r) => r !== hi && r !== lo)!;
    return [2, hi, lo, kicker];
  }
  if (byFreq[0]![1] === 2) {
    const p = byFreq[0]![0];
    const kickers = ranks.filter((r) => r !== p);
    return [1, p, ...kickers];
  }
  return [0, ...ranks];
}

function bestOfSeven(cards: Card[]): number[] {
  let best = evaluateFive(cards.slice(0, 5));
  const idx = [0, 0, 0, 0, 0];
  function dfs(start: number, depth: number) {
    if (depth === 5) {
      const five = idx.map((i) => cards[i]!);
      const v = evaluateFive(five);
      if (compareStrength(v, best) > 0) best = v;
      return;
    }
    for (let i = start; i < 7; i++) {
      idx[depth] = i;
      dfs(i + 1, depth + 1);
    }
  }
  dfs(0, 0);
  return best;
}

function compareStrength(a: number[], b: number[]): number {
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const da = a[i] ?? 0;
    const db = b[i] ?? 0;
    if (da !== db) return da - db;
  }
  return 0;
}

/**
 * Heads-up Monte Carlo equity (fraction in [0,1]) when the native addon
 * cannot load (e.g. older glibc on some hosts).
 */
export function simulateEquityMonteCarloJs(
  heroStr: string[],
  boardStr: string[],
  iterations: number,
  seed: number,
): number {
  const hero = heroStr.map((s) => parseCard(s)!);
  const board = boardStr.map((s) => parseCard(s)!);
  const known = [...hero, ...board];
  const used = new Set(known.map(cardKey));
  const needBoard = 5 - board.length;
  const rng = mulberry32(seed >>> 0);
  let wins = 0;
  let ties = 0;
  const baseDeck = fullDeck().filter((c) => !used.has(cardKey(c)));

  for (let it = 0; it < iterations; it++) {
    const deck = baseDeck.slice();
    shuffleInPlace(deck, rng);
    let p = 0;
    const runBoard: Card[] = [...board];
    for (let k = 0; k < needBoard; k++) {
      runBoard.push(deck[p++]!);
    }
    const villain: Card[] = [deck[p++]!, deck[p++]!];
    const hero7 = [...hero, ...runBoard];
    const vil7 = [...villain, ...runBoard];
    const cmp = compareStrength(bestOfSeven(hero7), bestOfSeven(vil7));
    if (cmp > 0) wins++;
    else if (cmp === 0) ties++;
  }

  return (wins + ties * 0.5) / iterations;
}
