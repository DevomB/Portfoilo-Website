// The poker engine: cards, decks, and hand evaluation in one module.
// (Was lib/pokerCards.ts + lib/pokerEquityJs.ts; merged so the splash's
// dependency chain is one hop shorter and the engine is one unit.)

// ── cards and decks ───────────────────────────────────────────────────────

const RANK_CHARS = "23456789TJQKA";

export type Card = { rank: number; suit: number };

/** Mulberry32 — deterministic PRNG for reproducible UI random hero */
export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function parseCard(code: string): Card | null {
  if (!code || code.length < 2) return null;
  const upper = code.trim().toUpperCase();
  const rch = upper[0];
  const sch = upper[upper.length - 1].toLowerCase();
  const rank = RANK_CHARS.indexOf(rch) + 2;
  const suitMap: Record<string, number> = { c: 0, d: 1, h: 2, s: 3 };
  const suit = suitMap[sch];
  if (rank < 2 || rank > 14 || suit === undefined) return null;
  return { rank, suit };
}

export function formatCard(card: Card): string {
  const r = RANK_CHARS[card.rank - 2];
  const s = ["c", "d", "h", "s"][card.suit];
  return `${r}${s}`;
}

export function fullDeck(): Card[] {
  const deck: Card[] = [];
  for (let suit = 0; suit < 4; suit++) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

export function cardKey(card: Card): number {
  return card.rank * 4 + card.suit;
}

export function shuffleInPlace(deck: Card[], rng: () => number): void {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = deck[i];
    deck[i] = deck[j]!;
    deck[j] = tmp!;
  }
}

/** Deterministic random hero hole cards for UI */
export function dealRandomHoleCards(seed: number): [string, string] {
  const rng = mulberry32(seed >>> 0);
  const deck = fullDeck();
  shuffleInPlace(deck, rng);
  return [formatCard(deck[0]!), formatCard(deck[1]!)];
}

/** Parse and format codes for the native engine; throws on bad or duplicate cards. */
export function canonicalizeHand(codes: string[]): string[] {
  const used = new Set<number>();
  const out: string[] = [];
  for (const code of codes) {
    const c = parseCard(code);
    if (!c) throw new Error(`Bad card: ${code}`);
    const k = cardKey(c);
    if (used.has(k)) throw new Error(`Duplicate card: ${code}`);
    used.add(k);
    out.push(formatCard(c));
  }
  return out;
}

/** Split a line of card codes on whitespace or commas, dropping blanks. */
export function parseCodes(line: string): string[] {
  return line.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);
}

// ── hand evaluation and equity ────────────────────────────────────────────


/** Highest card of any 5-long run among the distinct ranks, the wheel counting as 5; 0 if none. */
function straightHigh(uniqAsc: number[]): number {
  let high = 0;
  for (let i = 0; i + 4 < uniqAsc.length; i++) {
    if (uniqAsc[i + 4]! - uniqAsc[i]! === 4) high = uniqAsc[i + 4]!;
  }
  const wheel = [14, 5, 4, 3, 2].every((r) => uniqAsc.includes(r));
  return wheel ? Math.max(high, 5) : high;
}

/** Ranks grouped by multiplicity, most frequent first, ties broken by higher rank. */
function rankGroups(ranks: number[]): [rank: number, count: number][] {
  const counts = new Map<number, number>();
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => (a[1] !== b[1] ? b[1] - a[1] : b[0] - a[0]));
}

/** Best 5-card strength as lexicographically comparable tuple (higher wins). */
export function evaluateFive(cards: Card[]): number[] {
  const ranks = cards.map((c) => c.rank).sort((a, b) => b - a);
  const flush = new Set(cards.map((c) => c.suit)).size === 1;
  const straight = straightHigh([...new Set(ranks)].sort((a, b) => a - b));
  const [top, second] = rankGroups(ranks);
  const [topRank, topCount] = top!;
  const secondCount = second?.[1] ?? 0;
  const others = (...keep: number[]) => ranks.filter((r) => !keep.includes(r));

  if (flush && straight > 0) return [8, straight];
  if (topCount === 4) return [7, topRank, second![0]];
  if (topCount === 3 && secondCount === 2) return [6, topRank, second![0]];
  if (flush) return [5, ...ranks];
  if (straight > 0) return [4, straight];
  if (topCount === 3) return [3, topRank, ...others(topRank)];
  if (topCount === 2 && secondCount === 2) {
    const hi = Math.max(topRank, second![0]), lo = Math.min(topRank, second![0]);
    return [2, hi, lo, ...others(hi, lo)];
  }
  if (topCount === 2) return [1, topRank, ...others(topRank)];
  return [0, ...ranks];
}

