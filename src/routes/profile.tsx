import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Section, Panel, EmptyState } from "@/components/sv/primitives";
import { useStore, useHydrated, DEFAULT_PREFS, type NotifPrefs } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — ScoreVault" },
      { name: "description", content: "Manage favourites, alert preferences, saved items and appearance." },
      { property: "og:title", content: "Your Profile — ScoreVault" },
      { property: "og:description", content: "Favourites, alerts, saved pages and appearance settings." },
    ],
  }),
  component: ProfilePage,
});

const TABS = ["Favourites", "Alerts", "Saved", "Account"] as const;

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        on ? "bg-primary" : "bg-surface-2 border border-border",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-background shadow transition-all",
          on ? "left-[22px]" : "left-0.5",
        )}
      />
    </button>
  );
}

function ProfilePage() {
  const store = useStore();
  const hydrated = useHydrated();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Favourites");

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">{store.user ? store.user.name : "Guest"}</h1>
        <p className="text-sm text-muted-foreground">
          {store.user ? store.user.email : "You're browsing signed out — sign in to sync follows."}
        </p>
      </div>

      <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-2",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Favourites" &&
        (store.favorites.length ? (
          <Panel className="hairline-y">
            {store.favorites.map((f) => (
              <div key={f.slug} className="flex items-center justify-between p-3.5">
                <div>
                  <div className="text-sm font-medium">{f.label}</div>
                  <div className="text-xs capitalize text-muted-foreground">{f.kind}</div>
                </div>
                <button
                  onClick={() => store.toggleFavorite(f)}
                  className="text-xs font-medium text-negative hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </Panel>
        ) : (
          <EmptyState title="No favourites yet" body="Follow a team or player and it will show up here." />
        ))}

      {tab === "Alerts" && (
        <Section title="Alert preferences" subtitle="Set per favourite. New follows inherit these defaults.">
          {store.favorites.length ? (
            <div className="space-y-4">
              {store.favorites.map((f) => {
                const prefs = store.prefsFor(f.slug);
                return (
                  <Panel key={f.slug} className="p-4">
                    <div className="text-sm font-semibold">{f.label}</div>
                    <div className="mt-3 space-y-2.5">
                      {(Object.keys(DEFAULT_PREFS) as (keyof NotifPrefs)[]).map((k) => (
                        <div key={k} className="flex items-center justify-between">
                          <span className="text-sm capitalize text-muted-foreground">{k}</span>
                          <Toggle
                            label={k}
                            on={prefs[k]}
                            onClick={() => store.setPrefs(f.slug, { [k]: !prefs[k] })}
                          />
                        </div>
                      ))}
                    </div>
                  </Panel>
                );
              })}
            </div>
          ) : (
            <EmptyState title="Nothing to configure" body="Alert settings appear once you follow something." />
          )}
        </Section>
      )}

      {tab === "Saved" &&
        (store.saved.length ? (
          <Panel className="hairline-y">
            {store.saved.map((s) => (
              <div key={s.href} className="flex items-center justify-between p-3.5">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{s.label}</div>
                  <div className="text-xs capitalize text-muted-foreground">{s.kind}</div>
                </div>
                <button onClick={() => store.toggleSaved(s)} className="text-xs font-medium text-negative hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </Panel>
        ) : (
          <EmptyState title="Nothing saved" body="Save matches and comparisons to revisit them here." />
        ))}

      {tab === "Account" && (
        <div className="space-y-4">
          <Panel className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-semibold">Dark appearance</div>
              <div className="text-xs text-muted-foreground">Light is the default; switch any time.</div>
            </div>
            <Toggle
              label="Dark mode"
              on={hydrated && store.theme === "dark"}
              onClick={() => store.setTheme(store.theme === "dark" ? "light" : "dark")}
            />
          </Panel>
          <Panel className="p-4">
            {store.user ? (
              <button onClick={store.logout} className="text-sm font-medium text-negative hover:underline">
                Sign out
              </button>
            ) : (
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                Sign in
              </Link>
            )}
          </Panel>
        </div>
      )}
    </div>
  );
}