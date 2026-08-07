import { Link } from "@tanstack/react-router";
import { Search, Bell, User, Home, Radio, Star, Menu } from "lucide-react";
import { SPORTS, liveMatches, getTeam, getLeague } from "@/data";
import { Crest } from "@/components/sv/Crest";
import { LiveBadge } from "@/components/sv/primitives";
import type { ReactNode } from "react";

function Ticker() {
  const matches = liveMatches().slice(0, 14);
  return (
    <div className="border-b border-border bg-surface/60 backdrop-blur">
      <div className="no-scrollbar flex items-center gap-1 overflow-x-auto px-3 py-1.5">
        <span className="mr-2 hidden shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-live sm:flex">
          <span className="pulse-dot size-1.5 rounded-full bg-live" /> Live
        </span>
        {matches.map((m) => {
          const h = getTeam(m.home)!;
          const a = getTeam(m.away)!;
          return (
            <Link
              key={m.id}
              to="/$sport/match/$matchId"
              params={{ sport: m.sport, matchId: m.id }}
              className="flex shrink-0 items-center gap-2 rounded-md px-2.5 py-1 text-xs transition-colors hover:bg-surface-2"
            >
              <Crest team={h.slug} size="xs" />
              <span className="stat-num font-semibold">
                {m.homeScore}–{m.awayScore}
              </span>
              <Crest team={a.slug} size="xs" />
              <span className="text-[10px] text-muted-foreground">{m.period}</span>
            </Link>
          );
        })}
        {matches.length === 0 && (
          <span className="px-2 text-xs text-muted-foreground">No matches in play right now.</span>
        )}
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const active = SPORTS.filter((s) => s.enabled);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-md bg-primary font-display text-sm font-bold text-primary-foreground">
              S
            </span>
            <span className="font-display text-base font-semibold tracking-tight">ScoreVault</span>
          </Link>
          <nav className="no-scrollbar hidden items-center gap-1 overflow-x-auto md:flex">
            {active.slice(0, 7).map((s) => (
              <Link
                key={s.slug}
                to="/$sport"
                params={{ sport: s.slug }}
                className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                activeProps={{ className: "bg-surface-2 text-foreground" }}
              >
                {s.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <Link to="/search" className="grid size-9 place-items-center rounded-md hover:bg-surface-2">
              <Search className="size-4" />
            </Link>
            <Link to="/notifications" className="grid size-9 place-items-center rounded-md hover:bg-surface-2">
              <Bell className="size-4" />
            </Link>
            <Link to="/profile" className="grid size-9 place-items-center rounded-md hover:bg-surface-2">
              <User className="size-4" />
            </Link>
          </div>
        </div>
        <Ticker />
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <footer className="border-t border-border bg-surface/40 px-4 py-8 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} ScoreVault — reference statistics for every sport.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
        {[
          { to: "/", label: "Home", icon: Home },
          { to: "/live", label: "Scores", icon: Radio },
          { to: "/search", label: "Search", icon: Search },
          { to: "/following", label: "Following", icon: Star },
          { to: "/profile", label: "Profile", icon: User },
        ].map((i) => (
          <Link
            key={i.to}
            to={i.to}
            className="flex flex-col items-center gap-1 py-2.5 text-[10px] text-muted-foreground"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: i.to === "/" }}
          >
            <i.icon className="size-5" />
            {i.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
