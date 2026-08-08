import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SPORTS, allMatches } from "@/data";
import { MatchCard } from "@/components/sv/MatchCard";
import { Section, EmptyState } from "@/components/sv/primitives";
import { useLiveTick } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Scores — ScoreVault" },
      { name: "description", content: "Every match in play right now, with minute-by-minute scorelines." },
      { property: "og:title", content: "Live Scores — ScoreVault" },
      { property: "og:description", content: "Every match in play right now across all covered sports." },
    ],
  }),
  component: LivePage,
});

type Filter = "live" | "upcoming" | "final";

function LivePage() {
  useLiveTick();
  const [sport, setSport] = useState<string>("all");
  const [status, setStatus] = useState<Filter>("live");

  const matches = allMatches().filter(
    (m) => m.status === status && (sport === "all" || m.sport === sport),
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8">
      <Section title="Scores" subtitle="Filter by sport and state of play.">
        <div className="space-y-3">
          <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
            {(["live", "upcoming", "final"] as Filter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                  status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-2",
                )}
              >
                {s === "final" ? "Results" : s}
              </button>
            ))}
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {[{ slug: "all", name: "All sports" }, ...SPORTS.filter((s) => s.enabled)].map((s) => (
              <button
                key={s.slug}
                onClick={() => setSport(s.slug)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  sport === s.slug
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:bg-surface-2",
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {matches.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nothing here right now"
          body="No matches match this filter. Try another sport or switch to results."
        />
      )}
    </div>
  );
}