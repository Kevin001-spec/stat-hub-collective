import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getSport, leadersFor, leaguesForSport, getTeam, fmt } from "@/data";
import { Crest } from "@/components/sv/Crest";
import { Panel, Breadcrumbs, Section } from "@/components/sv/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$sport/stats")({
  loader: ({ params }) => {
    const sport = getSport(params.sport);
    if (!sport) throw notFound();
    return { name: sport.name };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Sport";
    const title = `${name} Statistics & Leaderboards | ScoreVault`;
    const description = `Season leaderboards for ${name.toLowerCase()} — scoring, creation and advanced metrics, filterable by competition.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: StatsPage,
});

function StatsPage() {
  const { sport: slug } = Route.useParams();
  const sport = getSport(slug)!;
  const leagues = leaguesForSport(slug);
  const [league, setLeague] = useState<string>("all");

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 px-4 py-6">
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: sport.name, to: "/$sport", params: { sport: slug } }, { label: "Stats" }]}
      />
      <Section title={`${sport.name} leaderboards`} subtitle="Season to date, all competitions unless filtered.">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {[{ slug: "all", shortName: "All competitions" }, ...leagues].map((l) => (
            <button
              key={l.slug}
              onClick={() => setLeague(l.slug)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                league === l.slug
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:bg-surface-2",
              )}
            >
              {l.shortName}
            </button>
          ))}
        </div>
      </Section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sport.leaders.map((def) => {
          const rows = leadersFor(slug, def.key, {
            limit: 8,
            ...(league !== "all" ? { league } : {}),
          });
          return (
            <section key={def.key} className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">{def.label}</h2>
              <Panel className="hairline-y">
                {rows.map((row, i) => (
                  <Link
                    key={row.player.slug}
                    to="/$sport/player/$slug"
                    params={{ sport: slug, slug: row.player.slug }}
                    className="flex items-center gap-3 p-3 transition-colors hover:bg-surface-2"
                  >
                    <span className="stat-num w-5 text-xs text-muted-foreground">{i + 1}</span>
                    <Crest team={row.player.team} size="xs" />
                    <span className="min-w-0 flex-1 truncate text-sm">{row.player.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{getTeam(row.player.team)?.abbr}</span>
                    <span className="stat-num text-sm font-semibold">{fmt(row.value, def.format)}</span>
                  </Link>
                ))}
                {rows.length === 0 && <div className="p-4 text-xs text-muted-foreground">No qualifying players.</div>}
              </Panel>
            </section>
          );
        })}
      </div>
    </div>
  );
}