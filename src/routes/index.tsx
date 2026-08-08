import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, TrendingUp } from "lucide-react";
import {
  SPORTS,
  liveMatches,
  allMatches,
  trending,
  leadersFor,
  getTeam,
  fmt,
  PHASE_LABEL,
} from "@/data";
import { MatchCard } from "@/components/sv/MatchCard";
import { Crest } from "@/components/sv/Crest";
import { Section, Panel, Chip, EmptyState } from "@/components/sv/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScoreVault — Live Scores, Stats & Sports Reference" },
      {
        name: "description",
        content:
          "Live scores, standings, player statistics and permanent reference pages across soccer, basketball and more.",
      },
      { property: "og:title", content: "ScoreVault — Live Scores, Stats & Sports Reference" },
      {
        property: "og:description",
        content: "Reference-grade sports statistics: teams, players, leagues and matches.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const live = liveMatches().slice(0, 6);
  const upcoming = allMatches().filter((m) => m.status === "upcoming").slice(0, 6);
  const trend = trending();
  const scorers = leadersFor("soccer", "goals", { limit: 5 });

  return (
    <div className="mx-auto max-w-[1400px] space-y-12 px-4 py-8">
      <section className="animate-rise overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-10">
        <Chip tone="accent">Reference-grade data</Chip>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-[1.1] sm:text-5xl">
          Every score, every stat, every season — one permanent record.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          ScoreVault keeps the numbers that matter: live scorelines, deep team and player profiles, and
          sport-specific advanced metrics built for people who actually read the table.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/live"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Live scores <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/$sport"
            params={{ sport: "soccer" }}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-2"
          >
            Browse soccer
          </Link>
        </div>
      </section>

      <Section
        title="In play now"
        subtitle="Scores update as the clock advances."
        action={
          <Link to="/live" className="text-sm font-medium text-primary hover:underline">
            All live
          </Link>
        }
      >
        {live.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : (
          <EmptyState title="No matches in play" body="Check back closer to kickoff — the ticker will wake up." />
        )}
      </Section>

      <Section title="Coming up" subtitle="Next fixtures across followed competitions.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Section title="Trending teams">
          <Panel className="hairline-y">
            {trend.teams.map((t) => (
              <Link
                key={t.slug}
                to="/$sport/team/$slug"
                params={{ sport: t.sport, slug: t.slug }}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-surface-2"
              >
                <Crest team={t.slug} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{t.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {t.city} · {t.stadium}
                  </div>
                </div>
                <TrendingUp className="size-4 text-primary" />
              </Link>
            ))}
          </Panel>
        </Section>

        <Section title="Top scorers" subtitle="Soccer · current season">
          <Panel className="hairline-y">
            {scorers.map((row, i) => (
              <Link
                key={row.player.slug}
                to="/$sport/player/$slug"
                params={{ sport: row.player.sport, slug: row.player.slug }}
                className="flex items-center gap-3 p-3.5 transition-colors hover:bg-surface-2"
              >
                <span className="stat-num w-5 text-xs text-muted-foreground">{i + 1}</span>
                <Crest team={row.player.team} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{row.player.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {getTeam(row.player.team)?.shortName}
                  </div>
                </div>
                <span className="stat-num text-sm font-semibold">{fmt(row.value)}</span>
              </Link>
            ))}
          </Panel>
        </Section>
      </div>

      <Section title="All sports" subtitle="Coverage depth varies by rollout phase.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SPORTS.map((s) => (
            <Link
              key={s.slug}
              to="/$sport"
              params={{ sport: s.slug }}
              className="rounded-xl border border-border bg-surface p-4 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{s.emoji}</span>
                <Chip tone="outline">{PHASE_LABEL[s.phase]}</Chip>
              </div>
              <div className="mt-3 text-sm font-semibold">{s.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.tagline}</div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
