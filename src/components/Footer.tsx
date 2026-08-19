export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-line)] bg-[var(--color-navy)] text-white/70">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
                <path
                  d="M13 2C8 2 4.2 5.7 4.2 10.4c0 6.1 7.4 12.6 8.2 13.3.3.3.9.3 1.2 0 .8-.7 8.2-7.2 8.2-13.3C21.8 5.7 18 2 13 2Z"
                  fill="var(--color-cyan)"
                />
                <circle cx="13" cy="10.4" r="3.4" fill="var(--color-navy)" />
              </svg>
              <span className="font-display text-[16px] font-bold text-white">
                KAMPUSFIND
              </span>
            </div>
            <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed">
              Satu tempat untuk melaporkan, menemukan, dan mengembalikan barang
              di lingkungan kampus. Dibuat untuk lomba "Innovative Web Solutions".
            </p>
          </div>

          <div>
            <p className="font-display text-[13px] font-semibold tracking-wide text-white">
              NAVIGASI
            </p>
            <ul className="mt-3 space-y-2 text-[13.5px]">
              <li>Beranda</li>
              <li>Temukan Barang</li>
              <li>Lapor Barang Hilang</li>
              <li>Lapor Barang Ditemukan</li>
            </ul>
          </div>

          <div>
            <p className="font-display text-[13px] font-semibold tracking-wide text-white">
              ALUR SISTEM
            </p>
            <p className="mt-3 font-mono text-[12px] tracking-tight text-[var(--color-cyan)]">
              LAPOR → CARI → COCOKKAN → KLAIM → KEMBALIKAN
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-[12.5px] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 KampusFind — Proyek lomba web development.</span>
          <span>Dibangun dengan React + TypeScript.</span>
        </div>
      </div>
    </footer>
  );
}
