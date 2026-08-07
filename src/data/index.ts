import { LEAGUE_SEEDS, FIRST_NAMES, LAST_NAMES, NATIONS } from "./seeds";
import { SPORTS, SPORT_MAP, getSport } from "./sports";
import { makeRandom, slugify } from "./rng";
import type {
  League,
  Team,
  Player,
  Match,
  MatchEvent,
  StandingRow,
  LineupSlot,
  PlayerSeason,
} from "./types";

export * from "./types";
export { SPORTS, SPORT_MAP, getSport, PHASE_LABEL } from "./sports";
export { slugify } from "./rng";

/* ------------------------------------------------------------------ leagues */

export const LEAGUES: League[] = LEAGUE_SEEDS.map((l) => ({
  slug: l.slug,
  name: l.name,
  shortName: l.short,
  sport: l.sport,
  country: l.country,
  tier: l.tier,
  season: l.season,
  teamSlugs: l.teams.map((t) => slugify(t.name)),
}));

export const TEAMS: Team[] = LEAGUE_SEEDS.flatMap((l) =>
  l.teams.map((t) => ({
    slug: slugify(t.name),
    name: t.name,
    shortName: t.short,
    abbr: t.abbr,
    sport: l.sport,
    league: l.slug,
    city: t.city,
    country: t.country,
    founded: t.founded,
    stadium: t.stadium,
    capacity: t.capacity,
    colors: t.colors,
    coach: t.coach,
  })),
);

const TEAM_MAP = new Map(TEAMS.map((t) => [t.slug, t]));
const LEAGUE_MAP = new Map(LEAGUES.map((l) => [l.slug, l]));

export const getTeam = (slug?: string) => (slug ? TEAM_MAP.get(slug) : undefined);
export const getLeague = (slug?: string) => (slug ? LEAGUE_MAP.get(slug) : undefined);
export const leaguesForSport = (sport: string) => LEAGUES.filter((l) => l.sport === sport);
export const teamsForLeague = (league: string) => TEAMS.filter((t) => t.league === league);
export const teamsForSport = (sport: string) => TEAMS.filter((t) => t.sport === sport);
export const sportsByPhase = (phase: number) => SPORTS.filter((s) => s.phase === phase);

/* ------------------------------------------------------------------ players */

const SEASONS_BY_SPORT: Record<string, string[]> = {
  soccer: ["2021/22", "2022/23", "2023/24", "2024/25", "2025/26"],
  basketball: ["2021-22", "2022-23", "2023-24", "2024-25", "2025-26"],
  hockey: ["2021-22", "2022-23", "2023-24", "2024-25", "2025-26"],
};

function seasonsFor(sport: string) {
  return SEASONS_BY_SPORT[sport] ?? ["2022", "2023", "2024", "2025", "2026"];
}

function statValue(key: string, r: ReturnType<typeof makeRandom>, tier: number): number {
  const boost = 1 + tier * 0.12;
  const table: Record<string, () => number> = {
    apps: () => r.int(18, 38),
    goals: () => Math.round(r.int(0, 22) * boost),
    assists: () => Math.round(r.int(0, 14) * boost),
    xg: () => r.float(0.4, 19 * boost, 2),
    xa: () => r.float(0.3, 11, 2),
    shots: () => r.int(9, 110),
    keyPasses: () => r.int(4, 82),
    passPct: () => r.float(68, 93, 1),
    rating: () => r.float(6.3, 8.4, 2),
    gp: () => r.int(48, 82),
    mpg: () => r.float(18, 37, 1),
    pts: () => r.float(6, 32 * (0.8 + tier * 0.06), 1),
    reb: () => r.float(2, 12.5, 1),
    ast: () => r.float(1, 10.5, 1),
    stl: () => r.float(0.3, 2.2, 1),
    blk: () => r.float(0.1, 2.6, 1),
    fg: () => r.float(41, 58, 1),
    tp: () => r.float(29, 43, 1),
    g: () => r.int(12, 17),
    yds: () => r.int(420, 4800),
    td: () => r.int(2, 42),
    ypg: () => r.float(28, 310, 1),
    fpts: () => r.float(90, 340, 1),
    avg: () => r.float(0.221, 0.332, 3),
    hr: () => r.int(4, 48),
    rbi: () => r.int(18, 126),
    ops: () => r.float(0.62, 1.02, 3),
    war: () => r.float(-0.4, 8.4, 1),
    era: () => r.float(2.1, 5.2, 2),
    m: () => r.int(8, 16),
    runs: () => r.int(120, 720),
    sr: () => r.float(112, 168, 1),
    wkts: () => r.int(0, 27),
    econ: () => r.float(6.2, 10.4, 2),
    w: () => r.int(8, 62),
    l: () => r.int(4, 28),
    titles: () => r.int(0, 6),
    acePct: () => r.float(4, 19, 1),
    firstServe: () => r.float(56, 74, 1),
    a: () => r.int(6, 62),
    p: () => r.int(14, 108),
    pm: () => r.int(-22, 34),
    toi: () => r.float(11, 24.5, 1),
    ev: () => r.int(10, 24),
    nr: () => r.int(0, 2),
  };
  return (table[key] ?? (() => r.int(1, 100)))();
}

