'use client';

import { useMemo } from 'react';
import { buildLeaderboard, ROUND_ORDER } from '@/lib/view.mjs';
import { ROUND_LABEL } from '@/lib/scoring.mjs';

export default function StandingsTab({ state, auth }) {
  const { rows, curRound } = useMemo(() => buildLeaderboard(state), [state]);

  if (!rows.length) {
    return (
      <div className="card center">
        <p className="hint" style={{ margin: 0 }}>No players yet. Sign in and make the first picks!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h3>Leaderboard</h3>
        <p className="hint">
          {curRound ? `Current round: ${ROUND_LABEL[curRound]}` : 'Tournament hasn\'t started — points appear as results come in.'}
        </p>
        {rows.map((r, i) => {
          const isMe = auth && auth.player.id === r.player.id;
          return (
            <div className={`lb-row ${isMe ? 'me' : ''}`} key={r.player.id}>
              <span className={`lb-rank ${i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : ''}`}>{i + 1}</span>
              <span className="lb-name">
                <span className="swatch" style={{ background: r.player.color }} />
                {r.player.name}
                {i === 0 && r.total > 0 && ' 👑'}
                {r.wildcardsUsed > 0 && <span className="tag wc">{r.wildcardsUsed}⭐</span>}
              </span>
              <span className="lb-stats">
                <span className="lb-stat">
                  <span className="k">This round</span>
                  <span className={`v ${r.thisRound > 0 ? 'pos' : ''}`}>{r.thisRound > 0 ? `+${r.thisRound}` : '0'}</span>
                </span>
                <span className="lb-stat">
                  <span className="k">Correct</span>
                  <span className="v">{r.correctCount}</span>
                </span>
                <span className="lb-stat">
                  <span className="k">Total</span>
                  <span className="v">{r.total}</span>
                </span>
              </span>
            </div>
          );
        })}
      </div>
      <p className="center small muted">
        Ranked by total points. Wild-carded matches count ×{state.settings.wildcard_multiplier}.
      </p>
    </div>
  );
}
