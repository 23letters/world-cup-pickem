'use client';

import { useMemo } from 'react';
import { resultOf } from '@/lib/scoring.mjs';
import { FLAG_BY_TEAM } from '@/lib/seedData.mjs';

const COLS = [
  ['R32', 'Round of 32'],
  ['R16', 'Round of 16'],
  ['QF', 'Quarterfinals'],
  ['SF', 'Semifinals'],
  ['FINAL', 'Final'],
];

function Team({ name, score, win }) {
  const tbd = !name || name === 'TBD';
  return (
    <div className={`bteam ${win ? 'win' : ''} ${tbd ? 'tbd' : ''}`}>
      <span>{!tbd && FLAG_BY_TEAM[name] ? `${FLAG_BY_TEAM[name]} ` : ''}{tbd ? 'TBD' : name}</span>
      {score != null && <span>{score}</span>}
    </div>
  );
}

export default function BracketTab({ state }) {
  const byRound = useMemo(() => {
    const g = {};
    for (const m of state.matches.filter((x) => x.stage === 'knockout')) {
      (g[m.round] = g[m.round] || []).push(m);
    }
    return g;
  }, [state.matches]);

  const third = (byRound.THIRD || [])[0];

  return (
    <div className="card">
      <h3>Knockout bracket</h3>
      <p className="hint">Fills in as the organizer sets each round. Winners highlighted in green.</p>
      <div className="bracket">
        {COLS.map(([key, label]) => (
          <div className="bcol" key={key}>
            <h4>{label}</h4>
            {(byRound[key] || []).map((m) => {
              const res = resultOf(m);
              return (
                <div className="bmatch" key={m.id}>
                  <Team name={m.home} score={m.home_score} win={res === 'home'} />
                  <Team name={m.away} score={m.away_score} win={res === 'away'} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {third && (
        <div style={{ marginTop: 16, maxWidth: 220 }}>
          <h4 style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>
            Third place
          </h4>
          <div className="bmatch">
            <Team name={third.home} score={third.home_score} win={resultOf(third) === 'home'} />
            <Team name={third.away} score={third.away_score} win={resultOf(third) === 'away'} />
          </div>
        </div>
      )}
    </div>
  );
}
