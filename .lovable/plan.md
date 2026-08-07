# ScoreVault — Premium Sports Reference Site

Frontend-only build with realistic mock data. No backend, no ads, no betting odds.

## Design direction (committed)

- **Dark-first, high-contrast "instrument panel"** aesthetic: near-black slate base (`oklch(0.16 0.02 265)`), elevated card surfaces, hairline borders, and a single confident accent — electric emerald `oklch(0.78 0.17 165)` for live/positive states, amber for warnings, rose for negative deltas. Light mode is a real, tuned theme, not an inversion.
- **Typography:** `Sora` for headings and numerals-in-display (confident, geometric, premium), `Inter Tight` for body/UI, and `JetBrains Mono` with tabular figures for every stat table, score, and clock. Tabular numerals everywhere numbers align — this is what makes dense tables read as engineered rather than generic.
- **Density with air:** 12px cell padding, 32–48px between stat blocks, sticky table headers, zebra-free tables using hairline rules only.
- **Motion:** skeleton shimmer while "streaming", number-flip on score change, pulsing LIVE dot, shared-element route transitions on match cards, overlay (not reload) for match detail.

## Data model first (so any sport is a config flip)

A single `src/data/` layer drives every page — no per-sport code paths:

- `sports.ts` — sport registry with `enabled`, `phase`, icon, and a `dna` descriptor listing that sport's signature stat keys, labels, formats, and which modules to render (heat map, pitch-tracking, surface splits, etc.).
- `leagues.ts`, `teams.ts`, `players.ts`, `matches.ts` — generic entities keyed by sport slug.
- Mock generators produce full depth for Soccer + Basketball (Phase 1), thinner sets for American Football/Baseball (Phase 2), and nav-only presence for Phase 3–4 sports with a "coming soon / data source catching up" state.
- Team and player pages render their Sport DNA block by reading the sport's `dna` descriptor, so adding a sport is a data entry, not a new page.

## Screens

**Global shell**
- Desktop: logo, sport mega-menu (grouped by sport → leagues), global search, always-visible horizontally scrollable live ticker, auth/avatar.
- Mobile: bottom tab bar (Home, Scores, Search, Following, Profile), collapsible thin ticker that expands on tap, swipeable sport switcher on Sport Hub.
- Contextual tab row inside sport/league hubs: Overview / Fixtures / Results / Standings / Stats / Teams.
- Breadcrumbs on any page 3+ levels deep.

**Public pages**
- `/` Home — live/upcoming hero strip, ticker, trending module, sport tiles, stat-leader snapshot, personalization CTA.
- `/live` — all in-play matches, filters by sport/league/date, pulsing LIVE badge with minute, card → match overlay.
- `/[sport]` Sport Hub — league selector, today's fixtures, sport-wide leaders, Sport DNA callouts.
- `/[sport]/[league]` — standings preview, fixtures/results tabs, competition leaders, teams grid.
- `/[sport]/[league]/standings` — full table with sticky team column on mobile.
- `/[sport]/team/[slug]` — crest/founded/stadium, W-D-L form strip, upcoming/recent tabs, roster grid, DNA stat dashboard, Compare CTA.
- `/[sport]/player/[slug]` — bio header, season-by-season table, DNA advanced metrics, similar players.
- `/[sport]/match/[id]` — score header, **minute-anchored visual timeline** with standardized icons (goal, card, sub) as the centerpiece, Lineups / Stats / Head-to-head tabs, follow-bell.
- `/compare/[a]-vs-[b]` — one template for teams or players, season/competition/per-90 filters, radar overlay + diverging bar comparisons, share affordances.
- `/[sport]/stats` — sport-specific leaderboards with season/competition filters.
- `/search?q=` — instant results grouped by teams / players / leagues / matches.
- `/following` — favorites-only feed with manage-favorites shortcut.
- `/notifications` — chronological alerts with read/unread and link into settings.
- `/profile` + tabs — favorites, granular per-favorite notification prefs, saved matches/comparisons, account basics, appearance toggle (dark default). No public profile, no rate-us, no gamification.
- `/login`, `/signup`, `/forgot-password`, `/welcome` (one-time "pick teams to follow" onboarding). Mock auth via local state only.
- `/privacy`, `/terms` — full text, footer-linked.

**Admin `/admin/*`** (mock staff gate)
- Overview traffic snapshot, API health monitor with per-source quota/status, data source registry with primary/backup swap, category (sport/league) visibility toggles wired to the sport registry, user management, alerts/logs.

**States**: 404, "no live matches right now", "this data source is catching up", plus skeletons on every data surface.

## Technical notes

- TanStack Start file routes; dynamic segments `$sport`, `$league`, `$slug`, `$matchId`, `$pair`. Match detail also reachable as an overlay via route state so cards never full-reload.
- Design tokens in `src/styles.css` (`@theme inline`, oklch only); fonts loaded via `<link>` in `__root.tsx`.
- Radar and bar charts via Recharts, themed to the token set.
- A `useLiveClock` mock tick advances match minutes and occasionally mutates scores so live pages genuinely feel live.
- Per-route `head()` metadata on every content route.
- Favorites/notifications/theme persisted to localStorage (hydration-safe) as a stand-in for the future backend.

## Build order

1. Tokens, fonts, data layer + mock generators.
2. Global shell (nav, ticker, mobile tabs, breadcrumbs).
3. Home, Live, Sport Hub, League, Standings.
4. Team, Player, Match timeline, Compare, Stats, Search.
5. Auth, onboarding, Following, Notifications, Profile.
6. Admin, legal, empty/error states, polish pass.
