'use client';

import { useEffect, useMemo, useState } from 'react';
import { fmtDate, fmtTime } from '@/lib/view.mjs';
import { ROUND_LABEL } from '@/lib/scoring.mjs';
import { TEAMS } from '@/lib/seedData.mjs';

const ROUND_FILTERS = ['GROUP', 'R32', 'R16', 'QF', 'SF', 'THIRD', 'FINAL'];

export default function AdminPage() {
  const [state, setState] = useState(null);
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [filter, setFilter] = useState('GROUP');

  async function load() {
    const r = await fetch('/api/state', { cache: 'no-store' });
    setState(await r.json());
  }
  useEffect(() => {
    load();
    try { setPw(localStorage.getItem('wc_admin_pw') || ''); } catch {}
  }, []);

  function note(m, isErr) {
    if (isErr) { setErr(m); setMsg(''); } else { setMsg(m); setErr(''); }
    setTimeout(() => { setMsg(''); setErr(''); }, 2500);
  }

  async function post(url, body) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return r.json();
  }

  async function initDb() {
    const j = await post('/api/admin/init', { adminPassword: pw });
    if (j.error) note(j.error, true);
    else { note(`Initialized: ${j.matches} matches loaded.`); load(); }
  }

  function rememberPw() {
    try { localStorage.setItem('wc_admin_pw', pw); } catch {}
    note('Admin password saved on this device.');
  }

  const matches = state?.matches || [];
  const filtered = useMemo(
    () => matches.filter((m) => (filter === 'GROUP' ? m.round === 'GROUP' : m.round === filter)),
    [matches, filter]
  );

  return (
    <div className="container">
      <h1 className="app-title" style={{ fontSize: 26 }}>Admin · World Cup Pool</h1>
      <p className="app-sub">Organizer controls. Keep this page to yourself.</p>
      <div className="spacer" />
      <a className="btn sm" href="/">← Back to pool</a>
      <div className="spacer" />

      {msg && <p className="ok center">{msg}</p>}
      {err && <p className="error center">{err}</p>}

      <div className="card">
        <h3>Admin password</h3>
        <p className="hint">Required for every change below. Default is <code>admin</code> until you change it in Settings.</p>
        <div className="row">
          <input type="password" placeholder="Admin password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <button className="btn sm" onClick={rememberPw}>Remember on this device</button>
        </div>
      </div>

      {state && state.initialized === false && (
        <div className="card">
          <h3>1 · Initialize database</h3>
          <p className="hint">Loads the 48 teams, 12 groups, and full 104-match schedule. Run this once after connecting your database.</p>
          <button className="btn primary" onClick={initDb}>Initialize database</button>
        </div>
      )}

      {state && state.initialized && (
        <>
          <div className="card">
            <h3>Enter results</h3>
            <p className="hint">Type the final score and Save. The leaderboard recomputes automatically.</p>
            <div className="tabs" style={{ marginBottom: 12 }}>
              {ROUND_FILTERS.map((r) => (
                <button key={r} className={`tab ${filter === r ? 'active' : ''}`} onClick={() => setFilter(r)}>
                  {r === 'GROUP' ? 'Groups' : r}
                </button>
              ))}
            </div>
            {filtered.map((m) => (
              <ResultRow key={m.id} m={m} pw={pw} post={post} note={note} reload={load} knockout={m.stage === 'knockout'} />
            ))}
          </div>

          <SettingsCard state={state} pw={pw} post={post} note={note} reload={load} />
          <div className="card">
            <h3>Re-seed</h3>
            <p className="hint">Safe to re-run; it only adds missing matches/settings, never overwrites scores.</p>
            <button className="btn" onClick={initDb}>Re-run seed</button>
          </div>
        </>
      )}

      <datalist id="teamlist">
        {TEAMS.map((t) => <option key={t.name} value={t.name} />)}
      </datalist>
    </div>
  );
}

