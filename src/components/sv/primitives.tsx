import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function LiveBadge({ label, className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-live px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-live-foreground",
        className,
      )}
    >
      <span className="pulse-dot inline-block size-1.5 rounded-full bg-current" />
      {label ?? "Live"}
    </span>
  );
}

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "accent" | "outline";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        tone === "muted" && "bg-surface-2 text-muted-foreground",
        tone === "accent" && "bg-accent text-accent-foreground",
        tone === "outline" && "border border-border text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function FormStrip({ form, size = "md" }: { form: ("W" | "D" | "L")[]; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-1">
      {form.map((f, i) => (
        <span
          key={i}
          title={f === "W" ? "Win" : f === "D" ? "Draw" : "Loss"}
          className={cn(
            "grid place-items-center rounded font-mono font-bold",
            size === "sm" ? "size-5 text-[10px]" : "size-6 text-[11px]",
            f === "W" && "bg-positive/15 text-positive",
            f === "D" && "bg-muted text-muted-foreground",
            f === "L" && "bg-negative/15 text-negative",
          )}
        >
          {f}
        </span>
      ))}
    </div>
  );
}

export function Section({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || action) && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            {title && <h2 className="truncate text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-border bg-surface", className)}>{children}</div>;
}

export function StatTile({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "positive" | "negative";
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="text-[11px] font-medium uppercase tracking-[0.09em] text-muted-foreground">{label}</div>
      <div
        className={cn(
          "stat-num mt-2 text-2xl font-semibold",
          tone === "positive" && "text-positive",
          tone === "negative" && "text-negative",
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="shimmer h-12 rounded-lg bg-surface-2" />
      ))}
    </div>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; to?: string; params?: Record<string, string> }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="no-scrollbar overflow-x-auto">
      <ol className="flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="opacity-40">/</span>}
            {item.to ? (
              <Link to={item.to} params={item.params as never} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