function buildPlayer(team: Team, idx: number): Player {
  const sport = SPORT_MAP[team.sport]!;
  const r = makeRandom(`${team.slug}-p${idx}`);
  const name = `${r.pick(FIRST_NAMES)} ${r.pick(LAST_NAMES)}`;
  const tier = Math.max(0, 4 - Math.floor(idx / 4));
  const position = sport.positions[idx % sport.positions.length]!;
  const seasons: PlayerSeason[] = seasonsFor(team.sport).map((season, si) => {
    const sr = makeRandom(`${team.slug}-p${idx}-${season}`);
    const values: Record<string, number> = {};
    for (const c of sport.playerSeason) values[c.key] = statValue(c.key, sr, Math.min(tier, si + 1));
    return { season, team: team.name, league: team.league, values };
  });
  const current = seasons[seasons.length - 1]!.values;
  const dna: Record<string, number> = {};
  for (const s of sport.dna.stats) {
    const max = s.max ?? 100;
    dna[s.key] = Number((max * (0.45 + r.next() * 0.55)).toFixed(s.format === "int" ? 0 : 2));
  }
  return {
    slug: `${slugify(name)}-${team.abbr.toLowerCase()}-${idx}`,
    name,
    sport: team.sport,
    team: team.slug,
    position,
    number: r.int(1, 45),
    age: r.int(19, 35),
    heightCm: r.int(170, 213),
    weightKg: r.int(64, 118),
    nationality: r.pick(NATIONS),
    foot: team.sport === "soccer" ? (r.bool(0.72) ? "Right" : "Left") : undefined,
    bio: `${name} is a ${position} for ${team.name}, in his ${r.int(2, 9)}${"th"} season of senior competition. Signed from a ${r.pick(["domestic rival", "continental club", "youth academy", "college program", "development league"])}, he has become a fixture of the ${sport.name.toLowerCase()} side's rotation.`,
    seasons,
    stats: current,
    dna,
  };
}

const rosterCache = new Map<string, Player[]>();

export function rosterFor(teamSlug: string): Player[] {
  const cached = rosterCache.get(teamSlug);
  if (cached) return cached;
  const team = TEAM_MAP.get(teamSlug);
  if (!team) return [];
  const sport = SPORT_MAP[team.sport]!;
  const size = sport.phase === 1 ? (team.sport === "soccer" ? 22 : 14) : sport.phase === 2 ? 12 : 8;
  const players = Array.from({ length: size }, (_, i) => buildPlayer(team, i));
  rosterCache.set(teamSlug, players);
  return players;
}

const playerIndexCache = new Map<string, Player>();
function buildPlayerIndex() {
  if (playerIndexCache.size) return playerIndexCache;
  for (const team of TEAMS) for (const p of rosterFor(team.slug)) playerIndexCache.set(p.slug, p);
  return playerIndexCache;
}

export const getPlayer = (slug?: string) => (slug ? buildPlayerIndex().get(slug) : undefined);
export const allPlayers = () => Array.from(buildPlayerIndex().values());
export const playersForSport = (sport: string) => allPlayers().filter((p) => p.sport === sport);
export const playersForLeague = (league: string) => {
  const slugs = new Set(teamsForLeague(league).map((t) => t.slug));
  return allPlayers().filter((p) => slugs.has(p.team));
};

