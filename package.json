'use client';

import { useEffect, useMemo, useState } from 'react';
import { simulateFinish, buildLeaderboard } from '@/lib/view.mjs';

export default function ForecastTab({ state }) {
  const [sim, setSim] = useState(null);
  const [running, setRunning] = useState(false);
  const ITER = 3000;

  const playersById = useMemo(
    () => Object.fromEntries(state.players.map((p) => [p.id, p])),
    [state.players]
  );

  function run() {
    setRunning(true);
    // defer to let the spinner paint
    setTimeout(() => {
      setSim(simulateFinish(state, ITER));
      setRunning(false);
    }, 20);
  }

  useEffect(() => { run(); /* eslint-disable-next-line */ }, [state]);

  const { rows } = useMemo(() => buildLeaderboard(state), [state]);

  if (!state.players.length) {
    return <div className="card center"><p className="hint" style={{ margin: 0 }}>No players yet.</p></div>;
  }

  const ordered = sim
    ? [...state.players].sort((a, b) => (sim[b.id]?.top3 || 0) - (sim[a.id]?.top3 || 0) || (sim[b.id]?.win || 0) - (sim[a.id]?.win || 0))
    : rows.map((r) => r.player);

  return (
    <div className="card">
      <h3>Win probability forecast</h3>
      <p className="hint">
        Based on current locked picks · {ITER.toLocaleString()} simulations of remaining matches.{' '}
        <button className="btn ghost sm" onClick={run} disabled={running}>{running ? 'Simulating…' : 'Refresh'}</button>
      </p>
      {ordered.map((pl) => {
        const s = sim?.[pl.id] || { win: 0, top3: 0 };
        return (
          <div className="fc-row" key={pl.id}>
            <span className="fc-name">
              <span className="swatch" style={{ background: pl.color }} />
              {pl.name}
            </span>
            <span className="fc-track">
              <span
                className="fc-fill"
                style={{ width: `${Math.max(2, s.top3)}%`, background: pl.color, opacity: 0.85 }}
              />
              <span style={{ position: 'absolute', right: 8, top: 3, fontSize: 11, color: 'var(--muted)' }}>
                win {s.win.toFixed(0)}%
              </span>
            </span>
            <span className="fc-val">{s.top3.toFixed(0)}%</span>
          </div>
        );
      })}
      <p className="center small muted" style={{ marginTop: 10 }}>
        Bar = chance of finishing top 3 (in the money). Early on, this mostly reflects the current standings.
      </p>
    </div>
  );
}
