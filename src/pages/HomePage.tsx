import { Link } from "react-router-dom";
import Hero from "../components/Hero";

const STEPS = [
  {
    n: "01",
    title: "Laporkan",
    desc: "Masukkan informasi barang hilang atau barang yang kamu temukan lewat form singkat.",
  },
  {
    n: "02",
    title: "Temukan",
    desc: "Cari laporan barang yang sesuai lewat pencarian dan filter lokasi, kategori, atau tanggal.",
  },
  {
    n: "03",
    title: "Smart Match",
    desc: "Sistem menghitung skor kemiripan antara laporan hilang dan ditemukan secara otomatis.",
  },
  {
    n: "04",
    title: "Kembalikan",
    desc: "Barang diklaim lewat proses verifikasi, lalu dikembalikan ke pemilik yang sah.",
  },
];

export default function HomePage() {
  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
              Alur Sistem
            </p>
            <h2 className="mt-1.5 font-display text-[26px] font-bold text-[var(--color-navy)] sm:text-[30px]">
              Cara Kerja KampusFind
            </h2>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="card-surface h-full p-5">
                <span className="font-display text-[38px] font-bold leading-none text-[var(--color-sky)]">
                  {s.n}
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-cyan)]" />
                  <h3 className="font-display text-[15px] font-semibold text-[var(--color-navy)]">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink)]/60">
                  {s.desc}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-[var(--color-line)] lg:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--color-line)] bg-[var(--color-sky)]/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-2">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
              Masalah
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-navy)]/80">
              Barang hilang di kampus sering hanya diumumkan lewat grup
              WhatsApp, Instagram Story, atau chat pribadi — informasinya
              cepat tenggelam dan susah dilacak.
            </p>
          </div>
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
              Solusi
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-navy)]/80">
              KampusFind mengumpulkan laporan barang hilang dan ditemukan
              dalam satu platform, lengkap dengan pencarian, Smart Match, dan
              alur klaim yang aman.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="mx-auto max-w-lg font-display text-[24px] font-bold leading-snug text-[var(--color-navy)] sm:text-[28px]">
          Barang Hilang, Jangan Dibiarkan.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] text-[var(--color-ink)]/60">
          Mulai dengan melaporkan barangmu, atau bantu orang lain dengan
          melaporkan barang yang kamu temukan.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/lapor/hilang"
            className="rounded-xl bg-[var(--color-royal)] px-5 py-3 text-[14px] font-semibold text-white hover:bg-[var(--color-royal-2)]"
          >
            Laporkan Barang Hilang
          </Link>
          <Link
            to="/temukan"
            className="rounded-xl border border-[var(--color-line)] px-5 py-3 text-[14px] font-semibold text-[var(--color-navy)] hover:bg-[var(--color-sky)]"
          >
            Jelajahi Barang Ditemukan
          </Link>
        </div>
      </section>
    </div>
  );
}
