import { NextResponse } from 'next/server';
import { query } from '@/lib/db.mjs';
import { verifyAdmin } from '@/lib/admin.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { adminPassword, matchId, homeScore, awayScore } = await req.json();
    if (!(await verifyAdmin(adminPassword))) {
      return NextResponse.json({ error: 'Wrong admin password.' }, { status: 401 });
    }
    const hs = homeScore === '' || homeScore == null ? null : Number(homeScore);
    const as = awayScore === '' || awayScore == null ? null : Number(awayScore);
    await query(`UPDATE matches SET home_score=$2, away_score=$3 WHERE id=$1`, [matchId, hs, as]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
