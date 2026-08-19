export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
      >
        <circle cx="11" cy="11" r="6.5" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="1.8" />
        <path d="m20 20-3.4-3.4" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari nama barang, kategori, atau lokasi..."
        className="focus-ring w-full rounded-xl border border-[var(--color-line)] bg-white py-3 pl-10 pr-3.5 text-[13.5px] outline-none"
      />
    </div>
  );
}
