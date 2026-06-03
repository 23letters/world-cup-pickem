:root {
  --bg: #f4f5f7;
  --card: #ffffff;
  --border: #e8eaed;
  --border-strong: #d9dce1;
  --text: #0f172a;
  --muted: #64748b;
  --muted-2: #94a3b8;
  --accent: #ea580c;
  --accent-d: #c2410c;
  --accent-soft: #fff4ec;
  --green: #16a34a;
  --green-soft: #ecfdf3;
  --red: #dc2626;
  --blue: #2563eb;
  --gold: #f59e0b;
  --radius: 16px;
  --radius-sm: 10px;
  --shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.05);
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; }

.container {
  max-width: 760px;
  margin: 0 auto;
  padding: 20px 16px 80px;
}

/* Header */
.app-title {
  text-align: center;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 8px 0 2px;
}
.app-sub { text-align: center; color: var(--muted); font-size: 14px; }
.app-sub .dot { margin: 0 6px; color: var(--muted-2); }

/* Banner */
.banner {
  background: linear-gradient(180deg, #fffaf4, #fff6ee);
  border: 1px solid #ffe2cd;
  border-radius: var(--radius);
  padding: 16px 18px;
  margin-bottom: 18px;
  position: relative;
}
.banner h2 { margin: 0 0 8px; font-size: 17px; }
.banner p { margin: 6px 0; font-size: 13.5px; color: #5b4636; line-height: 1.5; }
.banner .x {
  position: absolute; top: 10px; right: 12px; cursor: pointer;
  color: var(--muted-2); border: none; background: none; font-size: 16px;
}

/* Cards */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 16px;
  margin-bottom: 14px;
}
.card h3 { margin: 0 0 4px; font-size: 16px; }
.card .hint { color: var(--muted); font-size: 13px; margin: 0 0 12px; }

/* Status pill row */
.statusbar {
  background: var(--accent-soft);
  color: var(--accent-d);
  border-radius: 999px;
  text-align: center;
  font-size: 13.5px;
  font-weight: 600;
  padding: 9px 14px;
  margin-bottom: 16px;
}

/* Tabs */
.tabs {
  display: flex;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 5px;
  gap: 4px;
  box-shadow: var(--shadow);
  margin-bottom: 16px;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 9px 6px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  border: none;
  background: none;
  transition: background 0.12s, color 0.12s;
  white-space: nowrap;
}
.tab:hover { color: var(--text); }
.tab.active { background: var(--accent); color: #fff; }

/* Buttons */
.btn {
  border: 1px solid var(--border-strong);
  background: var(--card);
  border-radius: 10px;
  padding: 9px 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: var(--text);
}
.btn:hover { background: #f8fafc; }
.btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
.btn.primary:hover { background: var(--accent-d); }
.btn.ghost { background: none; border: none; color: var(--accent-d); font-weight: 600; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn.sm { padding: 6px 10px; font-size: 13px; }

input, select {
  font-family: inherit;
  font-size: 14px;
  padding: 9px 11px;
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  background: #fff;
  color: var(--text);
  outline: none;
}
input:focus, select:focus { border-color: var(--accent); }
.score-input { width: 46px; text-align: center; padding: 8px 4px; }

/* Login bar */
.loginbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 16px;
}
.who {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 999px; padding: 6px 12px; font-weight: 600; font-size: 14px;
  box-shadow: var(--shadow);
}

/* Leaderboard */
.lb-row {
  display: flex; align-items: center; gap: 12px;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 10px;
  background: var(--card);
}
.lb-row.me { background: #fffaf4; border-color: #ffd9bd; }
.lb-rank {
  width: 30px; height: 30px; flex: none;
  border-radius: 999px; display: grid; place-items: center;
  font-weight: 800; font-size: 14px; color: #fff; background: var(--muted-2);
}
.lb-rank.r1 { background: var(--gold); }
.lb-rank.r2 { background: #9aa4b2; }
.lb-rank.r3 { background: #c2752f; }
.lb-name { font-weight: 700; font-size: 15px; display: flex; align-items: center; gap: 8px; }
.swatch { width: 10px; height: 10px; border-radius: 999px; flex: none; }
.lb-stats { margin-left: auto; display: flex; gap: 18px; text-align: right; }
.lb-stat .k { display: block; font-size: 11px; color: var(--muted-2); text-transform: uppercase; letter-spacing: 0.03em; }
.lb-stat .v { font-size: 16px; font-weight: 800; }
.lb-stat .v.pos { color: var(--green); }
.tag {
  font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 999px;
  text-transform: uppercase; letter-spacing: 0.03em;
}
.tag.live { background: var(--green-soft); color: var(--green); }
.tag.wc { background: #eef2ff; color: #4f46e5; }

/* Match rows (picks) */
.daygroup { margin-bottom: 18px; }
.dayhdr {
  font-size: 12px; font-weight: 700; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.04em; margin: 4px 2px 8px;
}
.match {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px 14px;
  margin-bottom: 10px;
  background: var(--card);
}
.match.locked { background: #fafbfc; }
.match.wildcard { border-color: #c7d2fe; box-shadow: 0 0 0 1px #c7d2fe inset; }
.match-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.match-meta { font-size: 11.5px; color: var(--muted); }
.match-meta .rnd { font-weight: 700; color: var(--accent-d); }
.lockpill { font-size: 11px; font-weight: 700; color: var(--muted-2); }
.lockpill.open { color: var(--green); }
.teams { display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; align-items: stretch; }
.team-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  border: 1px solid var(--border-strong); border-radius: 12px;
  padding: 12px 10px; cursor: pointer; background: #fff; font-weight: 600; font-size: 14px;
  text-align: center; min-height: 50px;
}
.team-btn .flag { font-size: 18px; }
.team-btn.sel { border-color: var(--accent); background: var(--accent-soft); color: var(--accent-d); }
.team-btn.win { box-shadow: 0 0 0 2px var(--green) inset; border-color: var(--green); }
.team-btn:disabled { cursor: default; opacity: 0.85; }
.draw-btn {
  border: 1px solid var(--border-strong); border-radius: 12px; background: #fff;
  padding: 0 12px; cursor: pointer; font-weight: 600; color: var(--muted); font-size: 12px;
}
.draw-btn.sel { border-color: var(--accent); background: var(--accent-soft); color: var(--accent-d); }
.match-extra { display: flex; align-items: center; gap: 14px; margin-top: 11px; flex-wrap: wrap; }
.predscore { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); }
.wc-toggle { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer; user-select: none; margin-left: auto; }
.wc-toggle input { width: auto; }
.result-final { font-size: 12.5px; font-weight: 700; }
.pts { font-size: 12.5px; font-weight: 700; }
.pts.pos { color: var(--green); }
.pts.zero { color: var(--muted-2); }

/* Other picks reveal */
.others { margin-top: 10px; font-size: 12px; color: var(--muted); display: flex; flex-wrap: wrap; gap: 6px; }
.chip { display: inline-flex; align-items: center; gap: 5px; background: #f1f5f9; border-radius: 999px; padding: 3px 9px; }

/* Tables */
table.grid { width: 100%; border-collapse: collapse; font-size: 13.5px; }
table.grid th, table.grid td { padding: 9px 8px; text-align: center; border-bottom: 1px solid var(--border); }
table.grid th { color: var(--muted); font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.03em; font-weight: 700; }
table.grid td.name, table.grid th.name { text-align: left; font-weight: 700; }
table.grid td.total { font-weight: 800; }
table.grid td.pos { color: var(--green); font-weight: 700; }

/* Bracket */
.bracket { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; }
.bcol { min-width: 150px; display: flex; flex-direction: column; justify-content: space-around; gap: 10px; }
.bcol h4 { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; text-align: center; margin: 0 0 2px; }
.bmatch { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: #fff; font-size: 12.5px; }
.bteam { padding: 6px 8px; display: flex; justify-content: space-between; gap: 6px; }
.bteam + .bteam { border-top: 1px solid var(--border); }
.bteam.win { font-weight: 800; background: var(--green-soft); }
.bteam.tbd { color: var(--muted-2); font-style: italic; }

/* Forecast bars */
.fc-row { display: flex; align-items: center; gap: 10px; margin-bottom: 9px; }
.fc-name { width: 90px; font-weight: 700; font-size: 13px; display: flex; align-items: center; gap: 6px; }
.fc-track { flex: 1; background: #eef1f4; border-radius: 999px; height: 22px; position: relative; overflow: hidden; }
.fc-fill { height: 100%; border-radius: 999px; }
.fc-val { width: 56px; text-align: right; font-weight: 800; font-size: 13px; }

.muted { color: var(--muted); }
.center { text-align: center; }
.error { color: var(--red); font-size: 13px; }
.ok { color: var(--green); font-size: 13px; }
.small { font-size: 12.5px; }
.spacer { height: 8px; }
.row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.right { margin-left: auto; }
