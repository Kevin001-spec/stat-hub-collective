# Stat Hub Collective

ScoreVault — Lovable Build Prompt

Build ScoreVault, a sports-data website. (If a different name gets picked later, find-and-replace "ScoreVault" — StatGrid and IronScore were the backup names under consideration.)

Positioning: This is not a news site and not a betting site. It's the place sports stats live — dense, factual, permanent reference pages for every team, player, league, and match, across every sport. Every page should read like something built to be cited and bookmarked, not scrolled past once.

Scope for this build pass

Build every screen listed below, fully designed.

Populate all pages with realistic mock data — there is no backend yet. Data will be wired in later; for now, make it look and feel completely real.

Design the system generically enough that it works for any sport, not just the ones with populated data in this pass (see "Sport rollout" below).

Global navigation

Desktop top nav (persistent): logo → sport mega-menu (dropdown grouping every active sport and its leagues) → global search → a horizontally-scrollable live-score ticker strip that's always visible → login / profile avatar.

Mobile: bottom tab bar with Home, Scores, Search, Following, Profile. Add a swipe-friendly sport switcher on the Sport Hub page. The live-score ticker collapses to a thin bar that expands on tap.

Contextual sub-nav: inside any sport/league hub, show a tab row under the page header — Overview / Fixtures / Results / Standings / Stats / Teams. This is not a new top-level menu item.

Breadcrumbs: on every page more than two levels deep (League → Team → Player).

Pages to build

Home — /

Hero strip of today's biggest live/upcoming games (mixed feed when logged out, favorites-weighted when logged in). Persistent live ticker. "Trending now" players/teams module. Quick sport-switcher tiles. A snapshot of top stat leaders for the anchor sports. A clear "create a free account" CTA tied to personalization — not a paywall.

Live Scores — /live

Every in-play match across every active sport, filterable by sport/league/date. Each match card shows crests, score, a high-contrast pulsing LIVE badge with the match minute, and a competition tag. Tapping a card opens match detail as an overlay/route transition — never a full page reload.

Sport Hub — /[sport]

League selector, today's fixtures across every league in that sport, sport-wide stat leaders, and that sport's "Sport DNA" callouts (see table below).

League/Competition page — /[sport]/[league]

Standings, Fixtures/Results tabs, top scorers/leaders for that competition, and a teams grid.

Standings — /[sport]/[league]/standings

Full table. On mobile, keep the first column (team name) sticky while the rest of the stats scroll horizontally.

Team profile — /[sport]/team/[team-slug]

Crest, name, founded year, stadium. Last-5-results form strip (W/D/L chips). Upcoming/recent tabs. Full roster grid linking to player pages. A sport-DNA team stat dashboard. A "Compare this team" CTA.

Player profile — /[sport]/player/[player-slug]

Photo, name, position, team, basic bio. Season-by-season career stats table. A sport-DNA advanced metrics module. A "similar players" module linking to other player pages.

Match detail — /[sport]/match/[match-id]

Score header with a LIVE badge if in-play. A visual timeline with standardized iconography (goal, card, substitution) anchored to minute markers — this is the single most important real-time UI element on the site, so give it real design attention. Tabs for Lineups / Stats / Head-to-head. A "follow this match" bell for notifications.

Compare / Head-to-head — /compare/[a]-vs-[b]

One flexible template that works for either two teams or two players, side-by-side. Filters for season, competition, and per-90/per-game normalization. A radar chart overlay plus color-coded bar comparisons for whichever metrics are being compared. Design this to be inherently shareable — it's meant to be the best-converting page type on the site.

Stats & Leaders — /[sport]/stats

Sport-specific leaderboards (top scorers, most assists, best ERA, etc.), filterable by season/competition.

Search — /search?q=

Global instant search, with results grouped by type (teams / players / leagues / matches) as the user types.

Following — /following

Logged-in home replacement: only the teams/players/leagues the user has favorited. A "manage favorites" shortcut at the top.

Profile & Settings — /profile (+ tabs)

Requires login. Include:

Favorited teams / players / leagues

Notification preferences, granular per favorite (e.g. goal alerts for one team but not lineup-announcement alerts)

