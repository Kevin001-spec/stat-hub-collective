import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { search, type SearchHit } from "@/data";
import { Panel, EmptyState } from "@/components/sv/primitives";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — ScoreVault" },
      { name: "description", content: "Search teams, players, leagues and matches across every sport." },
      { property: "og:title", content: "Search — ScoreVault" },
      { property: "og:description", content: "Find any team, player, league or match instantly." },
    ],
  }),
  component: SearchPage,
});

const GROUPS: { type: SearchHit["type"]; label: string }[] = [
  { type: "team", label: "Teams" },
  { type: "player", label: "Players" },
  { type: "league", label: "Leagues" },
  { type: "match", label: "Matches" },
];

function hitLink(hit: SearchHit): { to: string; params: Record<string, string> } {
  if (hit.type === "team") return { to: "/$sport/team/$slug", params: { sport: hit.sport, slug: hit.slug } } as const;
  if (hit.type === "player") return { to: "/$sport/player/$slug", params: { sport: hit.sport, slug: hit.slug } } as const;
  if (hit.type === "match") return { to: "/$sport/match/$matchId", params: { sport: hit.sport, matchId: hit.slug } } as const;
  return { to: "/$sport/$league", params: { sport: hit.sport, league: hit.slug } } as const;
}

function SearchPage() {
  const [q, setQ] = useState("");
  const hits = search(q);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">Search</h1>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
        <SearchIcon className="size-4 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Teams, players, leagues, matches…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {q.trim().length < 2 ? (
        <EmptyState title="Start typing" body="Two characters is all it takes to search the whole vault." />
      ) : hits.length === 0 ? (
        <EmptyState title="No results" body={`Nothing matched “${q}”. Try a shorter or different query.`} />
      ) : (
        GROUPS.map((g) => {
          const rows = hits.filter((h) => h.type === g.type).slice(0, 8);
          if (!rows.length) return null;
          return (
            <section key={g.type} className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{g.label}</h2>
              <Panel className="hairline-y">
                {rows.map((h) => (
                  <Link
                    key={`${h.type}-${h.slug}`}
                    to={hitLink(h).to as never}
                    params={hitLink(h).params as never}
                    className="block p-3.5 transition-colors hover:bg-surface-2"
                  >
                    <div className="text-sm font-medium">{h.title}</div>
                    <div className="text-xs text-muted-foreground">{h.subtitle}</div>
                  </Link>
                ))}
              </Panel>
            </section>
          );
        })
      )}
    </div>
  );
}