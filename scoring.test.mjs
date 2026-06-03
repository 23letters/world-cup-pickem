import { NextResponse } from 'next/server';
import { query, getSettings, tablesExist } from '@/lib/db.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ready = await tablesExist();
    if (!ready) {
      return NextResponse.json({ initialized: false });
    }
    const settings = await getSettings();
    const players = (await query(`SELECT id, name, color FROM players ORDER BY id`)).rows;
    const matches = (
      await query(
        `SELECT id, stage, round, grp, home, away, kickoff, home_score, away_score, slot_home, slot_away
         FROM matches ORDER BY kickoff, id`
      )
    ).rows;
    // Only reveal picks on matches that are locked (kicked off) or already scored.
    const picks = (
      await query(
        `SELECT p.player_id, p.match_id, p.pick, p.pred_home, p.pred_away, p.wildcard
         FROM picks p JOIN matches m ON m.id = p.match_id
         WHERE m.kickoff <= now() OR m.home_score IS NOT NULL`
      )
    ).rows;

    // count of wildcards used per player (across all picks, for display)
    const wc = (
      await query(`SELECT player_id, COUNT(*)::int AS used FROM picks WHERE wildcard = true GROUP BY player_id`)
    ).rows;

    const publicSettings = {
      league_name: settings.league_name,
      wildcard_count: Number(settings.wildcard_count),
      wildcard_multiplier: Number(settings.wildcard_multiplier),
      exact_bonus: Number(settings.exact_bonus),
      clean_sheet_bonus: Number(settings.clean_sheet_bonus),
    };

    return NextResponse.json({
      initialized: true,
      settings: publicSettings,
      players,
      matches,
      picks,
      wildcardUsed: Object.fromEntries(wc.map((r) => [r.player_id, r.used])),
      now: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