// Category names for the evaluateFive tuple's leading value, matching the
// vocabulary of the poker-calculations native addon's HandEvalResult.rank.
// Tier 9 (royal flush) is a display-level distinction of the [8, 14] tuple.
const HAND_NAMES = [
  "High Card",
  "One Pair",
  "Two Pair",
  "Three of a Kind",
  "Straight",
  "Flush",
  "Full House",
  "Four of a Kind",
  "Straight Flush",
  "Royal Flush",
] as const;

export type HandClass = { tier: number; name: (typeof HAND_NAMES)[number] };

/**
 * Classify exactly five cards for display. The native addon exposes the same
 * information via evaluateBestHand(), but it cannot load in the browser — this
 * is the client-side mirror used by the splash screen.
 */
export function classifyFive(cards: Card[]): HandClass {
  const v = evaluateFive(cards);
  const tier = v[0] === 8 && v[1] === 14 ? 9 : v[0]!;
  return { tier, name: HAND_NAMES[tier]! };
}

/** Every 5-subset of indices 0..n-1, in lexicographic order. */
function* fiveSubsets(n: number): Generator<number[]> {
  const idx = [0, 1, 2, 3, 4];
  if (n < 5) return;
  while (true) {
    yield [...idx];
    // advance the rightmost index that can still move
    let i = 4;
    while (i >= 0 && idx[i] === n - 5 + i) i--;
    if (i < 0) return;
    idx[i]!++;
    for (let j = i + 1; j < 5; j++) idx[j] = idx[j - 1]! + 1;
  }
}

function bestFiveIndices(cards: Card[]): number[] {
  let bestVal: number[] = [];
  let bestIdx: number[] = [0, 1, 2, 3, 4];
  for (const idx of fiveSubsets(cards.length)) {
    const v = evaluateFive(idx.map((i) => cards[i]!));
    if (bestVal.length === 0 || compareStrength(v, bestVal) > 0) {
      bestVal = v;
      bestIdx = idx;
    }
  }
  return bestIdx;
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

export type SampleWin = {
  board5: string[];   // 5 community card codes from the winning run
  villain: string[];  // villain's 2 hole card codes
  heroInBest: [boolean, boolean]; // which of hero's 2 cards appear in the best 5-card hand
};

/** Find one Monte Carlo run where the hero wins and return the card layout. */
export function findSampleWin(
  heroStr: string[],
  boardStr: string[],
  seed: number,
  maxTries = 800,
): SampleWin | null {
  const hero = heroStr.map((s) => parseCard(s)!);
  const board = boardStr.map((s) => parseCard(s)!);
  const used = new Set([...hero, ...board].map(cardKey));
  const needBoard = 5 - board.length;
  const rng = mulberry32(seed >>> 0);
  const baseDeck = fullDeck().filter((c) => !used.has(cardKey(c)));

  for (let it = 0; it < maxTries; it++) {
    const deck = baseDeck.slice();
    shuffleInPlace(deck, rng);
    let p = 0;
    const runBoard: Card[] = [...board];
    for (let k = 0; k < needBoard; k++) runBoard.push(deck[p++]!);
    const villain: Card[] = [deck[p++]!, deck[p++]!];
    const hero7 = [...hero, ...runBoard];
    const vil7 = [...villain, ...runBoard];
    const cmp = compareStrength(bestOfSeven(hero7), bestOfSeven(vil7));
    if (cmp > 0) {
      const bestIdx = bestFiveIndices(hero7);
      return {
        board5: runBoard.map((c) => formatCard(c)),
        villain: villain.map((c) => formatCard(c)),
        heroInBest: [bestIdx.includes(0), bestIdx.includes(1)],
      };
    }
  }
  return null;
}
