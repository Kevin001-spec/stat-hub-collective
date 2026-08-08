import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type FavKind = "team" | "player" | "league";
export interface Favorite {
  kind: FavKind;
  slug: string;
  sport: string;
  label: string;
}

export interface NotifPrefs {
  goals: boolean;
  lineups: boolean;
  kickoff: boolean;
  fulltime: boolean;
  news: boolean;
}

export const DEFAULT_PREFS: NotifPrefs = {
  goals: true,
  lineups: false,
  kickoff: true,
  fulltime: true,
  news: false,
};

export interface SVUser {
  name: string;
  email: string;
  staff: boolean;
}

export interface SavedItem {
  kind: "match" | "comparison";
  href: string;
  label: string;
  savedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  kind: "goal" | "start" | "final" | "system";
  at: string;
  read: boolean;
}

interface StoreState {
  hydrated: boolean;
  user: SVUser | null;
  favorites: Favorite[];
  prefs: Record<string, NotifPrefs>;
  saved: SavedItem[];
  notifications: AppNotification[];
  theme: "dark" | "light";
  onboarded: boolean;
}

interface StoreApi extends StoreState {
  login: (email: string, name?: string) => void;
  logout: () => void;
  toggleFavorite: (f: Favorite) => void;
  isFavorite: (slug: string) => boolean;
  setPrefs: (slug: string, p: Partial<NotifPrefs>) => void;
  prefsFor: (slug: string) => NotifPrefs;
  toggleSaved: (item: SavedItem) => void;
  isSaved: (href: string) => boolean;
  markAllRead: () => void;
  toggleRead: (id: string) => void;
  setTheme: (t: "dark" | "light") => void;
  completeOnboarding: () => void;
  deleteAccount: () => void;
}

const KEY = "scorevault:v1";

const seedNotifications = (): AppNotification[] => {
  const now = Date.now();
  const mk = (i: number, kind: AppNotification["kind"], title: string, body: string): AppNotification => ({
    id: `n${i}`,
    kind,
    title,
    body,
    at: new Date(now - i * 37 * 60000).toISOString(),
    read: i > 2,
  });
  return [
    mk(1, "goal", "Arsenal 2–1 Chelsea", "Goal — 63' Bukayo-style finish from the right channel."),
    mk(2, "start", "Lakers vs Nuggets tips off in 15 min", "Your followed team is about to play."),
    mk(3, "final", "Full time: Real Madrid 3–0 Sevilla", "Final score for a team you follow."),
    mk(5, "goal", "Man City 1–0 Liverpool", "Goal — 22' from a set-piece."),
    mk(8, "system", "Standings updated", "Premier League table recalculated after last night's fixtures."),
    mk(14, "final", "Full time: Celtics 112–105 Knicks", "Final score for a team you follow."),
    mk(26, "start", "Barcelona vs Atlético starts soon", "Lineups announced."),
  ];
};

const initial: StoreState = {
  hydrated: false,
  user: null,
  favorites: [],
  prefs: {},
  saved: [],
  notifications: seedNotifications(),
  theme: "light",
  onboarded: false,
};

const Ctx = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoreState>;
        setState((s) => ({ ...s, ...parsed, hydrated: true }));
      } else {
        setState((s) => ({ ...s, hydrated: true }));
      }
    } catch {
      setState((s) => ({ ...s, hydrated: true }));
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated: _h, ...persist } = state;
    try {
      localStorage.setItem(KEY, JSON.stringify(persist));
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    root.classList.toggle("dark", state.theme === "dark");
    root.style.colorScheme = state.theme;
  }, [state]);

  const api = useMemo<StoreApi>(() => {
    const update = (fn: (s: StoreState) => StoreState) => setState(fn);
    return {
      ...state,
      login: (email, name) =>
        update((s) => ({
          ...s,
          user: {
            email,
            name: name || email.split("@")[0]!.replace(/[._]/g, " "),
            staff: email.toLowerCase().endsWith("@scorevault.com"),
          },
        })),
      logout: () => update((s) => ({ ...s, user: null })),
      toggleFavorite: (f) =>
        update((s) => ({
          ...s,
          favorites: s.favorites.some((x) => x.slug === f.slug)
            ? s.favorites.filter((x) => x.slug !== f.slug)
            : [...s.favorites, f],
        })),
      isFavorite: (slug) => state.favorites.some((x) => x.slug === slug),
      setPrefs: (slug, p) =>
        update((s) => ({
          ...s,
          prefs: { ...s.prefs, [slug]: { ...DEFAULT_PREFS, ...s.prefs[slug], ...p } },
        })),
      prefsFor: (slug) => ({ ...DEFAULT_PREFS, ...state.prefs[slug] }),
      toggleSaved: (item) =>
        update((s) => ({
          ...s,
          saved: s.saved.some((x) => x.href === item.href)
            ? s.saved.filter((x) => x.href !== item.href)
            : [item, ...s.saved],
        })),
      isSaved: (href) => state.saved.some((x) => x.href === href),
      markAllRead: () =>
        update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      toggleRead: (id) =>
        update((s) => ({
          ...s,
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
        })),
      setTheme: (theme) => update((s) => ({ ...s, theme })),
      completeOnboarding: () => update((s) => ({ ...s, onboarded: true })),
      deleteAccount: () => update(() => ({ ...initial, hydrated: true })),
    };
  }, [state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

/** Mock live clock — advances every 10s so live surfaces genuinely move. */
export function useLiveTick(intervalMs = 10000) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return tick;
}

export function useThemeToggle() {
  const { theme, setTheme } = useStore();
  return useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);
}