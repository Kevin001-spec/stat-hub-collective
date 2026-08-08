import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getLeague, getSport, matchesForLeague, teamsForLeague, leadersFor, fmt } from "@/data";
import { MatchCard } from "@/components/sv/MatchCard";
import { Crest } from "@/components/sv/Crest";
import { StandingsTable } from "@/components/sv/StandingsTable";
import { Section, Panel, Breadcrumbs } from "@/components/sv/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$sport/$league/")({
  loader: ({ params }) => {
    const league = getLeague(params.league);
    if (!league) throw notFound();
    return { name: league.name, country: league.country, season: league.season };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "League";
    const title = `${name} — Table, Fixtures & Results | ScoreVault`;
    const description = `${name} standings, fixtures, results and statistical leaders for the ${loaderData?.season ?? "current"} season.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: LeaguePage,
});

const TABS = ["Fixtures", "Results", "Teams"] as const;

function LeaguePage() {
  const { sport, league: leagueSlug } = Route.useParams();
  const league = getLeague(leagueSlug)!;
  const cfg = getSport(sport)!;
  const matches = matchesForLeague(leagueSlug);
  const teams = teamsForLeague(leagueSlug);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Fixtures");
  const leaderDef = cfg.leaders[0];
  const leaders = leaderDef ? leadersFor(sport, leaderDef.key, { league: leagueSlug, limit: 5 }) : [];

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: cfg.name, to: "/$sport", params: { sport } },
          { label: league.shortName },
        ]}
      />
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">{league.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {league.country} · Tier {league.tier} · Season {league.season} · {teams.length} clubs
        </p>
      </header>

      <Section
        title="Standings"
        action={
          <Link
            to="/$sport/$league/standings"
            params={{ sport, league: leagueSlug }}
            className="text-sm font-medium text-primary hover:underline"
          >
            Full table
          </Link>
        }
      >
        <StandingsTable league={leagueSlug} sport={sport} limit={6} />
      </Section>

      <Section title="Matches">
        <div className="mb-3 flex gap-1 rounded-lg border border-border bg-surface p-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-2",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "Teams" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {teams.map((t) => (
              <Link
                key={t.slug}
                to="/$sport/team/$slug"
                params={{ sport, slug: t.slug }}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 transition-all hover:border-primary/40"
              >
                <Crest team={t.slug} size="md" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{t.shortName}</div>
                  <div className="truncate text-xs text-muted-foreground">{t.city}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {matches
              .filter((m) => (tab === "Fixtures" ? m.status !== "final" : m.status === "final"))
              .map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
          </div>
        )}
      </Section>

      {leaderDef && (
        <Section title={`Competition leaders — ${leaderDef.label}`}>
          <Panel className="hairline-y">
            {leaders.map((row, i) => (
              <Link
                key={row.player.slug}
                to="/$sport/player/$slug"
                params={{ sport, slug: row.player.slug }}
                className="flex items-center gap-3 p-3.5 transition-colors hover:bg-surface-2"
              >
                <span className="stat-num w-5 text-xs text-muted-foreground">{i + 1}</span>
                <Crest team={row.player.team} size="sm" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{row.player.name}</span>
                <span className="stat-num text-sm font-semibold">{fmt(row.value, leaderDef.format)}</span>
              </Link>
            ))}
          </Panel>
        </Section>
      )}
    </div>
  );
}