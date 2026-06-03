# World Cup 2026 Pick'em Pool ⚽

A self-hosted office pick'em for the 2026 FIFA World Cup. Everyone predicts the
winner of **every** match; picks lock at each match's kickoff; a live leaderboard,
bracket, and forecast update as results come in. Built with Next.js, deploys free
on Vercel with a free Neon Postgres database.

Pre-loaded with the **real** 2026 tournament: 48 teams, 12 groups, and all 72
group-stage fixtures with their actual dates.

---

## How scoring works

**Correct result** (pick the winner, or a draw in the group stage) — points double each knockout round:

| Stage | Points |
|-------|--------|
| Group stage | 10 |
| Round of 32 | 10 |
| Round of 16 | 20 |
| Quarterfinals | 40 |
| Semifinals | 80 |
| Third place | 40 |
| Final | 160 |

**Bonuses** (added on top of a correct result):
- **+5** exact scoreline
- **+3** clean sheet (you correctly called the winning team to concede zero)

**Wild cards:** each player gets **3**. Flag a match as a wild card before kickoff
and *all* its points are multiplied **×3** (base + bonuses).

> Example: you pick Brazil to beat Serbia 2–0 and wild-card it. It finishes 2–0:
> 10 (result) + 5 (exact) + 3 (clean sheet) = 18, ×3 = **54 points**.

All of these values are editable in the Admin → League settings panel.

---

## Deploy it (about 15 minutes, no coding)

You need free accounts at **github.com** and **vercel.com**.

### 1. Put the code on GitHub
- Create a new empty repository (e.g. `worldcup-pool`).
- Upload this folder's contents (drag-and-drop in the GitHub web UI works, or use
  GitHub Desktop). Don't include `node_modules`.

### 2. Import into Vercel
- Vercel dashboard → **Add New → Project** → pick your repo → **Deploy**.
- ~1 minute later you have a live URL like `worldcup-pool.vercel.app`.

### 3. Add the free database
- In your Vercel project: **Storage → Create Database → Neon (Postgres)** → accept the free plan.
- Vercel automatically adds the `DATABASE_URL` environment variable. No copy-paste needed.
- Go to **Deployments → ⋯ → Redeploy** once so the app picks up the variable.

### 4. Initialize (one click)
- Visit `your-app.vercel.app/admin`.
- Click **Initialize database**. This loads the 48 teams, 12 groups, and full
  104-match schedule. (Default admin password is `admin` — change it in step 5.)

### 5. Set your league up
On the **/admin** page:
- **League settings:** set the league name, a new **admin password**, and tweak
  wild cards / bonuses if you like.
- **Enter results:** as matches finish, type the score and hit Save — the
  leaderboard recomputes automatically.
- **Knockout rounds:** once the group stage ends, use the R32/R16/etc. tabs to fill
  in each match's two teams and kickoff time. Players can then pick them.

### 6. Share
Send everyone the main URL. To play, each person enters their **name + a 4-digit
passcode** they choose (the passcode stops others editing their picks). Money is
handled off-app (e-transfer to the organizer), just like a March Madness pool.

---

## Important: confirm kickoff times before launch

Picks lock at each match's kickoff. The schedule ships with the correct **dates**
but **provisional times** (FIFA hadn't published exact kickoff times at build).
Before you go live, glance over the schedule and adjust any times in
**Admin → Enter results** (the knockout rows let you edit kickoff; for group games
you can adjust via the database if needed). Default times are spread across each
match day in US Eastern time.

---

## Running locally (optional, for developers)

```bash
npm install
# point at any Postgres (e.g. a free Neon branch):
export DATABASE_URL="postgres://user:pass@host/db?sslmode=require"
npm run seed      # creates tables + loads schedule
npm run dev       # http://localhost:3000
```

Run the scoring unit tests with `npm test`.

---

## Project structure

```
app/
  page.js              Main app: tabs (Make Picks / Standings / Rounds / Bracket / Forecast)
  admin/page.js        Organizer console (init, results, knockout teams, settings)
  api/                 Route handlers (state, login, picks, admin/*)
components/             One component per tab
lib/
  seedData.mjs         Real 2026 teams, groups, fixtures
  scoring.mjs          Pure scoring engine (unit-tested)
  view.mjs             Leaderboard + Monte-Carlo forecast helpers
  db.mjs               Postgres access + schema + seed
```

## Notes & limits
- Passcodes are lightweight (a 4-digit gate), not bank-grade security — fine for an
  office pool, but don't treat it as private.
- Other players' picks stay hidden until each match kicks off, then they're revealed.
- The Forecast tab simulates remaining matches from locked picks; early in the
  tournament it mostly reflects the current standings.
