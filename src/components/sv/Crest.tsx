import { getTeam } from "@/data";
import { cn } from "@/lib/utils";

const SIZES = { xs: 20, sm: 28, md: 40, lg: 64, xl: 88 } as const;

export function Crest({
  team,
  size = "sm",
  className,
}: {
  team: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const t = getTeam(team);
  const px = SIZES[size];
  const [c1, c2] = t?.colors ?? ["#7a8090", "#3b4150"];
  const abbr = t?.abbr ?? "—";
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-[28%] ring-1 ring-black/20",
        className,
      )}
      style={{ width: px, height: px, background: `linear-gradient(140deg, ${c1} 0%, ${c2} 100%)` }}
      aria-hidden
    >
      <span
        className="absolute inset-0 opacity-25"
        style={{ background: `radial-gradient(circle at 30% 18%, #fff 0%, transparent 62%)` }}
      />
      <span
        className="relative font-mono font-bold tracking-tight"
        style={{
          fontSize: px * 0.34,
          color: contrast(c1),
          textShadow: "0 1px 2px rgba(0,0,0,.35)",
        }}
      >
        {abbr}
      </span>
    </span>
  );
}

function contrast(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#12151c" : "#ffffff";
}