import { Link } from "@tanstack/react-router";
import { getSport, getTeam, standingsFor, fmt } from "@/data";
import { Crest } from "./Crest";
import { FormStrip } from "./primitives";

export function StandingsTable({
  league,
  sport,
  limit,
  showForm = true,
}: {
  league: string;
  sport: string;
  limit?: number;
  showForm?: boolean;
}) {
  const cfg = getSport(sport);
  const rows = standingsFor(league);
  if (!cfg || !rows.length) return null;
  const cols = cfg.standings;
  const shown = limit ? rows.slice(0, limit) : rows;

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      <table className="w-full min-w-[560px] text-sm">
        <thead className="sticky top-0 bg-surface">
          <tr className="border-b border-border text-[11px] uppercase tracking-[0.07em] text-muted-foreground">
            <th className="w-8 px-3 py-2.5 text-left font-medium">#</th>
            <th className="px-2 py-2.5 text-left font-medium">Team</th>
            {cols.map((c) => (
              <th key={c.key} className="px-2 py-2.5 text-right font-medium">
                {c.label}
              </th>
            ))}
            {showForm && <th className="px-3 py-2.5 text-right font-medium">Form</th>}
          </tr>
        </thead>
        <tbody>
          {shown.map((row, i) => {
            const team = getTeam(row.team);
            if (!team) return null;
            return (
              <tr key={row.team} className="border-b border-border/60 last:border-0 hover:bg-surface-2">
                <td className="stat-num px-3 py-2.5 text-xs text-muted-foreground">{i + 1}</td>
                <td className="px-2 py-2.5">
                  <Link
                    to="/$sport/team/$slug"
                    params={{ sport, slug: team.slug }}
                    className="flex items-center gap-2 font-medium hover:text-primary"
                  >
                    <Crest team={team.slug} size="xs" />
                    <span className="truncate">{team.shortName}</span>
                  </Link>
                </td>
                {cols.map((c) => (
                  <td key={c.key} className="stat-num px-2 py-2.5 text-right tabular-nums">
                    {fmt(row.values[c.key], c.format)}
                  </td>
                ))}
                {showForm && (
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end">
                      <FormStrip form={row.form} size="sm" />
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}