export function similarPlayers(player: Player, limit = 5) {
  return allPlayers()
    .filter((p) => p.slug !== player.slug && p.sport === player.sport && p.position === player.position)
    .slice(0, limit);
}

/* --------------------------------------------------------------- standings */

const standingsCache = new Map<string, StandingRow[]>();

export function standingsFor(leagueSlug: string): StandingRow[] {
  const cached = standingsCache.get(leagueSlug);
  if (cached) return cached;
  const league = LEAGUE_MAP.get(leagueSlug);
  if (!league) return [];
  const sport = SPORT_MAP[league.sport]!;
  const rows: StandingRow[] = teamsForLeague(leagueSlug).map((team, i) => {
    const r = makeRandom(`${leagueSlug}-standing-${team.slug}`);
    const strength = 1 - i / (league.teamSlugs.length + 2);
    const values: Record<string, number> = {};
    if (league.sport === "soccer") {
      const pl = 24;
      const w = Math.round(pl * (0.2 + strength * 0.6));
      const d = r.int(1, Math.max(2, pl - w - 1));
      const l = pl - w - d;
      const gf = Math.round(w * 2.1 + d * 1.1 + r.int(0, 9));
      const ga = Math.round(l * 1.9 + d * 1.0 + r.int(0, 9));
      Object.assign(values, { pl, w, d, l, gf, ga, gd: gf - ga, pts: w * 3 + d });
    } else if (league.sport === "basketball") {
      const gp = 52;
      const w = Math.round(gp * (0.25 + strength * 0.55));
      const l = gp - w;
      const ppg = Number((105 + strength * 15 + r.float(-3, 3)).toFixed(1));
      const oppg = Number((104 + (1 - strength) * 12 + r.float(-3, 3)).toFixed(1));
      Object.assign(values, {
        gp, w, l,
        pctw: Number(((w / gp) * 100).toFixed(1)),
        ppg, oppg,
        diff: Number((ppg - oppg).toFixed(1)),
        streak: r.int(1, 7),
      });
    } else if (league.sport === "hockey") {
      const gp = 58;
      const w = Math.round(gp * (0.3 + strength * 0.45));
      const otl = r.int(2, 9);
      const l = gp - w - otl;
      Object.assign(values, {
        gp, w, l, otl,
        gf: Math.round(w * 3.2 + r.int(0, 20)),
        ga: Math.round(l * 3.1 + r.int(0, 20)),
        pts: w * 2 + otl,
      });
    } else if (league.sport === "baseball") {
      const w = Math.round(120 * (0.35 + strength * 0.35));
      const l = 120 - w;
      const rs = Math.round(520 * (0.8 + strength * 0.4));
      const ra = Math.round(520 * (1.15 - strength * 0.35));
      Object.assign(values, {
        w, l, pctw: Number(((w / 120) * 100).toFixed(1)),
        gb: Number((i * 2.5).toFixed(1)), rs, ra, diff: rs - ra,
      });
    } else if (league.sport === "american-football") {
      const w = Math.round(15 * (0.3 + strength * 0.55));
      const tt = r.int(0, 1);
      const l = 15 - w - tt;
      const pf = Math.round(24 * 15 * (0.75 + strength * 0.4));
      const pa = Math.round(24 * 15 * (1.1 - strength * 0.35));
      Object.assign(values, { w, l, t: tt, pctw: Number(((w / 15) * 100).toFixed(1)), pf, pa, diff: pf - pa });
    } else if (league.sport === "cricket") {
      const pl = 14;
      const w = Math.round(pl * (0.3 + strength * 0.45));
      const nr = r.int(0, 1);
      const l = pl - w - nr;
      Object.assign(values, { pl, w, l, nr, nrr: Number((strength * 1.4 - 0.6).toFixed(2)), pts: w * 2 + nr });
    } else {
      for (const c of sport.standings) values[c.key] = statValue(c.key, r, 2);
      values["rank"] = i + 1;
    }
    const form = Array.from({ length: 5 }, () => {
      const v = r.next();
      if (v < 0.15 + (1 - strength) * 0.35) return "L" as const;
      if (sport.hasDraw && v < 0.42) return "D" as const;
      return "W" as const;
    });
    return { team: team.slug, values, form };
  });
  const sortKey = sport.standings.find((s) => s.key === "pts")
    ? "pts"
    : sport.standings.find((s) => s.key === "pctw")
      ? "pctw"
      : sport.standings[sport.standings.length - 1]!.key;
  rows.sort((a, b) => (b.values[sortKey] ?? 0) - (a.values[sortKey] ?? 0));
  standingsCache.set(leagueSlug, rows);
  return rows;
}

