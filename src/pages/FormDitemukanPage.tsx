import FormDitemukan from "../components/FormDitemukan";

export default function FormDitemukanPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="text-[12.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
        Lapor Barang Ditemukan
      </p>
      <h1 className="mt-1.5 font-display text-[24px] font-bold text-[var(--color-navy)]">
        Terima kasih sudah menemukan barang ini
      </h1>
      <p className="mt-2 text-[13.5px] text-[var(--color-ink)]/55">
        Laporanmu akan tampil di halaman Temukan Barang dan otomatis diperiksa
        Smart Match untuk mencari pemiliknya.
      </p>

      <div className="card-surface mt-7 p-5 sm:p-7">
        <FormDitemukan />
      </div>
    </div>
  );
}
