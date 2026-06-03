import { NextResponse } from 'next/server';
import { initSchema, seedMatchesAndSettings, getSettings, tablesExist } from '@/lib/db.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { adminPassword } = await req.json().catch(() => ({}));

    // If already initialized, require the admin password to re-run (idempotent seed).
    if (await tablesExist()) {
      const settings = await getSettings();
      if (settings.admin_password && adminPassword !== settings.admin_password) {
        return NextResponse.json({ error: 'Wrong admin password.' }, { status: 401 });
      }
    }

    await initSchema();
    const res = await seedMatchesAndSettings();
    return NextResponse.json({ ok: true, ...res });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