export function formFor(teamSlug: string) {
  const team = TEAM_MAP.get(teamSlug);
  if (!team) return [];
  return standingsFor(team.league).find((r) => r.team === teamSlug)?.form ?? [];
}

/* ----------------------------------------------------------------- matches */

const EVENT_NAMES_CACHE = new Map<string, string[]>();
function nameSample(teamSlug: string) {
  let n = EVENT_NAMES_CACHE.get(teamSlug);
  if (!n) {
    n = rosterFor(teamSlug).map((p) => p.name);
    EVENT_NAMES_CACHE.set(teamSlug, n);
  }
  return n;
}

function buildLineup(teamSlug: string): LineupSlot[] {
  const roster = rosterFor(teamSlug);
  const r = makeRandom(`${teamSlug}-lineup`);
  return roster.slice(0, Math.min(roster.length, 16)).map((p, i) => ({
    number: p.number,
    name: p.name,
    position: p.position,
    rating: r.float(5.9, 9.1, 1),
    starter: i < (p.sport === "soccer" ? 11 : 5),
  }));
}

function buildMatch(league: League, home: Team, away: Team, index: number, dayOffset: number): Match {
  const r = makeRandom(`${league.slug}-${home.slug}-${away.slug}-${index}`);
  const sport = SPORT_MAP[league.sport]!;
  const now = new Date();
  const kick = new Date(now);
  kick.setDate(now.getDate() + dayOffset);
  kick.setHours(12 + (index % 9), (index % 4) * 15, 0, 0);

  let status: Match["status"] = "upcoming";
  if (dayOffset < 0) status = "final";
  else if (dayOffset === 0) status = index % 3 === 0 ? "live" : index % 3 === 1 ? "final" : "upcoming";

  const scoreScale =
    league.sport === "basketball" ? 1 : league.sport === "american-football" ? 0.5 : league.sport === "cricket" ? 8 : 0.16;
  const base = league.sport === "basketball" ? r.int(88, 128) : league.sport === "cricket" ? r.int(140, 215) : r.int(0, 4);
  const base2 = league.sport === "basketball" ? r.int(88, 128) : league.sport === "cricket" ? r.int(140, 215) : r.int(0, 4);
  const maxMinute = league.sport === "basketball" ? 48 : league.sport === "hockey" ? 60 : 90;
  const minute = status === "live" ? r.int(6, maxMinute - 4) : status === "final" ? maxMinute : 0;
  const progress = status === "final" ? 1 : status === "live" ? minute / maxMinute : 0;

  const homeScore = Math.round(base * progress);
  const awayScore = Math.round(base2 * progress);

  const events: MatchEvent[] = [];
  if (league.sport === "soccer") {
    const total = homeScore + awayScore;
    const homeNames = nameSample(home.slug);
    const awayNames = nameSample(away.slug);
    for (let i = 0; i < total; i++) {
      const side = i < homeScore ? "home" : "away";
      events.push({
        minute: r.int(3, Math.max(6, minute || 90)),
        type: r.bool(0.12) ? "penalty" : "goal",
        side,
        player: r.pick(side === "home" ? homeNames : awayNames),
        detail: r.bool(0.55) ? `Assist ${r.pick(side === "home" ? homeNames : awayNames)}` : undefined,
      });
    }
    const cards = r.int(1, 5);
    for (let i = 0; i < cards; i++) {
      const side = r.bool() ? "home" : "away";
      events.push({
        minute: r.int(10, Math.max(12, minute || 90)),
        type: r.bool(0.9) ? "yellow" : "red",
        side,
        player: r.pick(side === "home" ? homeNames : awayNames),
        detail: r.pick(["Foul", "Dissent", "Tactical foul", "Time wasting"]),
      });
    }
    const subs = r.int(2, 5);
    for (let i = 0; i < subs; i++) {
      const side = r.bool() ? "home" : "away";
      const names = side === "home" ? homeNames : awayNames;
      events.push({
        minute: r.int(46, Math.max(50, minute || 90)),
        type: "sub",
        side,
        player: r.pick(names),
        detail: `for ${r.pick(names)}`,
      });
    }
    events.push({ minute: 45, type: "period", side: "home", player: "Half time", detail: "HT" });
  } else {
    const periods = league.sport === "basketball" ? 4 : 3;
    for (let q = 1; q <= periods; q++) {
      events.push({
        minute: Math.round((maxMinute / periods) * q),
        type: "period",
        side: "home",
        player: `End of ${league.sport === "basketball" ? "Q" : "P"}${q}`,
        detail: `${Math.round(homeScore * (q / periods))} – ${Math.round(awayScore * (q / periods))}`,
      });
    }
  }
  events.sort((a, b) => a.minute - b.minute);

  const stats =
    league.sport === "basketball"
      ? [
          { key: "fg", label: "Field goal %", home: r.float(42, 55, 1), away: r.float(42, 55, 1), pct: true },
          { key: "tp", label: "3-point %", home: r.float(28, 45, 1), away: r.float(28, 45, 1), pct: true },
          { key: "reb", label: "Rebounds", home: r.int(32, 55), away: r.int(32, 55) },
          { key: "ast", label: "Assists", home: r.int(16, 34), away: r.int(16, 34) },
          { key: "tov", label: "Turnovers", home: r.int(7, 19), away: r.int(7, 19) },
        ]
      : [
          { key: "pos", label: "Possession", home: r.int(38, 62), away: 0, pct: true },
          { key: "shots", label: "Shots", home: r.int(5, 22), away: r.int(5, 22) },
          { key: "sot", label: "Shots on target", home: r.int(1, 9), away: r.int(1, 9) },
          { key: "xg", label: "Expected goals", home: r.float(0.2, 3.1, 2), away: r.float(0.2, 3.1, 2) },
          { key: "corners", label: "Corners", home: r.int(1, 11), away: r.int(1, 11) },
          { key: "fouls", label: "Fouls", home: r.int(4, 17), away: r.int(4, 17) },
        ];
  if (stats[0]?.key === "pos") stats[0].away = 100 - (stats[0].home as number);

  return {
    id: `${league.slug}-${home.abbr}-${away.abbr}-${index}`.toLowerCase(),
    sport: league.sport,
    league: league.slug,
    home: home.slug,
    away: away.slug,
    homeScore,
    awayScore,
    status,
    minute,
    period:
      status === "final"
        ? "FT"
        : status === "live"
          ? league.sport === "basketball"
            ? `Q${Math.min(4, Math.ceil(minute / 12))}`
            : `${minute}'`
          : kick.toISOString(),
    kickoff: kick.toISOString(),
    venue: home.stadium,
    attendance: status !== "upcoming" ? Math.round(home.capacity * (0.72 + r.next() * 0.27)) : undefined,
    events,
    stats,
    lineups: { home: buildLineup(home.slug), away: buildLineup(away.slug) },
  };
}

