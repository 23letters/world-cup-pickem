// Pure scoring engine — no DB, no React. Safe to import on client and server.

export const ROUND_POINTS = {
  GROUP: 10,
  R32: 10,
  R16: 20,
  QF: 40,
  SF: 80,
  THIRD: 40,
  FINAL: 160,
};

export const ROUND_LABEL = {
  GROUP: 'Group stage',
  R32: 'Round of 32',
  R16: 'Round of 16',
  QF: 'Quarterfinals',
  SF: 'Semifinals',
  THIRD: 'Third place',
  FINAL: 'Final',
};

export const DEFAULTS = {
  exactBonus: 5,
  cleanSheetBonus: 3,
  wildcardMultiplier: 3,
  wildcardCount: 3,
};

// Returns 'home' | 'draw' | 'away' | null (null if not yet played)
export function resultOf(match) {
  if (match == null) return null;
  const h = match.home_score;
  const a = match.away_score;
  if (h == null || a == null) return null;
  if (h > a) return 'home';
  if (a > h) return 'away';
  return 'draw';
}

export function isPlayed(match) {
  return match != null && match.home_score != null && match.away_score != null;
}

/**
 * Score a single pick against a match result.
 * pick: { pick: 'home'|'draw'|'away', pred_home, pred_away, wildcard }
 * match: { round, home_score, away_score }
 * opts: { exactBonus, cleanSheetBonus, wildcardMultiplier }
 * Returns { points, base, exact, cleanSheet, wildcardApplied }
 */
export function scorePick(pick, match, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const empty = { points: 0, base: 0, exact: 0, cleanSheet: 0, wildcardApplied: false };
  if (!pick || !pick.pick) return empty;
  const actual = resultOf(match);
  if (actual == null) return empty; // not played yet

  const roundPts = ROUND_POINTS[match.round] ?? ROUND_POINTS.GROUP;
  const correct = pick.pick === actual;
  if (!correct) {
    // wrong result scores nothing (wildcard on a wrong pick = 0)
    return empty;
  }

  let base = roundPts;
  let exact = 0;
  let cleanSheet = 0;

  const ph = pick.pred_home;
  const pa = pick.pred_away;
  const hasScore = ph != null && pa != null;

  if (hasScore && ph === match.home_score && pa === match.away_score) {
    exact = o.exactBonus;
  }

  // Clean sheet: you correctly called the winning side to concede zero.
  if (hasScore) {
    if (pick.pick === 'home' && pa === 0 && match.away_score === 0) cleanSheet = o.cleanSheetBonus;
    if (pick.pick === 'away' && ph === 0 && match.home_score === 0) cleanSheet = o.cleanSheetBonus;
  }

  let points = base + exact + cleanSheet;
  let wildcardApplied = false;
  if (pick.wildcard) {
    points *= o.wildcardMultiplier;
    wildcardApplied = true;
  }
  return { points, base, exact, cleanSheet, wildcardApplied };
}

/**
 * Aggregate a player's picks.
 * picks: array of pick rows (with match_id)
 * matchesById: { [id]: match }
 * Returns { total, byRound: {ROUND: pts}, correctCount, exactCount, wildcardsUsed }
 */
export function scorePlayer(picks, matchesById, opts = {}) {
  const byRound = {};
  let total = 0;
  let correctCount = 0;
  let exactCount = 0;
  let wildcardsUsed = 0;
  for (const p of picks) {
    if (p.wildcard) wildcardsUsed += 1;
    const m = matchesById[p.match_id];
    if (!m) continue;
    const s = scorePick(p, m, opts);
    total += s.points;
    if (s.points > 0 || s.base > 0) correctCount += 1;
    if (s.exact > 0) exactCount += 1;
    const r = m.round || 'GROUP';
    byRound[r] = (byRound[r] || 0) + s.points;
  }
  return { total, byRound, correctCount, exactCount, wildcardsUsed };
}
