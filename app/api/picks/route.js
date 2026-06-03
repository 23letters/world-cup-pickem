import { NextResponse } from 'next/server';
import { query, getSettings } from '@/lib/db.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function authPlayer(name, passcode) {
  const p = (await query(`SELECT * FROM players WHERE lower(name)=lower($1)`, [(name || '').trim()])).rows[0];
  if (!p) return null;
  if (p.passcode !== String(passcode || '').trim()) return null;
  return p;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, passcode, matchId, pick, predHome, predAway, wildcard } = body;
    const player = await authPlayer(name, passcode);
    if (!player) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });

    const match = (await query(`SELECT * FROM matches WHERE id=$1`, [matchId])).rows[0];
    if (!match) return NextResponse.json({ error: 'Unknown match.' }, { status: 404 });

    // Lock check
    if (new Date(match.kickoff).getTime() <= Date.now()) {
      return NextResponse.json({ error: 'This match has locked at kickoff.' }, { status: 403 });
    }
    if (match.home === 'TBD' || match.away === 'TBD') {
      return NextResponse.json({ error: 'Teams not set for this match yet.' }, { status: 403 });
    }

    // Delete pick (deselect)
    if (!pick) {
      await query(`DELETE FROM picks WHERE player_id=$1 AND match_id=$2`, [player.id, matchId]);
      return NextResponse.json({ ok: true, deleted: true });
    }
    if (!['home', 'draw', 'away'].includes(pick)) {
      return NextResponse.json({ error: 'Invalid pick.' }, { status: 400 });
    }

    // Wildcard count enforcement
    const settings = await getSettings();
    const maxWild = Number(settings.wildcard_count || 3);
    if (wildcard) {
      const used = (
        await query(
          `SELECT COUNT(*)::int AS c FROM picks WHERE player_id=$1 AND wildcard=true AND match_id <> $2`,
          [player.id, matchId]
        )
      ).rows[0].c;
      if (used >= maxWild) {
        return NextResponse.json(
          { error: `You've already used all ${maxWild} wild cards.` },
          { status: 400 }
        );
      }
    }

    const ph = predHome === '' || predHome == null ? null : Number(predHome);
    const pa = predAway === '' || predAway == null ? null : Number(predAway);

    await query(
      `INSERT INTO picks(player_id, match_id, pick, pred_home, pred_away, wildcard, updated_at)
       VALUES($1,$2,$3,$4,$5,$6, now())
       ON CONFLICT (player_id, match_id)
       DO UPDATE SET pick=EXCLUDED.pick, pred_home=EXCLUDED.pred_home, pred_away=EXCLUDED.pred_away,
                     wildcard=EXCLUDED.wildcard, updated_at=now()`,
      [player.id, matchId, pick, ph, pa, !!wildcard]
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
