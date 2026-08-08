import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — ScoreVault" },
      { name: "description", content: "Sign in to sync your followed teams, players and alerts." },
      { property: "og:title", content: "Sign In — ScoreVault" },
      { property: "og:description", content: "Access your ScoreVault follows and alerts." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to pick up where you left off.</p>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          login(email);
          navigate({ to: "/following" });
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
          Sign in
        </button>
      </form>
      <div className="mt-4 flex justify-between text-xs text-muted-foreground">
        <Link to="/forgot-password" className="hover:text-foreground">
          Forgot password
        </Link>
        <Link to="/signup" className="text-primary hover:underline">
          Create account
        </Link>
      </div>
    </div>
  );
}