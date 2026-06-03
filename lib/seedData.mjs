// Real 2026 FIFA World Cup data: 48 teams, 12 groups, 72 group-stage fixtures.
// Groups and fixtures sourced from the official draw (Dec 2025) + March 2026 playoff results.
// NOTE: kickoff TIMES are provisional defaults (ET). Confirm/adjust exact times in the
// Admin -> Schedule panel before launch, since picks lock at each match's kickoff.

export const TEAMS = [
  // Group A
  { name: 'Mexico', group: 'A', flag: '🇲🇽' },
  { name: 'South Africa', group: 'A', flag: '🇿🇦' },
  { name: 'South Korea', group: 'A', flag: '🇰🇷' },
  { name: 'Czech Republic', group: 'A', flag: '🇨🇿' },
  // Group B
  { name: 'Canada', group: 'B', flag: '🇨🇦' },
  { name: 'Bosnia and Herzegovina', group: 'B', flag: '🇧🇦' },
  { name: 'Qatar', group: 'B', flag: '🇶🇦' },
  { name: 'Switzerland', group: 'B', flag: '🇨🇭' },
  // Group C
  { name: 'Brazil', group: 'C', flag: '🇧🇷' },
  { name: 'Morocco', group: 'C', flag: '🇲🇦' },
  { name: 'Haiti', group: 'C', flag: '🇭🇹' },
  { name: 'Scotland', group: 'C', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  // Group D
  { name: 'United States', group: 'D', flag: '🇺🇸' },
  { name: 'Paraguay', group: 'D', flag: '🇵🇾' },
  { name: 'Australia', group: 'D', flag: '🇦🇺' },
  { name: 'Turkey', group: 'D', flag: '🇹🇷' },
  // Group E
  { name: 'Germany', group: 'E', flag: '🇩🇪' },
  { name: 'Curaçao', group: 'E', flag: '🇨🇼' },
  { name: 'Ivory Coast', group: 'E', flag: '🇨🇮' },
  { name: 'Ecuador', group: 'E', flag: '🇪🇨' },
  // Group F
  { name: 'Netherlands', group: 'F', flag: '🇳🇱' },
  { name: 'Japan', group: 'F', flag: '🇯🇵' },
  { name: 'Sweden', group: 'F', flag: '🇸🇪' },
  { name: 'Tunisia', group: 'F', flag: '🇹🇳' },
  // Group G
  { name: 'Belgium', group: 'G', flag: '🇧🇪' },
  { name: 'Egypt', group: 'G', flag: '🇪🇬' },
  { name: 'Iran', group: 'G', flag: '🇮🇷' },
  { name: 'New Zealand', group: 'G', flag: '🇳🇿' },
  // Group H
  { name: 'Spain', group: 'H', flag: '🇪🇸' },
  { name: 'Cape Verde', group: 'H', flag: '🇨🇻' },
  { name: 'Saudi Arabia', group: 'H', flag: '🇸🇦' },
  { name: 'Uruguay', group: 'H', flag: '🇺🇾' },
  // Group I
  { name: 'France', group: 'I', flag: '🇫🇷' },
  { name: 'Senegal', group: 'I', flag: '🇸🇳' },
  { name: 'Iraq', group: 'I', flag: '🇮🇶' },
  { name: 'Norway', group: 'I', flag: '🇳🇴' },
  // Group J
  { name: 'Argentina', group: 'J', flag: '🇦🇷' },
  { name: 'Algeria', group: 'J', flag: '🇩🇿' },
  { name: 'Austria', group: 'J', flag: '🇦🇹' },
  { name: 'Jordan', group: 'J', flag: '🇯🇴' },
  // Group K
  { name: 'Portugal', group: 'K', flag: '🇵🇹' },
  { name: 'DR Congo', group: 'K', flag: '🇨🇩' },
  { name: 'Uzbekistan', group: 'K', flag: '🇺🇿' },
  { name: 'Colombia', group: 'K', flag: '🇨🇴' },
  // Group L
  { name: 'England', group: 'L', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { name: 'Croatia', group: 'L', flag: '🇭🇷' },
  { name: 'Ghana', group: 'L', flag: '🇬🇭' },
  { name: 'Panama', group: 'L', flag: '🇵🇦' },
];

// Group-stage fixtures in official order. date = YYYY-MM-DD (local match date).
export const GROUP_FIXTURES = [
  // A
  { group: 'A', date: '2026-06-11', home: 'Mexico', away: 'South Africa' },
  { group: 'A', date: '2026-06-11', home: 'South Korea', away: 'Czech Republic' },
  { group: 'A', date: '2026-06-18', home: 'Czech Republic', away: 'South Africa' },
  { group: 'A', date: '2026-06-18', home: 'Mexico', away: 'South Korea' },
  { group: 'A', date: '2026-06-24', home: 'Czech Republic', away: 'Mexico' },
  { group: 'A', date: '2026-06-24', home: 'South Africa', away: 'South Korea' },
  // B
  { group: 'B', date: '2026-06-12', home: 'Canada', away: 'Bosnia and Herzegovina' },
  { group: 'B', date: '2026-06-13', home: 'Qatar', away: 'Switzerland' },
  { group: 'B', date: '2026-06-18', home: 'Switzerland', away: 'Bosnia and Herzegovina' },
  { group: 'B', date: '2026-06-18', home: 'Canada', away: 'Qatar' },
  { group: 'B', date: '2026-06-24', home: 'Switzerland', away: 'Canada' },
  { group: 'B', date: '2026-06-24', home: 'Bosnia and Herzegovina', away: 'Qatar' },
  // C
  { group: 'C', date: '2026-06-13', home: 'Brazil', away: 'Morocco' },
  { group: 'C', date: '2026-06-13', home: 'Haiti', away: 'Scotland' },
  { group: 'C', date: '2026-06-19', home: 'Scotland', away: 'Morocco' },
  { group: 'C', date: '2026-06-19', home: 'Brazil', away: 'Haiti' },
  { group: 'C', date: '2026-06-24', home: 'Scotland', away: 'Brazil' },
  { group: 'C', date: '2026-06-24', home: 'Morocco', away: 'Haiti' },
  // D
  { group: 'D', date: '2026-06-12', home: 'United States', away: 'Paraguay' },
  { group: 'D', date: '2026-06-13', home: 'Australia', away: 'Turkey' },
  { group: 'D', date: '2026-06-19', home: 'United States', away: 'Australia' },
  { group: 'D', date: '2026-06-19', home: 'Turkey', away: 'Paraguay' },
  { group: 'D', date: '2026-06-25', home: 'Turkey', away: 'United States' },
  { group: 'D', date: '2026-06-25', home: 'Paraguay', away: 'Australia' },
  // E
  { group: 'E', date: '2026-06-14', home: 'Germany', away: 'Curaçao' },
  { group: 'E', date: '2026-06-14', home: 'Ivory Coast', away: 'Ecuador' },
  { group: 'E', date: '2026-06-20', home: 'Germany', away: 'Ivory Coast' },
  { group: 'E', date: '2026-06-20', home: 'Ecuador', away: 'Curaçao' },
  { group: 'E', date: '2026-06-25', home: 'Curaçao', away: 'Ivory Coast' },
  { group: 'E', date: '2026-06-25', home: 'Ecuador', away: 'Germany' },
  // F
  { group: 'F', date: '2026-06-14', home: 'Netherlands', away: 'Japan' },
  { group: 'F', date: '2026-06-14', home: 'Sweden', away: 'Tunisia' },
  { group: 'F', date: '2026-06-20', home: 'Netherlands', away: 'Sweden' },
  { group: 'F', date: '2026-06-20', home: 'Tunisia', away: 'Japan' },
  { group: 'F', date: '2026-06-25', home: 'Japan', away: 'Sweden' },
  { group: 'F', date: '2026-06-25', home: 'Tunisia', away: 'Netherlands' },
  // G
  { group: 'G', date: '2026-06-15', home: 'Belgium', away: 'Egypt' },
  { group: 'G', date: '2026-06-15', home: 'Iran', away: 'New Zealand' },
  { group: 'G', date: '2026-06-21', home: 'Belgium', away: 'Iran' },
  { group: 'G', date: '2026-06-21', home: 'New Zealand', away: 'Egypt' },
  { group: 'G', date: '2026-06-26', home: 'Egypt', away: 'Iran' },
  { group: 'G', date: '2026-06-26', home: 'New Zealand', away: 'Belgium' },
  // H
  { group: 'H', date: '2026-06-15', home: 'Spain', away: 'Cape Verde' },
  { group: 'H', date: '2026-06-15', home: 'Saudi Arabia', away: 'Uruguay' },
  { group: 'H', date: '2026-06-21', home: 'Spain', away: 'Saudi Arabia' },
  { group: 'H', date: '2026-06-21', home: 'Uruguay', away: 'Cape Verde' },
  { group: 'H', date: '2026-06-26', home: 'Cape Verde', away: 'Saudi Arabia' },
  { group: 'H', date: '2026-06-26', home: 'Uruguay', away: 'Spain' },
  // I
  { group: 'I', date: '2026-06-16', home: 'France', away: 'Senegal' },
  { group: 'I', date: '2026-06-16', home: 'Iraq', away: 'Norway' },
  { group: 'I', date: '2026-06-22', home: 'France', away: 'Iraq' },
  { group: 'I', date: '2026-06-22', home: 'Norway', away: 'Senegal' },
  { group: 'I', date: '2026-06-26', home: 'Norway', away: 'France' },
  { group: 'I', date: '2026-06-26', home: 'Senegal', away: 'Iraq' },
  // J
  { group: 'J', date: '2026-06-16', home: 'Argentina', away: 'Algeria' },
  { group: 'J', date: '2026-06-16', home: 'Austria', away: 'Jordan' },
  { group: 'J', date: '2026-06-22', home: 'Argentina', away: 'Austria' },
  { group: 'J', date: '2026-06-22', home: 'Jordan', away: 'Algeria' },
  { group: 'J', date: '2026-06-27', home: 'Algeria', away: 'Austria' },
  { group: 'J', date: '2026-06-27', home: 'Jordan', away: 'Argentina' },
  // K
  { group: 'K', date: '2026-06-17', home: 'Portugal', away: 'DR Congo' },
  { group: 'K', date: '2026-06-17', home: 'Uzbekistan', away: 'Colombia' },
  { group: 'K', date: '2026-06-23', home: 'Portugal', away: 'Uzbekistan' },
  { group: 'K', date: '2026-06-23', home: 'Colombia', away: 'DR Congo' },
  { group: 'K', date: '2026-06-27', home: 'Colombia', away: 'Portugal' },
  { group: 'K', date: '2026-06-27', home: 'DR Congo', away: 'Uzbekistan' },
  // L
  { group: 'L', date: '2026-06-17', home: 'England', away: 'Croatia' },
  { group: 'L', date: '2026-06-17', home: 'Ghana', away: 'Panama' },
  { group: 'L', date: '2026-06-23', home: 'England', away: 'Ghana' },
  { group: 'L', date: '2026-06-23', home: 'Panama', away: 'Croatia' },
  { group: 'L', date: '2026-06-27', home: 'Panama', away: 'England' },
  { group: 'L', date: '2026-06-27', home: 'Croatia', away: 'Ghana' },
];

// Knockout skeleton. Teams are filled in by the organizer (Admin) as each round is set.
// Provisional dates; adjust in Admin. Round point values live in lib/scoring.mjs.
export const KNOCKOUT_TEMPLATE = [
  ...Array.from({ length: 16 }, (_, i) => ({ round: 'R32', n: i + 1, date: '2026-06-29' })),
  ...Array.from({ length: 8 }, (_, i) => ({ round: 'R16', n: i + 1, date: '2026-07-04' })),
  ...Array.from({ length: 4 }, (_, i) => ({ round: 'QF', n: i + 1, date: '2026-07-09' })),
  ...Array.from({ length: 2 }, (_, i) => ({ round: 'SF', n: i + 1, date: '2026-07-14' })),
  { round: 'THIRD', n: 1, date: '2026-07-18' },
  { round: 'FINAL', n: 1, date: '2026-07-19' },
];

// Default kickoff hours (ET) cycled across each day's matches.
const KICKOFF_HOURS = [13, 16, 19, 22];

// Build the full match list (group + knockout) with stable ids and ISO kickoff datetimes.
export function buildMatches() {
  const matches = [];
  const perDayCount = {};
  for (const fx of GROUP_FIXTURES) {
    const idx = perDayCount[fx.date] || 0;
    perDayCount[fx.date] = idx + 1;
    const hour = KICKOFF_HOURS[idx % KICKOFF_HOURS.length];
    const seq = matches.filter((m) => m.stage === 'group').length + 1;
    matches.push({
      id: `g${seq}`,
      stage: 'group',
      round: 'GROUP',
      grp: fx.group,
      home: fx.home,
      away: fx.away,
      kickoff: `${fx.date}T${String(hour).padStart(2, '0')}:00:00-04:00`,
      slot_home: null,
      slot_away: null,
    });
  }
  for (const k of KNOCKOUT_TEMPLATE) {
    const idx = perDayCount[k.date] || 0;
    perDayCount[k.date] = idx + 1;
    const hour = KICKOFF_HOURS[idx % KICKOFF_HOURS.length];
    matches.push({
      id: `${k.round.toLowerCase()}_${k.n}`,
      stage: 'knockout',
      round: k.round,
      grp: null,
      home: 'TBD',
      away: 'TBD',
      kickoff: `${k.date}T${String(hour).padStart(2, '0')}:00:00-04:00`,
      slot_home: `${k.round} ${k.n} · Home`,
      slot_away: `${k.round} ${k.n} · Away`,
    });
  }
  return matches;
}

export const FLAG_BY_TEAM = Object.fromEntries(TEAMS.map((t) => [t.name, t.flag]));
