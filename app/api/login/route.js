import { NextResponse } from 'next/server';
import { query } from '@/lib/db.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c',
  '#0891b2', '#db2777', '#ca8a04', '#4f46e5', '#059669',
  '#e11d48', '#7c3aed', '#0d9488', '#d97706', '#475569', '#be123c',
];

export async function POST(req) {
  try {
    const { name, passcode } = await req.json();
    const cleanName = (name || '').trim();
    const code = String(passcode || '').trim();
    if (!cleanName) return NextResponse.json({ error: 'Enter your name.' }, { status: 400 });
    if (!/^\d{4}$/.test(code)) {
      return NextResponse.json({ error: 'Passcode must be 4 digits.' }, { status: 400 });
    }

    const existing = (await query(`SELECT * FROM players WHERE lower(name) = lower($1)`, [cleanName])).rows[0];
    let player;
    if (existing) {
      if (existing.passcode !== code) {
        return NextResponse.json({ error: 'Wrong passcode for that name.' }, { status: 401 });
      }
      player = existing;
    } else {
      const count = (await query(`SELECT COUNT(*)::int AS c FROM players`)).rows[0].c;
      const color = COLORS[count % COLORS.length];
      player = (
        await query(
          `INSERT INTO players(name, passcode, color) VALUES($1,$2,$3) RETURNING *`,
          [cleanName, code, color]
        )
      ).rows[0];
    }

    const picks = (
      await query(
        `SELECT match_id, pick, pred_home, pred_away, wildcard FROM picks WHERE player_id = $1`,
        [player.id]
      )
    ).rows;

    return NextResponse.json({
      player: { id: player.id, name: player.name, color: player.color },
      picks,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
