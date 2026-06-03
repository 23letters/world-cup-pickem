// Server-only Postgres access layer (Neon / Vercel Postgres compatible).
import pg from 'pg';
import { buildMatches } from './seedData.mjs';

const { Pool } = pg;

function makePool() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. Add a Neon/Postgres database in Vercel.');
  }
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 3,
  });
}

// Reuse a single pool across hot reloads / serverless invocations.
// Created lazily so importing this module at build time never needs DATABASE_URL.
const g = globalThis;

function getPool() {
  if (!g.__wcPool) g.__wcPool = makePool();
  return g.__wcPool;
}

export function query(text, params) {
  return getPool().query(text, params);
}

export async function initSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
    CREATE TABLE IF NOT EXISTS players (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      passcode TEXT NOT NULL,
      color TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      stage TEXT,
      round TEXT,
      grp TEXT,
      home TEXT,
      away TEXT,
      kickoff TIMESTAMPTZ,
      home_score INT,
      away_score INT,
      slot_home TEXT,
      slot_away TEXT
    );
    CREATE TABLE IF NOT EXISTS picks (
      id SERIAL PRIMARY KEY,
      player_id INT REFERENCES players(id) ON DELETE CASCADE,
      match_id TEXT REFERENCES matches(id) ON DELETE CASCADE,
      pick TEXT,
      pred_home INT,
      pred_away INT,
      wildcard BOOLEAN DEFAULT false,
      updated_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(player_id, match_id)
    );
  `);
}

const DEFAULT_SETTINGS = {
  league_name: "Imperial Cup '26",
  league_password: 'worldcup',
  admin_password: 'admin',
  wildcard_count: '3',
  wildcard_multiplier: '3',
  exact_bonus: '5',
  clean_sheet_bonus: '3',
};

export async function seedMatchesAndSettings() {
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await query(
      `INSERT INTO settings(key, value) VALUES($1, $2) ON CONFLICT (key) DO NOTHING`,
      [key, value]
    );
  }
  const matches = buildMatches();
  for (const m of matches) {
    await query(
      `INSERT INTO matches(id, stage, round, grp, home, away, kickoff, slot_home, slot_away)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO NOTHING`,
      [m.id, m.stage, m.round, m.grp, m.home, m.away, m.kickoff, m.slot_home, m.slot_away]
    );
  }
  return { matches: matches.length };
}

export async function getSettings() {
  const { rows } = await query(`SELECT key, value FROM settings`);
  const out = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export async function tablesExist() {
  const { rows } = await query(
    `SELECT to_regclass('public.matches') AS m, to_regclass('public.players') AS p`
  );
  return Boolean(rows[0] && rows[0].m && rows[0].p);
}
