import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getMatch, getTeam, getLeague, getSport, headToHead, fmt } from "@/data";
import { Crest } from "@/components/sv/Crest";
import { Section, Panel, Breadcrumbs, LiveBadge } from "@/components/sv/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$sport/match/$matchId")({
  loader: ({ params }) => {
    const match = getMatch(params.matchId);
    if (!match) throw notFound();
    return {
      home: getTeam(match.home)?.name ?? "",
      away: getTeam(match.away)?.name ?? "",
      league: getLeague(match.league)?.name ?? "",
    };
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.home} vs ${loaderData.away} — Live Score & Stats | ScoreVault`
      : "Match — ScoreVault";
    const description = loaderData
      ? `${loaderData.home} against ${loaderData.away} in the ${loaderData.league}: timeline, lineups, match statistics and head-to-head.`
      : "Match centre on ScoreVault.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: MatchPage,
});

const TABS = ["Timeline", "Stats", "Lineups", "Head-to-head"] as const;

const ICON: Record<string, string> = {
  goal: "⚽",
  penalty: "🅿",
  "own-goal": "⚽",
  yellow: "🟨",
  red: "🟥",
  sub: "🔁",
  period: "⏱",
  var: "📺",
  assist: "🅰",
};

function MatchPage() {
  const { sport, matchId } = Route.useParams();
  const match = getMatch(matchId)!;
  const cfg = getSport(sport)!;
  const home = getTeam(match.home)!;
  const away = getTeam(match.away)!;
  const league = getLeague(match.league);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Timeline");
  const h2h = headToHead(match.home, match.away);

  return (
    <div className="mx-auto max-w-[1000px] space-y-6 px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: cfg.name, to: "/$sport", params: { sport } },
          { label: league?.shortName ?? "League", to: "/$sport/$league", params: { sport, league: match.league } },
          { label: `${home.abbr} v ${away.abbr}` },
        ]}
      />

      <header className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>{league?.name}</span>
          {match.status === "live" ? <LiveBadge label={match.period} /> : <span>{match.status === "final" ? "Full time" : new Date(match.kickoff).toLocaleString()}</span>}
        </div>
        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link to="/$sport/team/$slug" params={{ sport, slug: home.slug }} className="flex flex-col items-center gap-2 text-center">
            <Crest team={home.slug} size="lg" />
            <span className="text-sm font-semibold">{home.shortName}</span>
          </Link>
          <div className="stat-num text-4xl font-bold sm:text-5xl">
            {match.status === "upcoming" ? "–" : `${match.homeScore}–${match.awayScore}`}
          </div>
          <Link to="/$sport/team/$slug" params={{ sport, slug: away.slug }} className="flex flex-col items-center gap-2 text-center">
            <Crest team={away.slug} size="lg" />
            <span className="text-sm font-semibold">{away.shortName}</span>
          </Link>
        </div>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          {match.venue}
          {match.attendance ? ` · ${match.attendance.toLocaleString()} attendance` : ""}
        </p>
      </header>

      <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-2",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Timeline" && (
        <Panel className="p-5">
          <ol className="relative space-y-4 border-l border-border pl-6">
            {match.events.map((e, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[31px] grid size-6 place-items-center rounded-full border border-border bg-background text-[11px]">
                  {ICON[e.type] ?? "•"}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="stat-num text-xs text-muted-foreground">{e.minute}'</span>
                  <span className="text-sm font-medium">{e.player}</span>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    {e.side === "home" ? home.abbr : away.abbr}
                  </span>
                </div>
                {e.detail && <div className="mt-0.5 text-xs text-muted-foreground">{e.detail}</div>}
              </li>
            ))}
          </ol>
        </Panel>
      )}

      {tab === "Stats" && (
        <Panel className="space-y-4 p-5">
          {match.stats.map((s) => {
            const total = s.home + s.away || 1;
            return (
              <div key={s.key}>
                <div className="flex items-center justify-between text-xs">
                  <span className="stat-num font-semibold">{fmt(s.home, s.pct ? "pct" : undefined)}</span>
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="stat-num font-semibold">{fmt(s.away, s.pct ? "pct" : undefined)}</span>
                </div>
                <div className="mt-1.5 flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-surface-2">
                  <div className="rounded-full bg-primary" style={{ width: `${(s.home / total) * 100}%` }} />
                  <div className="flex-1 rounded-full bg-muted-foreground/40" />
                </div>
              </div>
            );
          })}
        </Panel>
      )}

      {tab === "Lineups" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {([["home", home], ["away", away]] as const).map(([side, team]) => (
            <Section key={side} title={team.shortName}>
              <Panel className="hairline-y">
                {match.lineups[side].map((p) => (
                  <div key={`${p.number}-${p.name}`} className="flex items-center gap-3 p-3">
                    <span className="stat-num w-6 text-xs text-muted-foreground">{p.number}</span>
                    <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                    <span className="text-[11px] text-muted-foreground">{p.starter ? p.position : "Bench"}</span>
                    <span className="stat-num text-xs font-semibold">{p.rating.toFixed(1)}</span>
                  </div>
                ))}
              </Panel>
            </Section>
          ))}
        </div>
      )}

      {tab === "Head-to-head" && (
        <Panel className="grid grid-cols-3 gap-4 p-6 text-center">
          <div>
            <div className="stat-num text-3xl font-bold">{h2h.aWins}</div>
            <div className="mt-1 text-xs text-muted-foreground">{home.abbr} wins</div>
          </div>
          <div>
            <div className="stat-num text-3xl font-bold">{h2h.draws}</div>
            <div className="mt-1 text-xs text-muted-foreground">Draws</div>
          </div>
          <div>
            <div className="stat-num text-3xl font-bold">{h2h.bWins}</div>
            <div className="mt-1 text-xs text-muted-foreground">{away.abbr} wins</div>
          </div>
          <div className="col-span-3 text-xs text-muted-foreground">{h2h.played} meetings on record</div>
        </Panel>
      )}
    </div>
  );
}