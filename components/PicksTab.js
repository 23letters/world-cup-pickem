'use client';

import { useMemo, useState } from 'react';
import { fmtDate, fmtTime, isLocked, scoringOpts } from '@/lib/view.mjs';
import { scorePick, resultOf, isPlayed, ROUND_LABEL } from '@/lib/scoring.mjs';
import { FLAG_BY_TEAM } from '@/lib/seedData.mjs';

const ROUND_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'GROUP', label: 'Groups' },
  { key: 'R32', label: 'R32' },
  { key: 'R16', label: 'R16' },
  { key: 'QF', label: 'QF' },
  { key: 'SF', label: 'SF' },
  { key: 'FINAL', label: 'Final' },
];

function teamLabel(name) {
  const flag = FLAG_BY_TEAM[name];
  return (
    <>
      {flag && <span className="flag">{flag}</span>}
      <span>{name}</span>
    </>
  );
}

export default function PicksTab({ state, auth, myPicks, wildcardsUsed, savePick, onNeedLogin }) {
  const { matches, settings } = state;
  const [filter, setFilter] = useState('all');
  const opts = scoringOpts(settings);
  const nowMs = Date.now();

  const filtered = useMemo(() => {
    let ms = matches;
    if (filter !== 'all') {
      if (filter === 'FINAL') ms = ms.filter((m) => m.round === 'FINAL' || m.round === 'THIRD');
      else ms = ms.filter((m) => m.round === filter);
    }
    return ms;
  }, [matches, filter]);

  // group by date
  const byDate = useMemo(() => {
    const map = new Map();
    for (const m of filtered) {
      const d = (m.kickoff || '').slice(0, 10);
      if (!map.has(d)) map.set(d, []);
      map.get(d).push(m);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const revealByMatch = useMemo(() => {
    const map = {};
    for (const p of state.picks) (map[p.match_id] = map[p.match_id] || []).push(p);
    return map;
  }, [state.picks]);

  const playersById = useMemo(
    () => Object.fromEntries(state.players.map((p) => [p.id, p])),
    [state.players]
  );

  return (
    <div>
      {!auth && (
        <div className="card center">
          <p className="hint" style={{ margin: 0 }}>
            <button className="btn primary" onClick={onNeedLogin}>Sign in</button>{' '}
            to make and edit your picks. You can browse below either way.
          </p>
        </div>
      )}

      <div className="tabs" style={{ marginBottom: 14 }}>
        {ROUND_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`tab ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {byDate.map(([date, ms]) => (
        <div className="daygroup" key={date}>
          <div className="dayhdr">{fmtDate(ms[0].kickoff)}</div>
          {ms.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              auth={auth}
              pick={myPicks[m.id]}
              opts={opts}
              nowMs={nowMs}
              wildcardsUsed={wildcardsUsed}
              wildcardMax={settings.wildcard_count}
              savePick={savePick}
              reveal={revealByMatch[m.id] || []}
              playersById={playersById}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function MatchCard({ match, auth, pick, opts, nowMs, wildcardsUsed, wildcardMax, savePick, reveal, playersById }) {
  const locked = isLocked(match, nowMs);
  const tbd = match.home === 'TBD' || match.away === 'TBD';
  const played = isPlayed(match);
  const actual = resultOf(match);
  const allowDraw = match.stage === 'group';
  const myScore = pick && played ? scorePick(pick, match, opts) : null;
  const canWildMore = wildcardsUsed < wildcardMax;

  function choose(sel) {
    if (locked || tbd || !auth) { return; }
    savePick(match.id, { pick: sel });
  }
  function setScore(side, val) {
    const v = val === '' ? null : Math.max(0, Math.min(20, Number(val)));
    savePick(match.id, side === 'home' ? { pred_home: v } : { pred_away: v });
  }
  function toggleWild() {
    if (locked || tbd || !auth) return;
    const next = !(pick && pick.wildcard);
    if (next && !canWildMore) return;
    savePick(match.id, { wildcard: next });
  }

  const meta = (
    <div className="match-meta">
      <span className="rnd">
        {match.stage === 'group' ? `Group ${match.grp}` : ROUND_LABEL[match.round]}
      </span>{' '}
      · {fmtTime(match.kickoff)}
    </div>
  );

  return (
    <div className={`match ${locked ? 'locked' : ''} ${pick && pick.wildcard ? 'wildcard' : ''}`}>
      <div className="match-top">
        {meta}
        {tbd ? (
          <span className="lockpill">Teams TBD</span>
        ) : played ? (
          <span className="result-final">
            FT {match.home_score}–{match.away_score}
            {myScore && (
              <span className={`pts ${myScore.points > 0 ? 'pos' : 'zero'}`}>
                {' '}· {myScore.points > 0 ? `+${myScore.points}` : pick ? '0' : '—'}
                {myScore.wildcardApplied ? ' (WC)' : ''}
              </span>
            )}
          </span>
        ) : (
          <span className={`lockpill ${locked ? '' : 'open'}`}>{locked ? '🔒 Locked' : '● Open'}</span>
        )}
      </div>

      {tbd ? (
        <p className="muted small" style={{ margin: '4px 2px' }}>
          {match.slot_home} vs {match.slot_away} — set once the previous round finishes.
        </p>
      ) : (
        <>
          <div className="teams">
            <button
              className={`team-btn ${pick?.pick === 'home' ? 'sel' : ''} ${played && actual === 'home' ? 'win' : ''}`}
              onClick={() => choose('home')}
              disabled={locked || !auth}
            >
              {teamLabel(match.home)}
            </button>
            {allowDraw ? (
              <button
                className={`draw-btn ${pick?.pick === 'draw' ? 'sel' : ''}`}
                onClick={() => choose('draw')}
                disabled={locked || !auth}
              >
                DRAW
              </button>
            ) : (
              <span style={{ display: 'grid', placeItems: 'center', color: 'var(--muted-2)', fontSize: 12 }}>vs</span>
            )}
            <button
              className={`team-btn ${pick?.pick === 'away' ? 'sel' : ''} ${played && actual === 'away' ? 'win' : ''}`}
              onClick={() => choose('away')}
              disabled={locked || !auth}
            >
              {teamLabel(match.away)}
            </button>
          </div>

          {!locked && auth && (
            <div className="match-extra">
              <span className="predscore">
                Predict score (optional):
                <input
                  className="score-input"
                  inputMode="numeric"
                  value={pick?.pred_home ?? ''}
                  onChange={(e) => setScore('home', e.target.value)}
                />
                <span>–</span>
                <input
                  className="score-input"
                  inputMode="numeric"
                  value={pick?.pred_away ?? ''}
                  onChange={(e) => setScore('away', e.target.value)}
                />
              </span>
              <label
                className="wc-toggle"
                title={!canWildMore && !(pick && pick.wildcard) ? 'No wild cards left' : 'Multiply this match'}
              >
                <input
                  type="checkbox"
                  checked={!!(pick && pick.wildcard)}
                  onChange={toggleWild}
                  disabled={!canWildMore && !(pick && pick.wildcard)}
                />
                ⭐ Wild card ×{opts.wildcardMultiplier}
              </label>
            </div>
          )}

          {locked && pick && (
            <div className="small muted" style={{ marginTop: 8 }}>
              Your pick: <b>{pick.pick === 'home' ? match.home : pick.pick === 'away' ? match.away : 'Draw'}</b>
              {pick.pred_home != null && pick.pred_away != null && ` (${pick.pred_home}–${pick.pred_away})`}
              {pick.wildcard && <span className="tag wc" style={{ marginLeft: 6 }}>Wild card</span>}
            </div>
          )}

          {locked && reveal.length > 0 && (
            <div className="others">
              <span className="muted small">Picks:</span>
              {reveal.map((r) => {
                const pl = playersById[r.player_id];
                const lbl = r.pick === 'home' ? match.home : r.pick === 'away' ? match.away : 'Draw';
                return (
                  <span className="chip" key={r.player_id}>
                    <span className="swatch" style={{ background: pl?.color }} />
                    {pl?.name}: {lbl}{r.wildcard ? ' ⭐' : ''}
                  </span>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
