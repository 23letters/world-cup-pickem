import { NextResponse } from 'next/server';
import { query } from '@/lib/db.mjs';
import { verifyAdmin } from '@/lib/admin.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED = [
  'league_name', 'league_password', 'admin_password',
  'wildcard_count', 'wildcard_multiplier', 'exact_bonus', 'clean_sheet_bonus',
];

export async function POST(req) {
  try {
    const body = await req.json();
    if (!(await verifyAdmin(body.adminPassword))) {
      return NextResponse.json({ error: 'Wrong admin password.' }, { status: 401 });
    }
    for (const key of ALLOWED) {
      if (body[key] != null && body[key] !== '') {
        await query(
          `INSERT INTO settings(key,value) VALUES($1,$2)
           ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`,
          [key, String(body[key])]
        );
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
