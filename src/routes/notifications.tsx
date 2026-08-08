import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { Panel } from "@/components/sv/primitives";
import { useStore, useHydrated } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — ScoreVault" },
      { name: "description", content: "Goal alerts, kickoff reminders and full-time results for your follows." },
      { property: "og:title", content: "Notifications — ScoreVault" },
      { property: "og:description", content: "Alerts from the teams and players you follow." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, markAllRead, toggleRead } = useStore();
  const hydrated = useHydrated();

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button onClick={markAllRead} className="text-sm font-medium text-primary hover:underline">
          Mark all read
        </button>
      </div>
      <Panel className="hairline-y">
        {notifications.map((n) => (
          <button
            key={n.id}
            onClick={() => toggleRead(n.id)}
            className="flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-surface-2"
          >
            <span
              className={cn(
                "mt-1 grid size-8 shrink-0 place-items-center rounded-full",
                n.read ? "bg-surface-2 text-muted-foreground" : "bg-accent text-accent-foreground",
              )}
            >
              <Bell className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn("block text-sm", hydrated && !n.read ? "font-semibold" : "font-medium")}>
                {n.title}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{n.body}</span>
            </span>
            {hydrated && !n.read && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" />}
          </button>
        ))}
      </Panel>
      <p className="text-xs text-muted-foreground">
        Fine-tune what triggers an alert in{" "}
        <Link to="/profile" className="text-primary hover:underline">
          profile settings
        </Link>
        .
      </p>
    </div>
  );
}