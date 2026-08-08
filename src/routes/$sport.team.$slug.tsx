import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getTeam, getSport, getLeague, rosterFor, formFor, matchesForTeam, teamMetrics, fmt } from "@/data";
import { Crest } from "@/components/sv/Crest";
import { MatchCard } from "@/components/sv/MatchCard";
import { Section, Panel, Breadcrumbs, FormStrip, StatTile } from "@/components/sv/primitives";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/$sport/team/$slug")({
  loader: ({ params }) => {
    const team = getTeam(params.slug);
    if (!team) throw notFound();
    return { name: team.name, city: team.city, stadium: team.stadium };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Team";
    const title = `${name} — Squad, Fixtures & Stats | ScoreVault`;
    const description = `${name} of ${loaderData?.city ?? ""}: full squad, form, fixtures, results and advanced team metrics.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: TeamPage,
});

function TeamPage() {
  const { sport, slug } = Route.useParams();
  const team = getTeam(slug)!;
  const cfg = getSport(sport)!;
  const league = getLeague(team.league);
  const roster = rosterFor(slug);
  const matches = matchesForTeam(slug);
  const metrics = teamMetrics(slug);
  const { isFavorite, toggleFavorite } = useStore();
  const following = isFavorite(slug);

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: cfg.name, to: "/$sport", params: { sport } },
          { label: league?.shortName ?? "League", to: "/$sport/$league", params: { sport, league: team.league } },
          { label: team.shortName },
        ]}
      />

      <header className="flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-surface p-6">
        <Crest team={slug} size="xl" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold sm:text-3xl">{team.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Founded {team.founded} · {team.stadium} ({team.capacity.toLocaleString()}) · {team.coach}
          </p>
          <div className="mt-3">
            <FormStrip form={formFor(slug)} />
          </div>
        </div>
        <button
          onClick={() => toggleFavorite({ kind: "team", slug, sport, label: team.name })}
          className={
            following
              ? "rounded-lg border border-primary bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
              : "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          }
        >
          {following ? "Following" : "Follow"}
        </button>
      </header>

      <Section title={`${cfg.dna.title} — team profile`} subtitle={cfg.dna.blurb}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cfg.teamStats.map((s) => (
            <StatTile key={s.key} label={s.label} value={fmt(metrics[s.key], s.format)} />
          ))}
        </div>
      </Section>

      <Section title="Fixtures & results">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {matches.slice(0, 8).map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </Section>

      <Section title="Squad" subtitle={`${roster.length} players`}>
        <Panel className="hairline-y">
          {roster.map((p) => (
            <Link
              key={p.slug}
              to="/$sport/player/$slug"
              params={{ sport, slug: p.slug }}
              className="flex items-center gap-3 p-3.5 transition-colors hover:bg-surface-2"
            >
              <span className="stat-num w-7 text-xs text-muted-foreground">{p.number}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">
                  {p.position} · {p.nationality} · {p.age}
                </div>
              </div>
              <span className="stat-num text-xs text-muted-foreground">{p.heightCm} cm</span>
            </Link>
          ))}
        </Panel>
      </Section>
    </div>
  );
}