function ResultRow({ m, pw, post, note, reload, knockout }) {
  const [hs, setHs] = useState(m.home_score ?? '');
  const [as, setAs] = useState(m.away_score ?? '');
  const [home, setHome] = useState(m.home);
  const [away, setAway] = useState(m.away);
  const [kickoff, setKickoff] = useState((m.kickoff || '').slice(0, 16));

  async function saveResult() {
    const j = await post('/api/admin/result', { adminPassword: pw, matchId: m.id, homeScore: hs, awayScore: as });
    if (j.error) note(j.error, true); else { note(`Saved ${home} ${hs}–${as} ${away}`); reload(); }
  }
  async function saveTeams() {
    const iso = kickoff ? new Date(kickoff).toISOString() : '';
    const j = await post('/api/admin/match', { adminPassword: pw, matchId: m.id, home, away, kickoff: iso });
    if (j.error) note(j.error, true); else { note('Match updated'); reload(); }
  }

  return (
    <div className="match" style={{ marginBottom: 8 }}>
      <div className="match-meta" style={{ marginBottom: 6 }}>
        <span className="rnd">{m.stage === 'group' ? `Group ${m.grp}` : ROUND_LABEL[m.round]}</span>
        {' · '}{fmtDate(m.kickoff)} {fmtTime(m.kickoff)}
      </div>
      {knockout && (
        <div className="row" style={{ marginBottom: 8 }}>
          <input list="teamlist" style={{ width: 130 }} value={home === 'TBD' ? '' : home} placeholder="Home team" onChange={(e) => setHome(e.target.value)} />
          <input list="teamlist" style={{ width: 130 }} value={away === 'TBD' ? '' : away} placeholder="Away team" onChange={(e) => setAway(e.target.value)} />
          <input type="datetime-local" value={kickoff} onChange={(e) => setKickoff(e.target.value)} />
          <button className="btn sm" onClick={saveTeams}>Set teams</button>
        </div>
      )}
      <div className="row">
        <b style={{ width: 130, textAlign: 'right' }}>{home}</b>
        <input className="score-input" inputMode="numeric" value={hs} onChange={(e) => setHs(e.target.value)} />
        <span>–</span>
        <input className="score-input" inputMode="numeric" value={as} onChange={(e) => setAs(e.target.value)} />
        <b style={{ width: 130 }}>{away}</b>
        <button className="btn sm primary" onClick={saveResult}>Save</button>
      </div>
    </div>
  );
}

function SettingsCard({ state, pw, post, note, reload }) {
  const s = state.settings || {};
  const [f, setF] = useState({
    league_name: s.league_name || '',
    league_password: '',
    admin_password: '',
    wildcard_count: s.wildcard_count ?? 3,
    wildcard_multiplier: s.wildcard_multiplier ?? 3,
    exact_bonus: s.exact_bonus ?? 5,
    clean_sheet_bonus: s.clean_sheet_bonus ?? 3,
  });
  function up(k, v) { setF((o) => ({ ...o, [k]: v })); }
  async function save() {
    const body = { adminPassword: pw, ...f };
    // don't send blank password fields
    if (!body.league_password) delete body.league_password;
    if (!body.admin_password) delete body.admin_password;
    const j = await post('/api/admin/settings', body);
    if (j.error) note(j.error, true); else { note('Settings saved'); reload(); }
  }
  return (
    <div className="card">
      <h3>League settings</h3>
      <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 10, maxWidth: 420 }}>
        <label className="small muted">League name
          <input value={f.league_name} onChange={(e) => up('league_name', e.target.value)} style={{ width: '100%' }} />
        </label>
        <label className="small muted">New admin password (blank = keep)
          <input value={f.admin_password} onChange={(e) => up('admin_password', e.target.value)} style={{ width: '100%' }} />
        </label>
        <div className="row">
          <label className="small muted">Wild cards
            <input className="score-input" value={f.wildcard_count} onChange={(e) => up('wildcard_count', e.target.value)} />
          </label>
          <label className="small muted">Multiplier ×
            <input className="score-input" value={f.wildcard_multiplier} onChange={(e) => up('wildcard_multiplier', e.target.value)} />
          </label>
          <label className="small muted">Exact +
            <input className="score-input" value={f.exact_bonus} onChange={(e) => up('exact_bonus', e.target.value)} />
          </label>
          <label className="small muted">Clean sheet +
            <input className="score-input" value={f.clean_sheet_bonus} onChange={(e) => up('clean_sheet_bonus', e.target.value)} />
          </label>
        </div>
        <button className="btn primary" onClick={save} style={{ alignSelf: 'flex-start' }}>Save settings</button>
      </div>
    </div>
  );
}
