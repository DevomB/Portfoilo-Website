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
