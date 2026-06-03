import { NextResponse } from 'next/server';
import { query } from '@/lib/db.mjs';
import { verifyAdmin } from '@/lib/admin.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Set knockout teams and/or kickoff time for a match.
export async function POST(req) {
  try {
    const { adminPassword, matchId, home, away, kickoff } = await req.json();
    if (!(await verifyAdmin(adminPassword))) {
      return NextResponse.json({ error: 'Wrong admin password.' }, { status: 401 });
    }
    const fields = [];
    const vals = [matchId];
    if (home != null && home !== '') { vals.push(home); fields.push(`home=$${vals.length}`); }
    if (away != null && away !== '') { vals.push(away); fields.push(`away=$${vals.length}`); }
    if (kickoff != null && kickoff !== '') { vals.push(kickoff); fields.push(`kickoff=$${vals.length}`); }
    if (!fields.length) return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
    await query(`UPDATE matches SET ${fields.join(', ')} WHERE id=$1`, vals);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
