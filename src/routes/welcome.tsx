import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TEAMS } from "@/data";
import { Crest } from "@/components/sv/Crest";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Pick Your Teams — ScoreVault" },
      { name: "description", content: "Choose the teams you follow to personalise scores and alerts." },
      { property: "og:title", content: "Pick Your Teams — ScoreVault" },
      { property: "og:description", content: "Personalise ScoreVault by following your teams." },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  const { favorites, toggleFavorite, completeOnboarding } = useStore();
  const navigate = useNavigate();
  const teams = TEAMS.filter((t) => t.sport === "soccer" || t.sport === "basketball").slice(0, 32);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">Who do you follow?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick a few teams — we'll build your feed and alerts around them.
      </p>
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {teams.map((t) => {
          const on = favorites.some((f) => f.slug === t.slug);
          return (
            <button
              key={t.slug}
              onClick={() => toggleFavorite({ kind: "team", slug: t.slug, sport: t.sport, label: t.name })}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-colors",
                on ? "border-primary bg-accent" : "border-border bg-surface hover:bg-surface-2",
              )}
            >
              <Crest team={t.slug} size="sm" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.shortName}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={() => {
          completeOnboarding();
          navigate({ to: "/following" });
        }}
        className="mt-8 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        Continue
      </button>
    </div>
  );
}