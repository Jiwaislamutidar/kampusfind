import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-line)] bg-[var(--color-navy)]">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.12]" />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--color-cyan)" }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-[var(--color-cyan)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)]" />
            Sistem Lost &amp; Found Kampus
          </span>

          <h1 className="mt-5 font-display text-[34px] font-bold leading-[1.12] text-white sm:text-[44px]">
            Kehilangan Barang
            <br />
            di Kampus?
          </h1>

          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65">
            Laporkan barangmu. Temukan barang yang tertinggal. Bantu
            kembalikan kepada pemiliknya — lewat satu platform, bukan grup
            WhatsApp yang cepat tenggelam.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/lapor/hilang"
              className="rounded-xl bg-[var(--color-royal)] px-5 py-3 text-center text-[14px] font-semibold text-white transition-colors hover:bg-[var(--color-royal-2)]"
            >
              Laporkan Barang Hilang
            </Link>
            <Link
              to="/lapor/ditemukan"
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-center text-[14px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              Laporkan Barang Ditemukan
            </Link>
          </div>

          <p className="mt-5 font-mono text-[11.5px] tracking-tight text-white/40">
            LAPOR → CARI → COCOKKAN → KLAIM → KEMBALIKAN
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xs md:max-w-none">
          <svg viewBox="0 0 320 300" className="w-full">
            <rect x="20" y="40" width="280" height="200" rx="18" fill="#0F2549" stroke="#1E3A6B" strokeWidth="1.5" />
            <path d="M60 190 L60 110 L110 80 L160 110 L160 190 Z" fill="none" stroke="var(--color-cyan)" strokeOpacity="0.5" strokeWidth="1.4" />
            <rect x="90" y="140" width="40" height="50" fill="#132A54" stroke="var(--color-cyan)" strokeOpacity="0.5" strokeWidth="1.2" />
            <circle cx="230" cy="140" r="46" fill="none" stroke="var(--color-cyan)" strokeWidth="2" />
            <line x1="264" y1="174" x2="292" y2="202" stroke="var(--color-cyan)" strokeWidth="4" strokeLinecap="round" />
            <circle cx="230" cy="140" r="10" fill="var(--color-cyan)" />
            <circle cx="55" cy="55" r="4" fill="var(--color-cyan)" opacity="0.7" />
            <circle cx="280" cy="70" r="3" fill="white" opacity="0.4" />
            <circle cx="45" cy="215" r="3" fill="white" opacity="0.3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