Saved/bookmarked matches or comparisons

Account basics: display name, avatar, email, password, delete-account

Appearance: light/dark toggle, defaulting to dark

Do not build any of the following into the profile/account system:

A public social profile — keep profiles private and account-focused, no community/social layer.

A "rate us" prompt — that's a native-app mechanic, not a website one.

Gamification or badges of any kind.

Notifications — /notifications

Chronological list of triggered alerts (goal alerts, game-starting-soon, final score) with read/unread state, and a link into settings to adjust what triggers them.

Auth — /login /signup /forgot-password /welcome

Minimal, fast, no friction. Immediately after signup, show a one-time onboarding screen: "pick a few teams to follow" — this is what makes Following and notifications feel personal from the first session instead of empty.

Admin dashboard — /admin/* (staff-only)

Build with realistic mock data:

Overview — traffic snapshot, most-viewed pages/teams/players today

API health monitor — per-source status (e.g. "Sportmonks — healthy, synced 2 min ago, 340/2,500 calls used today" / "API-Football — degraded, backup active")

Data source registry — a config table view/edit for data sources, with a manual primary/backup swap control



Category management — toggle a sport or league on/off for public visibility

User management — search accounts, view status, handle deletion requests

Alerts/logs — recent failed calls, notification-delivery issues, anything needing a human look

Legal — /privacy /terms

On-site pages with full text, footer-linked, low visual prominence but easy to find.

Empty / error states

Design states for: 404, "no live matches right now," and "this data source is catching up."

Sport rollout for this build

Design the system so any sport can be added, but populate mock data using this phase order — treat Phase 1 as fully built out, and Phase 2–4 sports as present in navigation/switchers but lighter on populated content:

Phase Sports 1 — Launch (fully populate) Soccer, Basketball 2 — Expand American Football, Baseball 3 — Scale Cricket, Tennis, Hockey 4 — Long tail Golf, Volleyball, Table Tennis, F1, and others

Turning on a sport's live data later should be a config flip (handled via the admin dashboard's category toggle), not a rebuild — so avoid hardcoding sport-specific page logic; drive team/player/league pages from data, not per-sport code paths.

Sport DNA — signature stats per sport

Every team and player page must surface its sport's own signature stats, not a generic one-size-fits-all stat block:

Sport Signature stats to include Soccer xG (expected goals), heat maps, transfer history, historical lineups Basketball PER, True Shooting %, draft history, usage rate Baseball WAR, OPS+, pitch-tracking data, minor-league history American Football Fantasy points, combine measurements, advanced defensive metrics Cricket Ball-by-ball breakdowns, strike rate, T20 franchise stats Tennis Head-to-head record, serve speed, surface splits, Grand Slam history Hockey Save %, time on ice, penalty-kill efficiency

Design language

Dark-mode-first. Default to dark, high-contrast; keep light mode available as a toggle.

Data-dense but not cramped. Generous spacing between stat blocks even when there are a lot of them.

Motion as a smoothness tool, not decoration. Skeleton loaders while data streams in, incremental updates on live pages (never a jarring full reload), smooth route transitions.

No ad slots anywhere. Do not reserve space for any ad unit on any page.

No specific font is being prescribed. Choose a typeface direction yourself — aim for confident, premium, and legible at data-table density.

Explicitly out of scope for this build

Any real backend or live API integration — that comes in a later phase. This pass is frontend design + mock data only.

Betting odds display.

Web scraping as a data source.

Full programmatic SEO at scale (auto-generated matchup/history pages, dynamic sitemaps, schema markup) — this is a later backend-driven phase.

One setup note before you start

so desin this to be so premium, good user feel, good user touch, good user  navigation, mobile friendly, ensure every page and its features are fully done to completion, ensure ppl enjoy browsing on the site, use good fonts which are easy to read, proffesional and the way u combine them should just be a masterpiece. no backend in this creation. and my  big request is making the site really premium with good user feel, even in the colors, like i really need it to feel like a high end enterpise company made it with how it looks and the user feel and experience while browsing, anything more creative u wanna addd u can add please add. lets go

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/21e042b1-8b4a-4b97-a564-48ddce97a671).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
