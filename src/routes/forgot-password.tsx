import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — ScoreVault" },
      { name: "description", content: "Request a password reset link for your ScoreVault account." },
      { property: "og:title", content: "Reset Password — ScoreVault" },
      { property: "og:description", content: "Recover access to your ScoreVault account." },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Reset your password</h1>
      {sent ? (
        <p className="mt-4 rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
          If that address exists, a reset link is on its way.
        </p>
      ) : (
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
            Send reset link
          </button>
        </form>
      )}
      <p className="mt-4 text-xs">
        <Link to="/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}