import { Link } from "react-router-dom";
import type { MatchResult } from "../index";

function MatchRow({ match }: { match: MatchResult }) {
  const { report, score, breakdown } = match;
  return (
    <div className="card-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[14.5px] font-semibold text-[var(--color-navy)]">
            {report.itemName}
          </p>
          <p className="mt-0.5 text-[12.5px] text-[var(--color-ink)]/55">
            {report.location} · {new Date(report.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>
        <span className="shrink-0 font-mono text-[13px] font-semibold text-[var(--color-royal)]">
          {score}%
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-line)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-royal)] to-[var(--color-cyan)]"
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px] sm:grid-cols-5">
        {breakdown.map((b) => (
          <div key={b.label} className="flex items-center gap-1.5">
            <span
              className={
                b.matched === "cocok"
                  ? "text-[var(--color-cyan-2)]"
                  : b.matched === "dekat" || b.matched === "mirip"
                  ? "text-amber-500"
                  : "text-[var(--color-ink)]/30"
              }
            >
              {b.matched === "cocok" ? "✓" : b.matched === "tidak" ? "–" : "~"}
            </span>
            <span className="text-[var(--color-ink)]/65">{b.label}</span>
          </div>
        ))}
      </div>

      <Link
        to={`/barang/${report.id}`}
        className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-royal)] hover:underline"
      >
        Lihat Barang →
      </Link>
    </div>
  );
}

export default function SmartMatch({ matches }: { matches: MatchResult[] }) {
  if (matches.length === 0) {
    return (
      <div className="card-surface p-6 text-center">
        <p className="text-[13.5px] text-[var(--color-ink)]/55">
          Belum ada laporan barang ditemukan yang cukup mirip. Smart Match akan
          terus memeriksa laporan baru secara otomatis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((m) => (
        <MatchRow key={m.report.id} match={m} />
      ))}
    </div>
  );
}
