import { Link } from "react-router-dom";
import type { Report } from "../types";
import StatusBadge from "./StatusBadge";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function ItemCard({ report }: { report: Report }) {
  return (
    <Link
      to={`/barang/${report.id}`}
      className="card-surface group flex flex-col overflow-hidden transition-shadow hover:shadow-[0_6px_20px_rgba(11,30,63,0.08)]"
    >
      <div className="relative flex h-28 items-center justify-center border-b border-[var(--color-line)] bg-[var(--color-sky)] sm:h-36">
        {report.photoUrl ? (
          <img
            src={report.photoUrl}
            alt={report.itemName}
            className="h-full w-full object-cover"
          />
        ) : (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="7" width="18" height="13" rx="2" stroke="var(--color-royal)" strokeWidth="1.6" />
            <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" stroke="var(--color-royal)" strokeWidth="1.6" />
            <circle cx="12" cy="13" r="2.4" stroke="var(--color-cyan)" strokeWidth="1.6" />
          </svg>
        )}
        <span
          className={`absolute left-2.5 top-2.5 rounded-md px-2 py-1 text-[10.5px] font-bold tracking-wide ${
            report.type === "HILANG"
              ? "bg-[var(--color-navy)] text-white"
              : "bg-[var(--color-cyan)] text-[var(--color-navy)]"
          }`}
        >
          {report.type === "HILANG" ? "BARANG HILANG" : "BARANG DITEMUKAN"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <h3 className="font-display text-[13px] font-semibold leading-snug text-[var(--color-navy)] group-hover:text-[var(--color-royal)] sm:text-[15px]">
          {report.itemName}
        </h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-[var(--color-ink)]/60 sm:gap-x-3 sm:text-[12.5px]">
          <span className="inline-flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s7-6.2 7-12A7 7 0 0 0 5 10c0 5.8 7 12 7 12Z" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {report.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="4.5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M3.5 9h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            {formatDate(report.createdAt)}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <StatusBadge status={report.status} />
          <span className="text-[10.5px] font-semibold text-[var(--color-royal)] group-hover:underline sm:text-[12.5px]">
            Lihat detail →
          </span>
        </div>
      </div>
    </Link>
  );
}
