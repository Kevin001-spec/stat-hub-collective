import { Link } from "@tanstack/react-router";
import { getTeam, getLeague, type Match } from "@/data";
import { Crest } from "./Crest";
import { LiveBadge } from "./primitives";
import { cn } from "@/lib/utils";

export function kickoffLabel(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function MatchCard({ match, className }: { match: Match; className?: string }) {
  const h = getTeam(match.home);
  const a = getTeam(match.away);
  const league = getLeague(match.league);
  if (!h || !a) return null;
  const winner =
    match.status !== "upcoming"
      ? match.homeScore > match.awayScore
        ? "home"
        : match.awayScore > match.homeScore
          ? "away"
          : null
      : null;

  return (
    <Link
      to="/$sport/match/$matchId"
      params={{ sport: match.sport, matchId: match.id }}
      className={cn(
        "group block rounded-xl border border-border bg-surface p-4 transition-all hover:border-primary/40 hover:shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="truncate font-medium uppercase tracking-[0.08em]">{league?.shortName}</span>
        {match.status === "live" ? (
          <LiveBadge label={match.period} />
        ) : (
          <span className="stat-num">{match.status === "final" ? "FT" : kickoffLabel(match.kickoff)}</span>
        )}
      </div>
      <div className="mt-3 space-y-2">
        {(
          [
            { team: h, score: match.homeScore, side: "home" },
            { team: a, score: match.awayScore, side: "away" },
          ] as const
        ).map((row) => (
          <div key={row.side} className="flex items-center gap-2.5">
            <Crest team={row.team.slug} size="sm" />
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-sm",
                winner === row.side ? "font-semibold text-foreground" : "text-foreground/80",
              )}
            >
              {row.team.shortName}
            </span>
            <span
              className={cn(
                "stat-num text-base",
                match.status === "upcoming" && "text-muted-foreground",
                winner === row.side && "font-bold",
              )}
            >
              {match.status === "upcoming" ? "–" : row.score}
            </span>
          </div>
        ))}
      </div>
    </Link>
  );
}