let matchCache: Match[] | null = null;

export function allMatches(): Match[] {
  if (matchCache) return matchCache;
  const out: Match[] = [];
  for (const league of LEAGUES) {
    const teams = teamsForLeague(league.slug);
    const sport = SPORT_MAP[league.sport]!;
    const rounds = sport.phase === 1 ? 3 : sport.phase === 2 ? 2 : 1;
    for (let round = 0; round < rounds; round++) {
      const dayOffset = round - 1;
      for (let i = 0; i + 1 < teams.length; i += 2) {
        const h = teams[(i + round) % teams.length]!;
        const a = teams[(i + 1 + round * 2) % teams.length]!;
        if (h.slug === a.slug) continue;
        out.push(buildMatch(league, h, a, round * 100 + i, dayOffset));
      }
    }
  }
  matchCache = out;
  return out;
}

export const getMatch = (id?: string) => (id ? allMatches().find((m) => m.id === id) : undefined);
export const liveMatches = () => allMatches().filter((m) => m.status === "live");
export const matchesForSport = (sport: string) => allMatches().filter((m) => m.sport === sport);
export const matchesForLeague = (league: string) => allMatches().filter((m) => m.league === league);
export const matchesForTeam = (team: string) =>
  allMatches().filter((m) => m.home === team || m.away === team);

