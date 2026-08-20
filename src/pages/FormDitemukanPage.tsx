import FormDitemukan from "../components/FormDitemukan";

export default function FormDitemukanPage() {
  return (
    <div className="form-page mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-royal)]">
        Lapor Barang Ditemukan
      </p>
      <h1 className="mt-2 max-w-2xl font-display text-[25px] font-bold leading-tight text-[var(--color-navy)] sm:text-[30px]">
        Terima kasih sudah menemukan barang ini
      </h1>
      <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[var(--color-ink)]/55">
        Laporanmu akan tampil di halaman Temukan Barang dan otomatis diperiksa
        Smart Match untuk mencari pemiliknya.
      </p>

      <div className="mt-7">
        <FormDitemukan />
      </div>
    </div>
  );
}
