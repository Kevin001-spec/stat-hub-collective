import { createFileRoute, Link } from "@tanstack/react-router";
import { allMatches } from "@/data";
import { MatchCard } from "@/components/sv/MatchCard";
import { Section, Panel, EmptyState } from "@/components/sv/primitives";
import { useStore, useHydrated } from "@/lib/store";

export const Route = createFileRoute("/following")({
  head: () => ({
    meta: [
      { title: "Following — ScoreVault" },
      { name: "description", content: "Your followed teams, players and leagues in one focused feed." },
      { property: "og:title", content: "Following — ScoreVault" },
      { property: "og:description", content: "A feed limited to the teams and players you follow." },
    ],
  }),
  component: FollowingPage,
});

function FollowingPage() {
  const { favorites } = useStore();
  const hydrated = useHydrated();
  const teamSlugs = new Set(favorites.filter((f) => f.kind === "team").map((f) => f.slug));
  const matches = allMatches().filter((m) => teamSlugs.has(m.home) || teamSlugs.has(m.away)).slice(0, 12);

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-8">
      <h1 className="text-2xl font-bold">Following</h1>
      {!hydrated ? null : favorites.length === 0 ? (
        <EmptyState
          title="You're not following anything yet"
          body="Follow teams and players to build a personal feed of fixtures, results and alerts."
          action={
            <Link to="/welcome" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Pick teams to follow
            </Link>
          }
        />
      ) : (
        <>
          <Section title="Your follows">
            <Panel className="hairline-y">
              {favorites.map((f) => (
                <div key={f.slug} className="flex items-center justify-between p-3.5">
                  <div>
                    <div className="text-sm font-medium">{f.label}</div>
                    <div className="text-xs capitalize text-muted-foreground">
                      {f.kind} · {f.sport}
                    </div>
                  </div>
                  <Link to="/profile" className="text-xs font-medium text-primary hover:underline">
                    Manage
                  </Link>
                </div>
              ))}
            </Panel>
          </Section>
          <Section title="Fixtures & results">
            {matches.length ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            ) : (
              <EmptyState title="No scheduled matches" body="Nothing on the calendar for your follows right now." />
            )}
          </Section>
        </>
      )}
    </div>
  );
}