import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPlayer, getSport, getTeam, similarPlayers, fmt } from "@/data";
import { Crest } from "@/components/sv/Crest";
import { Section, Panel, Breadcrumbs, StatTile } from "@/components/sv/primitives";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/$sport/player/$slug")({
  loader: ({ params }) => {
    const player = getPlayer(params.slug);
    if (!player) throw notFound();
    return { name: player.name, position: player.position, team: getTeam(player.team)?.name ?? "" };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Player";
    const title = `${name} — Career Stats & Profile | ScoreVault`;
    const description = `${name}, ${loaderData?.position ?? "player"} for ${loaderData?.team ?? "club"}: season-by-season statistics and advanced metrics.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PlayerPage,
});

function PlayerPage() {
  const { sport, slug } = Route.useParams();
  const player = getPlayer(slug)!;
  const cfg = getSport(sport)!;
  const team = getTeam(player.team);
  const { isFavorite, toggleFavorite } = useStore();
  const following = isFavorite(slug);

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: cfg.name, to: "/$sport", params: { sport } },
          { label: team?.shortName ?? "Team", to: "/$sport/team/$slug", params: { sport, slug: player.team } },
          { label: player.name },
        ]}
      />

      <header className="flex flex-wrap items-center gap-5 rounded-2xl border border-border bg-surface p-6">
        <Crest team={player.team} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold sm:text-3xl">{player.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            #{player.number} · {player.position} · {team?.name} · {player.nationality} · {player.age} yrs ·{" "}
            {player.heightCm} cm / {player.weightKg} kg
          </p>
        </div>
        <button
          onClick={() => toggleFavorite({ kind: "player", slug, sport, label: player.name })}
          className={
            following
              ? "rounded-lg border border-primary bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
              : "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          }
        >
          {following ? "Following" : "Follow"}
        </button>
      </header>

      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{player.bio}</p>

      <Section title={cfg.dna.title} subtitle={cfg.dna.blurb}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cfg.dna.stats.map((s) => (
            <StatTile key={s.key} label={s.label} value={fmt(player.dna[s.key], s.format)} hint={s.desc ?? ""} />
          ))}
        </div>
      </Section>

      <Section title="Season by season">
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-[0.07em] text-muted-foreground">
                <th className="px-3 py-2.5 text-left font-medium">Season</th>
                <th className="px-3 py-2.5 text-left font-medium">Team</th>
                {cfg.playerSeason.map((c) => (
                  <th key={c.key} className="px-2 py-2.5 text-right font-medium">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {player.seasons.map((s) => (
                <tr key={s.season} className="border-b border-border/60 last:border-0 hover:bg-surface-2">
                  <td className="stat-num px-3 py-2.5">{s.season}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{s.team}</td>
                  {cfg.playerSeason.map((c) => (
                    <td key={c.key} className="stat-num px-2 py-2.5 text-right">
                      {fmt(s.values[c.key], c.format)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Similar players">
        <Panel className="hairline-y">
          {similarPlayers(player).map((p) => (
            <Link
              key={p.slug}
              to="/$sport/player/$slug"
              params={{ sport, slug: p.slug }}
              className="flex items-center gap-3 p-3.5 transition-colors hover:bg-surface-2"
            >
              <Crest team={p.team} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">
                  {p.position} · {getTeam(p.team)?.shortName}
                </div>
              </div>
            </Link>
          ))}
        </Panel>
      </Section>
    </div>
  );
}