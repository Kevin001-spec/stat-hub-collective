import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ScoreVault" },
      { name: "description", content: "How ScoreVault handles your data, preferences and local storage." },
      { property: "og:title", content: "Privacy Policy — ScoreVault" },
      { property: "og:description", content: "Our approach to data, preferences and storage." },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  ["What we store", "ScoreVault keeps your followed teams, alert preferences, saved pages and appearance choice in your browser's local storage. Nothing is transmitted to a server in this build."],
  ["Analytics", "Aggregate, non-identifying page counts may be recorded to understand which reference pages are most used. We do not build advertising profiles."],
  ["Third parties", "Statistical data is compiled from licensed feeds and public record. We do not sell user data, and we carry no betting or odds partners."],
  ["Your controls", "You can clear every stored preference at any time from Profile → Account. Removing browser data removes your ScoreVault state completely."],
  ["Contact", "Questions about this policy can be directed to privacy@scorevault.example."],
] as const;

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
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