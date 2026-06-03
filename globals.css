'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import StandingsTab from '@/components/StandingsTab';
import PicksTab from '@/components/PicksTab';
import RoundsTab from '@/components/RoundsTab';
import BracketTab from '@/components/BracketTab';
import ForecastTab from '@/components/ForecastTab';

const TABS = [
  { key: 'picks', label: '✏️ Make Picks' },
  { key: 'standings', label: '🏆 Standings' },
  { key: 'rounds', label: '📋 Rounds' },
  { key: 'bracket', label: '📊 Bracket' },
  { key: 'forecast', label: '📈 Forecast' },
];

export default function Page() {
  const [state, setState] = useState(null);
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('picks');
  const [auth, setAuth] = useState(null); // { name, passcode, player }
  const [myPicks, setMyPicks] = useState({}); // matchId -> { pick, pred_home, pred_away, wildcard }
  const [showLogin, setShowLogin] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const fetchState = useCallback(async () => {
    try {
      const r = await fetch('/api/state', { cache: 'no-store' });
      const j = await r.json();
      if (j.error) setErr(j.error);
      else setState(j);
    } catch (e) {
      setErr(String(e));
    }
  }, []);

  useEffect(() => {
    fetchState();
    try {
      const saved = JSON.parse(localStorage.getItem('wc_auth') || 'null');
      if (saved && saved.name && saved.passcode) doLogin(saved.name, saved.passcode, true);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doLogin(name, passcode, silent) {
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, passcode }),
      });
      const j = await r.json();
      if (j.error) {
        if (!silent) setErr(j.error);
        return false;
      }
      setAuth({ name: j.player.name, passcode, player: j.player });
      const pm = {};
      for (const p of j.picks) pm[p.match_id] = p;
      setMyPicks(pm);
      localStorage.setItem('wc_auth', JSON.stringify({ name: j.player.name, passcode }));
      setShowLogin(false);
      setErr('');
      fetchState();
      return true;
    } catch (e) {
      if (!silent) setErr(String(e));
      return false;
    }
  }

  function logout() {
    setAuth(null);
    setMyPicks({});
    localStorage.removeItem('wc_auth');
  }

  // Save / update a pick. patch merges into existing local pick.
  const savePick = useCallback(
    async (matchId, patch) => {
      if (!auth) { setShowLogin(true); return; }
      const prev = myPicks[matchId] || {};
      const merged = { ...prev, ...patch, match_id: matchId };
      // optimistic
      setMyPicks((m) => ({ ...m, [matchId]: merged }));
      try {
        const r = await fetch('/api/picks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: auth.name,
            passcode: auth.passcode,
            matchId,
            pick: merged.pick || null,
            predHome: merged.pred_home,
            predAway: merged.pred_away,
            wildcard: !!merged.wildcard,
          }),
        });
        const j = await r.json();
        if (j.error) {
          setErr(j.error);
          setMyPicks((m) => ({ ...m, [matchId]: prev.pick ? prev : undefined }));
        } else {
          setErr('');
        }
      } catch (e) {
        setErr(String(e));
      }
    },
    [auth, myPicks]
  );

  const wildcardsUsed = useMemo(
    () => Object.values(myPicks).filter((p) => p && p.wildcard).length,
    [myPicks]
  );

  if (!state) {
    return (
      <div className="container">
        <h1 className="app-title">World Cup 2026</h1>
        <p className="center muted">{err || 'Loading…'}</p>
      </div>
    );
  }

  if (state.initialized === false) {
    return (
      <div className="container">
        <h1 className="app-title">World Cup 2026 Pick'em</h1>
        <div className="card">
          <h3>One-time setup needed</h3>
          <p className="hint">
            The database is connected but empty. Open the Admin page and click
            “Initialize database” to load the 48 teams, 12 groups and full schedule.
          </p>
          <a className="btn primary" href="/admin">Go to Admin →</a>
        </div>
      </div>
    );
  }

  const leagueName = state.settings?.league_name || "World Cup 2026 Pick'em";

  return (
    <div className="container">
      {showBanner && (
        <div className="banner">
          <button className="x" onClick={() => setShowBanner(false)}>✕</button>
          <h2>Welcome to {leagueName} ⚽</h2>
          <p>
            Pick the winner of <b>every</b> match. Correct result scores points that
            <b> double each knockout round</b> (Group/R32 10 → R16 20 → QF 40 → SF 80 → Final 160).
          </p>
          <p>
            Bonuses: <b>+{state.settings.exact_bonus} exact score</b>,
            <b> +{state.settings.clean_sheet_bonus} clean sheet</b>. Each player gets
            <b> {state.settings.wildcard_count} wild cards</b> that multiply a match by
            <b> ×{state.settings.wildcard_multiplier}</b>. Picks lock at each match's kickoff.
          </p>
        </div>
      )}

      <h1 className="app-title">{leagueName}</h1>
      <p className="app-sub">
        FIFA World Cup 2026 · Pick'em Pool
        {state.now && <><span className="dot">·</span>updated {new Date(state.now).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</>}
      </p>

      <div className="spacer" />

      <div className="loginbar">
        {auth ? (
          <>
            <span className="who">
              <span className="swatch" style={{ background: auth.player.color }} />
              {auth.player.name}
            </span>
            <span className="small muted">Wild cards: {wildcardsUsed}/{state.settings.wildcard_count}</span>
            <button className="btn sm" onClick={logout}>Sign out</button>
          </>
        ) : (
          <button className="btn primary" onClick={() => setShowLogin(true)}>Sign in to make picks</button>
        )}
        <a className="btn sm right" href="/admin">Admin</a>
      </div>

      {err && <p className="error center">{err}</p>}

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'picks' && (
        <PicksTab
          state={state}
          auth={auth}
          myPicks={myPicks}
          wildcardsUsed={wildcardsUsed}
          savePick={savePick}
          onNeedLogin={() => setShowLogin(true)}
        />
      )}
      {tab === 'standings' && <StandingsTab state={state} auth={auth} />}
      {tab === 'rounds' && <RoundsTab state={state} />}
      {tab === 'bracket' && <BracketTab state={state} />}
      {tab === 'forecast' && <ForecastTab state={state} />}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSubmit={doLogin}
          err={err}
        />
      )}
    </div>
  );
}

function LoginModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [localErr, setLocalErr] = useState('');

  async function submit() {
    setBusy(true);
    setLocalErr('');
    const ok = await onSubmit(name, code);
    setBusy(false);
    if (!ok) setLocalErr('Could not sign in. New name? Pick any 4-digit code. Returning? Use your code.');
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
        display: 'grid', placeItems: 'center', padding: 16, zIndex: 50,
      }}
      onClick={onClose}
    >
      <div className="card" style={{ maxWidth: 360, width: '100%', margin: 0 }} onClick={(e) => e.stopPropagation()}>
        <h3>Sign in</h3>
        <p className="hint">
          New player? Enter your name and choose a 4-digit code. Returning? Use the same name + code.
        </p>
        <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10 }}>
          <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input
            placeholder="4-digit passcode"
            value={code}
            inputMode="numeric"
            maxLength={4}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          {localErr && <p className="error">{localErr}</p>}
          <div className="row">
            <button className="btn primary" onClick={submit} disabled={busy}>
              {busy ? '…' : 'Continue'}
            </button>
            <button className="btn" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
