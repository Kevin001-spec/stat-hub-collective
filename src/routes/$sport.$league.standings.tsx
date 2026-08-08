import { createFileRoute, notFound } from "@tanstack/react-router";
import { getLeague, getSport } from "@/data";
import { StandingsTable } from "@/components/sv/StandingsTable";
import { Breadcrumbs } from "@/components/sv/primitives";

export const Route = createFileRoute("/$sport/$league/standings")({
  loader: ({ params }) => {
    const league = getLeague(params.league);
    if (!league) throw notFound();
    return { name: league.name, season: league.season };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "League";
    const title = `${name} Table ${loaderData?.season ?? ""} | ScoreVault`.replace(/\s+\|/, " |");
    const description = `Complete ${name} standings with points, goal difference and recent form for every club.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: StandingsPage,
});

function StandingsPage() {
  const { sport, league: leagueSlug } = Route.useParams();
  const league = getLeague(leagueSlug)!;
  const cfg = getSport(sport)!;
  return (
    <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-6">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: cfg.name, to: "/$sport", params: { sport } },
          { label: league.shortName, to: "/$sport/$league", params: { sport, league: leagueSlug } },
          { label: "Standings" },
        ]}
      />
      <header>
        <h1 className="text-2xl font-bold">{league.name} table</h1>
        <p className="mt-1 text-sm text-muted-foreground">Season {league.season}</p>
      </header>
      <StandingsTable league={leagueSlug} sport={sport} />
    </div>
  );
}