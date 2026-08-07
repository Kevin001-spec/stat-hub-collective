export type SportPhase = 1 | 2 | 3 | 4;

export type DnaModule =
  | "heatmap"
  | "transfers"
  | "lineupHistory"
  | "draft"
  | "usage"
  | "pitchTracking"
  | "minorLeague"
  | "combine"
  | "fantasy"
  | "ballByBall"
  | "t20"
  | "surfaceSplits"
  | "slamHistory"
  | "iceTime"
  | "penaltyKill";

export type StatFormat = "int" | "dec1" | "dec2" | "pct" | "time" | "plusminus";

export interface StatDef {
  key: string;
  label: string;
  desc?: string;
  format?: StatFormat;
  /** higher is better (default true) */
  higherBetter?: boolean;
  /** rough max used for radar/bar normalisation */
  max?: number;
}

export interface SportConfig {
  slug: string;
  name: string;
  phase: SportPhase;
  enabled: boolean;
  emoji: string;
  tagline: string;
  /** what a "match" is called */
  matchNoun: string;
  clockLabel: string;
  hasDraw: boolean;
  standings: StatDef[];
  playerSeason: StatDef[];
  teamStats: StatDef[];
  leaders: StatDef[];
  dna: {
    title: string;
    blurb: string;
    stats: StatDef[];
    modules: DnaModule[];
  };
  positions: string[];
}

export interface League {
  slug: string;
  name: string;
  shortName: string;
  sport: string;
  country: string;
  tier: number;
  season: string;
  teamSlugs: string[];
}

export interface Team {
  slug: string;
  name: string;
  shortName: string;
  abbr: string;
  sport: string;
  league: string;
  city: string;
  country: string;
  founded: number;
  stadium: string;
  capacity: number;
  colors: [string, string];
  coach: string;
}

export interface Player {
  slug: string;
  name: string;
  sport: string;
  team: string;
  position: string;
  number: number;
  age: number;
  heightCm: number;
  weightKg: number;
  nationality: string;
  foot?: string;
  bio: string;
  seasons: PlayerSeason[];
  stats: Record<string, number>;
  dna: Record<string, number>;
}

export interface PlayerSeason {
  season: string;
  team: string;
  league: string;
  values: Record<string, number>;
}

export type MatchStatus = "live" | "upcoming" | "final";

export interface MatchEvent {
  minute: number;
  type: "goal" | "own-goal" | "penalty" | "yellow" | "red" | "sub" | "assist" | "period" | "var";
  side: "home" | "away";
  player: string;
  detail?: string;
}

export interface Match {
  id: string;
  sport: string;
  league: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute: number;
  period: string;
  kickoff: string;
  venue: string;
  attendance?: number;
  events: MatchEvent[];
  stats: { key: string; label: string; home: number; away: number; pct?: boolean }[];
  lineups: { home: LineupSlot[]; away: LineupSlot[] };
}

export interface LineupSlot {
  number: number;
  name: string;
  position: string;
  rating: number;
  starter: boolean;
}

export interface StandingRow {
  team: string;
  values: Record<string, number>;
  form: ("W" | "D" | "L")[];
}