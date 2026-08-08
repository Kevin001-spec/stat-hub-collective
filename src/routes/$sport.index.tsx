import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getSport, leaguesForSport, matchesForSport, leadersFor, teamsForSport, fmt, PHASE_LABEL } from "@/data";
import { MatchCard } from "@/components/sv/MatchCard";
import { Crest } from "@/components/sv/Crest";
import { Section, Panel, Chip, Breadcrumbs, EmptyState, StatTile } from "@/components/sv/primitives";

export const Route = createFileRoute("/$sport/")({
  loader: ({ params }) => {
    const sport = getSport(params.sport);
    if (!sport) throw notFound();
    return { name: sport.name, tagline: sport.tagline };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Sport";
    const title = `${name} — Scores, Standings & Stats | ScoreVault`;
    const description = loaderData?.tagline
      ? `${loaderData.tagline} Fixtures, standings, team and player statistics for ${name.toLowerCase()}.`
      : "Sport hub on ScoreVault.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: SportHub,
});

function SportHub() {
  const { sport: slug } = Route.useParams();
  const sport = getSport(slug)!;
  const leagues = leaguesForSport(slug);
  const matches = matchesForSport(slug);
  const teams = teamsForSport(slug);
  const leaderKey = sport.leaders[0]?.key;
  const leaders = leaderKey ? leadersFor(slug, leaderKey, { limit: 5 }) : [];

  return (
    <div className="mx-auto max-w-[1400px] space-y-10 px-4 py-6">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: sport.name }]} />

      <header className="flex flex-wrap items-center gap-4">
        <span className="text-4xl">{sport.emoji}</span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">{sport.name}</h1>
          <p className="text-sm text-muted-foreground">{sport.tagline}</p>
        </div>
        <Chip tone="outline">{PHASE_LABEL[sport.phase]}</Chip>
      </header>

      {!sport.enabled ? (
        <EmptyState
          title="Data source catching up"
          body={`${sport.name} coverage is being ingested. Standings and profiles arrive in a later rollout phase.`}
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Competitions" value={String(leagues.length)} />
            <StatTile label="Teams tracked" value={String(teams.length)} />
            <StatTile label="Fixtures logged" value={String(matches.length)} />
            <StatTile label="Clock" value={sport.clockLabel} hint={sport.matchNoun} />
          </div>

          <Section title="Competitions">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {leagues.map((l) => (
                <Link
                  key={l.slug}
                  to="/$sport/$league"
                  params={{ sport: slug, league: l.slug }}
                  className="rounded-xl border border-border bg-surface p-4 transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="text-sm font-semibold">{l.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {l.country} · Tier {l.tier} · {l.season}
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          <Section
            title={`Latest ${sport.matchNoun.toLowerCase()}s`}
            action={
              <Link to="/live" className="text-sm font-medium text-primary hover:underline">
                All scores
              </Link>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {matches.slice(0, 8).map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </Section>

          <div className="grid gap-6 lg:grid-cols-2">
            <Section
              title={sport.leaders[0]?.label ?? "Leaders"}
              action={
                <Link
                  to="/$sport/stats"
                  params={{ sport: slug }}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  All leaderboards
                </Link>
              }
            >
              <Panel className="hairline-y">
                {leaders.map((row, i) => (
                  <Link
                    key={row.player.slug}
                    to="/$sport/player/$slug"
                    params={{ sport: slug, slug: row.player.slug }}
                    className="flex items-center gap-3 p-3.5 transition-colors hover:bg-surface-2"
                  >
                    <span className="stat-num w-5 text-xs text-muted-foreground">{i + 1}</span>
                    <Crest team={row.player.team} size="sm" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{row.player.name}</span>
                    <span className="stat-num text-sm font-semibold">{fmt(row.value, sport.leaders[0]?.format)}</span>
                  </Link>
                ))}
              </Panel>
            </Section>

            <Section title={sport.dna.title} subtitle={sport.dna.blurb}>
              <div className="grid gap-3 sm:grid-cols-2">
                {sport.dna.stats.map((s) => (
                  <div key={s.key} className="rounded-lg border border-border bg-surface p-4">
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{s.desc ?? "Signature metric"}</div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </>
      )}
    </div>
  );
}