import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — ScoreVault" },
      { name: "description", content: "The terms that govern use of ScoreVault's reference statistics." },
      { property: "og:title", content: "Terms of Use — ScoreVault" },
      { property: "og:description", content: "Terms governing use of ScoreVault." },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  ["Acceptable use", "ScoreVault is provided for personal reference and research. Bulk scraping, resale of compiled data, or redistribution of full datasets is not permitted."],
  ["Accuracy", "Statistics are compiled with care but provided without warranty. Where a figure is disputed, the governing competition's official record takes precedence."],
  ["No wagering services", "ScoreVault carries no odds, no betting partners and no predictions marketed as advice. Nothing here is a recommendation to wager."],
  ["Accounts", "You are responsible for activity under your account. We may suspend accounts used to abuse the service or its infrastructure."],
  ["Changes", "These terms may be updated as the service grows. Continued use after an update constitutes acceptance."],
] as const;

function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Terms of Use</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated {new Date().getFullYear()}</p>
      <div className="mt-8 space-y-8">
        {SECTIONS.map(([h, b]) => (
          <section key={h}>
            <h2 className="text-lg font-semibold">{h}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b}</p>
          </section>
        ))}
      </div>
    </div>
  );
}