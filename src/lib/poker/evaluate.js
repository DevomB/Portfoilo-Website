/** @typedef {{ rank: number; suit: number }} Card */

function combinations(arr, k) {
  const result = [];
  function backtrack(start, path) {
    if (path.length === k) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]);
      backtrack(i + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return result;
}

/** Unique ranks from cards */
function rankSet(cards) {
  return new Set(cards.map((c) => c.rank));
}

/**
 * Highest straight high card among these ranks (Ace plays high or wheel low).
 * Returns 0 if no straight.
 */
function straightHighFromRankSet(rankSet_) {
  const expanded = new Set(rankSet_);
  if (expanded.has(14)) expanded.add(1);
  const sorted = [...expanded].sort((a, b) => a - b);
  let run = 1;
  let maxHigh = 0;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      run++;
      if (run >= 5) maxHigh = sorted[i];
    } else if (sorted[i] !== sorted[i - 1]) {
      run = 1;
    }
  }
  return maxHigh;
}

function freqCounts(ranks) {
  const m = new Map();
  for (const r of ranks) m.set(r, (m.get(r) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return b[0] - a[0];
  });
}

/**
 * Score vector for exactly 5 cards; lexicographically comparable (higher wins).
 * Categories: 8 SF .. 0 HC
 */
function scoreFive(cards) {
  const ranks = cards.map((c) => c.rank).sort((a, b) => b - a);
  const suits = cards.map((c) => c.suit);
  const flush = suits.every((s) => s === suits[0]);
  const straightHigh = straightHighFromRankSet(rankSet(cards));
  const counts = freqCounts(ranks);

  if (flush && straightHigh > 0) {
    return [8, straightHigh];
  }

  if (counts[0][1] === 4) {
    const quad = counts[0][0];
    const kicker = counts.find((c) => c[1] === 1)?.[0] ?? 0;
    return [7, quad, kicker];
  }

  if (counts[0][1] === 3 && counts[1][1] === 2) {
    return [6, counts[0][0], counts[1][0]];
  }

  if (flush) {
    return [5, ...ranks];
  }

  if (straightHigh > 0) {
    return [4, straightHigh];
  }

  if (counts[0][1] === 3) {
    const trip = counts[0][0];
    const kickers = counts
      .filter((c) => c[1] === 1)
      .map((c) => c[0])
      .sort((a, b) => b - a);
    return [3, trip, ...kickers];
  }

  if (counts[0][1] === 2 && counts[1][1] === 2) {
    const pairs = counts.filter((c) => c[1] === 2).map((c) => c[0]);
    pairs.sort((a, b) => b - a);
    const kicker = counts.find((c) => c[1] === 1)?.[0] ?? 0;
    return [2, pairs[0], pairs[1], kicker];
  }

  if (counts[0][1] === 2) {
    const pair = counts[0][0];
    const kickers = counts
      .filter((c) => c[1] === 1)
      .map((c) => c[0])
      .sort((a, b) => b - a);
    return [1, pair, ...kickers];
  }

  return [0, ...ranks];
}

function lexCompare(a, b) {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    if (ai !== bi) return ai > bi ? 1 : -1;
  }
  return 0;
}

/** Best score among all C(7,5) five-card subsets */
export function bestScoreSeven(cards) {
  let best = null;
  for (const combo of combinations(cards, 5)) {
    const s = scoreFive(combo);
    if (!best || lexCompare(s, best) > 0) best = s;
  }
  return best;
}

/** +1 hero wins, -1 loses, 0 chop */
export function compareSeven(hero7, villain7) {
  const a = bestScoreSeven(hero7);
  const b = bestScoreSeven(villain7);
  return lexCompare(a, b);
}
