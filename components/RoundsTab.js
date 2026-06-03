'use client';

import { useMemo } from 'react';
import { buildLeaderboard } from '@/lib/view.mjs';

const COLS = [
  ['GROUP', 'Group'],
  ['R32', 'R32'],
  ['R16', 'R16'],
  ['QF', 'QF'],
  ['SF', 'SF'],
  ['THIRD', '3rd'],
  ['FINAL', 'Final'],
];

export default function RoundsTab({ state }) {
  const { rows } = useMemo(() => buildLeaderboard(state), [state]);

  if (!rows.length) {
    return <div className="card center"><p className="hint" style={{ margin: 0 }}>No players yet.</p></div>;
  }

  return (
    <div className="card">
      <h3>Round-by-round breakdown</h3>
      <p className="hint">Points each player has banked in every stage.</p>
      <div style={{ overflowX: 'auto' }}>
        <table className="grid">
          <thead>
            <tr>
              <th className="name">Player</th>
              {COLS.map(([k, l]) => <th key={k}>{l}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.player.id}>
                <td className="name">
                  <span className="swatch" style={{ background: r.player.color, display: 'inline-block', marginRight: 6 }} />
                  {r.player.name}
                </td>
                {COLS.map(([k]) => {
                  const v = r.byRound[k] || 0;
                  return <td key={k} className={v > 0 ? 'pos' : 'muted'}>{v > 0 ? v : '–'}</td>;
                })}
                <td className="total">{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
