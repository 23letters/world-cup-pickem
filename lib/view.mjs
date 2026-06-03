// Pure view helpers shared by client components.
import { scorePlayer, scorePick, resultOf, isPlayed, ROUND_POINTS } from './scoring.mjs';

export const ROUND_ORDER = ['GROUP', 'R32', 'R16', 'QF', 'SF', 'THIRD', 'FINAL'];

export function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
    });
  } catch { return ''; }
}

export function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch { return ''; }
}

export function isLocked(match, nowMs = Date.now()) {
  return new Date(match.kickoff).getTime() <= nowMs;
}

export function scoringOpts(settings) {
  return {
    exactBonus: settings?.exact_bonus ?? 5,
    cleanSheetBonus: settings?.clean_sheet_bonus ?? 3,
    wildcardMultiplier: settings?.wildcard_multiplier ?? 3,
    wildcardCount: settings?.wildcard_count ?? 3,
  };
}

// Determine the latest round that has at least one played match.
export function currentRound(matches) {
  let best = null;
  for (const m of matches) {
    if (isPlayed(m)) {
      const idx = ROUND_ORDER.indexOf(m.round);
      if (best == null || idx > ROUND_ORDER.indexOf(best)) best = m.round;
    }
  }
  return best;
}

// Build sorted leaderboard.
export function buildLeaderboard(state) {
  const { players = [], matches = [], picks = [], settings = {} } = state;
  const opts = scoringOpts(settings);
  const matchesById = Object.fromEntries(matches.map((m) => [m.id, m]));
  const picksByPlayer = {};
  for (const p of picks) {
    (picksByPlayer[p.player_id] = picksByPlayer[p.player_id] || []).push(p);
  }
  const curRound = currentRound(matches);
  const rows = players.map((pl) => {
    const ps = picksByPlayer[pl.id] || [];
    const agg = scorePlayer(ps, matchesById, opts);
    let thisRound = 0;
    if (curRound) thisRound = agg.byRound[curRound] || 0;
    return {
      player: pl,
      total: agg.total,
      byRound: agg.byRound,
      thisRound,
      correctCount: agg.correctCount,
      wildcardsUsed: (state.wildcardUsed && state.wildcardUsed[pl.id]) || agg.wildcardsUsed,
    };
  });
  rows.sort((a, b) => b.total - a.total || a.player.name.localeCompare(b.player.name));
  return { rows, curRound };
}

// Monte Carlo: simulate remaining (unplayed, teams-known) matches to estimate finish positions.
export function simulateFinish(state, iterations = 2000) {
  const { players = [], matches = [], picks = [], settings = {} } = state;
  const opts = scoringOpts(settings);
  const matchesById = Object.fromEntries(matches.map((m) => [m.id, m]));
  const picksByPlayer = {};
  for (const p of picks) (picksByPlayer[p.player_id] = picksByPlayer[p.player_id] || []).push(p);

  // Base (locked) scores already determined
  const base = {};
  for (const pl of players) {
    base[pl.id] = scorePlayer(picksByPlayer[pl.id] || [], matchesById, opts).total;
  }

  // Remaining matches with known teams but no result.
  const remaining = matches.filter(
    (m) => !isPlayed(m) && m.home && m.away && m.home !== 'TBD' && m.away !== 'TBD'
  );

  if (remaining.length === 0) {
    // Deterministic: rank by base.
    const ranked = [...players].sort((a, b) => base[b.id] - base[a.id]);
    const out = {};
    players.forEach((pl) => { out[pl.id] = { win: 0, top3: 0 }; });
    ranked.forEach((pl, i) => {
      out[pl.id] = { win: i === 0 ? 100 : 0, top3: i < 3 ? 100 : 0 };
    });
    return out;
  }

  const winCount = {}; const top3Count = {};
  players.forEach((pl) => { winCount[pl.id] = 0; top3Count[pl.id] = 0; });

  for (let it = 0; it < iterations; it++) {
    const sim = { ...base };
    for (const m of remaining) {
      // random plausible scoreline 0-3
      const hs = Math.floor(Math.random() * 4);
      const as = Math.floor(Math.random() * 4);
      const simMatch = { round: m.round, home_score: hs, away_score: as };
      for (const pl of players) {
        const pk = (picksByPlayer[pl.id] || []).find((x) => x.match_id === m.id);
        if (pk) sim[pl.id] += scorePick(pk, simMatch, opts).points;
      }
    }
    const ranked = players
      .map((pl) => ({ id: pl.id, s: sim[pl.id] }))
      .sort((a, b) => b.s - a.s);
    if (ranked.length) winCount[ranked[0].id]++;
    ranked.slice(0, 3).forEach((r) => top3Count[r.id]++);
  }
  const out = {};
  players.forEach((pl) => {
    out[pl.id] = {
      win: (100 * winCount[pl.id]) / iterations,
      top3: (100 * top3Count[pl.id]) / iterations,
    };
  });
  return out;
}

export { resultOf, isPlayed, scorePick, ROUND_POINTS };
