import { mulberry32 } from "./rng.js";

const RANK_CHARS = "23456789TJQKA";

/** @typedef {{ rank: number; suit: number }} Card rank 2..14, suit 0..3 */

export function parseCard(code) {
  if (!code || code.length < 2) return null;
  const upper = code.trim().toUpperCase();
  const rch = upper[0];
  const sch = upper[upper.length - 1].toLowerCase();
  const rank = RANK_CHARS.indexOf(rch) + 2;
  const suitMap = { c: 0, d: 1, h: 2, s: 3 };
  const suit = suitMap[sch];
  if (rank < 2 || rank > 14 || suit === undefined) return null;
  return { rank, suit };
}

export function formatCard(card) {
  const r = RANK_CHARS[card.rank - 2];
  const s = ["c", "d", "h", "s"][card.suit];
  return `${r}${s}`;
}

export function fullDeck() {
  /** @type {{ rank: number; suit: number }[]} */
  const deck = [];
  for (let suit = 0; suit < 4; suit++) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

export function cardKey(card) {
  return card.rank * 4 + card.suit;
}

export function shuffleInPlace(deck, rng) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = deck[i];
    deck[i] = deck[j];
    deck[j] = tmp;
  }
}

/** Deterministic random hero hole cards for UI presets */
export function dealRandomHoleCards(seed) {
  const rng = mulberry32(seed >>> 0);
  const deck = fullDeck();
  shuffleInPlace(deck, rng);
  return [formatCard(deck[0]), formatCard(deck[1])];
}
