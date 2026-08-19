export default function StatsCard({
  value,
  label,
  accent = false,
}: {
  value: number | string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="card-surface flex flex-col gap-1 p-5">
      <span
        className={`font-display text-[32px] font-bold leading-none ${
          accent ? "text-[var(--color-royal)]" : "text-[var(--color-navy)]"
        }`}
      >
        {value}
      </span>
      <span className="text-[13px] font-medium text-[var(--color-ink)]/55">{label}</span>
    </div>
  );
}
