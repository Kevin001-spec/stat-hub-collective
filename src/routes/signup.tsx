import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — ScoreVault" },
      { name: "description", content: "Create a ScoreVault account to follow teams and get match alerts." },
      { property: "og:title", content: "Create Account — ScoreVault" },
      { property: "og:description", content: "Follow teams, players and leagues with a free account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">Follow teams, save comparisons, get alerts.</p>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          login(email, name);
          navigate({ to: "/welcome" });
        }}
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
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
          placeholder="Password"
          className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
          Create account
        </button>
      </form>
      <p className="mt-4 text-xs text-muted-foreground">
        Already registered?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}