export function headToHead(a: string, b: string) {
  const r = makeRandom(`h2h-${a}-${b}`);
  const played = r.int(8, 42);
  const aWins = r.int(2, played - 3);
  const draws = r.int(0, played - aWins);
  return { played, aWins, draws, bWins: played - aWins - draws };
}

/* ------------------------------------------------------------------ leaders */

export interface LeaderRow {
  player: Player;
  value: number;
}

export function leadersFor(sport: string, key: string, opts?: { league?: string; limit?: number }) {
  const pool = opts?.league ? playersForLeague(opts.league) : playersForSport(sport);
  const def = SPORT_MAP[sport]?.leaders.find((l) => l.key === key);
  const higher = def?.higherBetter !== false;
  const rows = pool
    .map((p) => ({ player: p, value: p.stats[key] ?? p.dna[key] ?? 0 }))
    .filter((r) => r.value !== 0)
    .sort((x, y) => (higher ? y.value - x.value : x.value - y.value));
  return rows.slice(0, opts?.limit ?? 10);
}

/* ------------------------------------------------------------ team metrics */

export function teamMetrics(teamSlug: string): Record<string, number> {
  const team = TEAM_MAP.get(teamSlug);
  if (!team) return {};
  const sport = SPORT_MAP[team.sport]!;
  const r = makeRandom(`${teamSlug}-metrics`);
  const out: Record<string, number> = {};
  for (const s of sport.teamStats) {
    const max = s.max ?? 100;
    const dp = s.format === "dec2" ? 2 : s.format === "int" ? 0 : 1;
    out[s.key] = Number((max * (0.5 + r.next() * 0.5)).toFixed(dp));
  }
  return out;
}

/* ---------------------------------------------------------------- trending */

export function trending() {
  const players = [...playersForSport("soccer").slice(0, 3), ...playersForSport("basketball").slice(0, 3)];
  const teams = [TEAMS[0]!, TEAMS[20]!, TEAMS[40]!, TEAMS[64]!];
  return { players, teams };
}

/* ------------------------------------------------------------------ search */

export type SearchHit =
  | { type: "team"; slug: string; title: string; subtitle: string; sport: string }
  | { type: "player"; slug: string; title: string; subtitle: string; sport: string }
  | { type: "league"; slug: string; title: string; subtitle: string; sport: string }
  | { type: "match"; slug: string; title: string; subtitle: string; sport: string };

export function search(q: string): SearchHit[] {
  const query = q.trim().toLowerCase();
  if (query.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const l of LEAGUES) {
    if (l.name.toLowerCase().includes(query))
      hits.push({ type: "league", slug: l.slug, title: l.name, subtitle: `${l.country} · ${l.season}`, sport: l.sport });
  }
  for (const t of TEAMS) {
    if (t.name.toLowerCase().includes(query) || t.abbr.toLowerCase() === query)
      hits.push({
        type: "team",
        slug: t.slug,
        title: t.name,
        subtitle: `${getLeague(t.league)?.name} · ${t.city}`,
        sport: t.sport,
      });
  }
  for (const p of allPlayers()) {
    if (p.name.toLowerCase().includes(query))
      hits.push({
        type: "player",
        slug: p.slug,
        title: p.name,
        subtitle: `${p.position} · ${getTeam(p.team)?.name}`,
        sport: p.sport,
      });
    if (hits.length > 220) break;
  }
  for (const m of allMatches()) {
    const h = getTeam(m.home)!,
      a = getTeam(m.away)!;
    if (h.name.toLowerCase().includes(query) || a.name.toLowerCase().includes(query))
      hits.push({
        type: "match",
        slug: m.id,
        title: `${h.shortName} v ${a.shortName}`,
        subtitle: `${getLeague(m.league)?.name} · ${m.status === "final" ? "Full time" : m.status === "live" ? "Live" : "Upcoming"}`,
        sport: m.sport,
      });
    if (hits.length > 300) break;
  }
  return hits;
}

/* ---------------------------------------------------------------- formatting */

export function fmt(value: number | undefined, format?: string) {
  if (value === undefined || value === null || Number.isNaN(value)) return "–";
  switch (format) {
    case "dec1":
      return value.toFixed(1);
    case "dec2":
      return value.toFixed(2);
    case "pct":
      return `${value.toFixed(1)}%`;
    case "plusminus":
      return value > 0 ? `+${value}` : `${value}`;
    default:
      return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
}