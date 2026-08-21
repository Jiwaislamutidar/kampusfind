import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconArrowRight,
  IconCheck,
  IconChevronRight,
  IconMapPin,
  IconRadar,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import { supabase } from "../supabaseClient";

const STEPS = [
  {
    n: "01",
    title: "Laporkan",
    desc: "Catat barang dan lokasi terakhirnya dalam kurang dari dua menit.",
  },
  {
    n: "02",
    title: "Temukan",
    desc: "Telusuri laporan berdasarkan nama barang, lokasi, atau kategori.",
  },
  {
    n: "03",
    title: "Smart Match",
    desc: "Sistem membantu menemukan laporan yang punya ciri paling mirip.",
  },
  {
    n: "04",
    title: "Kembalikan",
    desc: "Jawab pertanyaan verifikasi sebelum barang diserahkan dengan aman.",
  },
];

type RecentActivity = {
  id: string;
  item: string;
  location: string;
  time: string;
  status: string;
  tone: "blue" | "cyan" | "green";
};

function formatRelativeTime(createdAt: string) {
  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
  );

  if (elapsedMinutes < 1) return "Baru saja";
  if (elapsedMinutes < 60) return `${elapsedMinutes} menit lalu`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} jam lalu`;

  return `${Math.floor(elapsedHours / 24)} hari lalu`;
}

const TRUST_POINTS = [
  {
    label: "01 / Verifikasi",
    title: "Barang tidak langsung berpindah tangan.",
    desc: "Pertanyaan klaim membantu memastikan barang kembali kepada pemilik yang tepat.",
    tone: "cyan",
  },
  {
    label: "02 / Privasi",
    title: "Informasi sensitif tetap terlindungi.",
    desc: "Detail lokasi penyimpanan hanya terlihat oleh pihak yang perlu mengetahuinya.",
    tone: "lime",
  },
  {
    label: "03 / Terpantau",
    title: "Setiap langkah punya status.",
    desc: "Pelapor dapat mengikuti proses dari laporan dibuat hingga barang dikembalikan.",
    tone: "blue",
  },
];

export default function HomePage() {
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchRecentActivity() {
      const { data } = await supabase
        .from("reports")
        .select("id, type, item_name, location, created_at, status")
        .order("created_at", { ascending: false })
        .limit(3);

      if (!isMounted || !data) return;

      setRecentActivity(
        data.map((report) => {
          const isFound = report.type === "DITEMUKAN";
          const isReturned = report.status === "SUDAH_KEMBALI";

          return {
            id: String(report.id),
            item: report.item_name || "Barang tanpa nama",
            location: report.location || "Lokasi belum diisi",
            time: formatRelativeTime(report.created_at),
            status: isReturned ? "Kembali" : isFound ? "Ditemukan" : "Dicari",
            tone: isReturned ? "green" : isFound ? "cyan" : "blue",
          };
        })
      );
    }

    fetchRecentActivity();
    const refreshTimer = window.setInterval(fetchRecentActivity, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('.home-scroll-reveal');

    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page overflow-hidden">
      <section className="home-scroll-reveal home-hero relative border-b border-[var(--color-line)] bg-[var(--color-navy)] text-white">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.1]" />
        <div className="home-signal-lines pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 opacity-60 lg:block" />
        <div className="home-hero-content relative mx-auto grid max-w-6xl gap-12 px-5 pb-14 pt-24 md:grid-cols-[1fr_0.78fr] md:items-center md:pb-20 md:pt-28">
          <div className="home-reveal home-reveal-delay-1">
            <h1 className="mt-6 max-w-xl font-display text-[40px] font-bold leading-[1.06] tracking-tight sm:text-[56px]">
              Satu barang kembali, Satu kampus lebih peduli.
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/65">
              Laporkan kehilangan, temukan barang tertinggal, dan ikuti prosesnya sampai kembali ke tangan yang tepat.
            </p>

            <div className="mt-8 flex max-w-xl items-center gap-3 border-b border-white/20 pb-3">
              <IconSearch className="shrink-0 text-[var(--color-cyan)]" size={21} />
              <span className="flex-1 text-[14px] text-white/45">Cari “dompet”, “KTM”, atau “gedung B”</span>
              <Link to="/temukan" className="group flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--color-cyan)] px-3.5 py-2 text-[12px] font-bold text-[var(--color-navy)] transition-colors hover:bg-white">
                Cari <IconArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-[12px] text-white/50">
              <span className="flex items-center gap-2"><IconShieldCheck size={16} className="text-[var(--color-cyan)]" /> Klaim terverifikasi</span>
              <span className="flex items-center gap-2"><IconRadar size={16} className="text-[var(--color-cyan)]" /> Smart Match aktif</span>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 border-t border-white/10 pt-4">
              <div><p className="home-stat-value home-stat-value-1 font-display text-[20px] font-bold text-white">24</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/40">Laporan aktif</p></div>
              <div className="border-l border-white/10 pl-4"><p className="home-stat-value home-stat-value-2 font-display text-[20px] font-bold text-[var(--color-cyan)]">08</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/40">Cocok hari ini</p></div>
              <div className="border-l border-white/10 pl-4"><p className="home-stat-value home-stat-value-3 font-display text-[20px] font-bold text-lime-300">91%</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/40">Terverifikasi</p></div>
            </div>
          </div>

          <div className="home-reveal home-reveal-delay-2 relative md:pl-4">
            <div className="absolute -left-2 top-8 hidden h-px w-12 bg-[var(--color-cyan)]/40 md:block" />
            <div className="border border-white/15 bg-[var(--color-navy-2)]/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-6">
              <div className="flex items-start justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">Aktivitas terkini</p>
                  <p className="mt-2 font-display text-[23px] font-semibold">Yang sedang dicari</p>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-cyan)]"><span className="home-live-dot h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)]" /> Live</span>
              </div>
              <div className="divide-y divide-white/10">
                {recentActivity.length > 0 ? recentActivity.map((activity) => (
                  <Link to={`/barang/${activity.id}`} key={activity.id} className="home-reveal home-reveal-delay-3 group flex gap-3 py-4 first:pt-5 last:pb-1">
                    <span className={`home-activity-marker home-activity-marker-${activity.tone} mt-1 h-2.5 w-2.5 shrink-0 rounded-full`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-white/90 group-hover:text-[var(--color-cyan)]">{activity.item}</span>
                      <span className="mt-1 flex items-center gap-2 text-[11px] text-white/45"><IconMapPin size={13} /> {activity.location}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1 text-[10px] text-white/35"><span>{activity.time}</span><span className={`home-activity-label home-activity-label-${activity.tone}`}>{activity.status}</span></span>
                  </Link>
                )) : (
                  <p className="py-6 text-[12px] text-white/45">Belum ada aktivitas terbaru.</p>
                )}
              </div>
              <Link to="/temukan" className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[12px] font-semibold text-[var(--color-cyan)]">
                Lihat semua laporan <IconChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-scroll-reveal home-action-section border-b border-[var(--color-line)]">
        <div className="mx-auto grid max-w-6xl gap-3 px-5 py-6 sm:grid-cols-3">
          <Link to="/lapor/hilang" className="home-side-reveal home-side-reveal-left home-action-card home-reveal home-reveal-delay-1 group flex items-center gap-4 border border-[var(--color-line)] p-4 transition-[border-color,background-color] duration-300 hover:border-[var(--color-royal)] hover:bg-[var(--color-sky)]/30">
            <span className="home-action-number home-action-number-warn flex h-10 w-10 items-center justify-center font-display text-[18px] font-bold">01</span>
            <span className="flex-1"><span className="block text-[13px] font-bold text-[var(--color-navy)]">Saya kehilangan barang</span><span className="mt-1 block text-[11px] text-[var(--color-ink)]/55">Buat laporan baru</span></span>
            <IconArrowRight size={17} className="text-[var(--color-royal)] transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/lapor/ditemukan" className="home-side-reveal home-side-reveal-center home-action-card home-reveal home-reveal-delay-2 group flex items-center gap-4 border border-[var(--color-line)] p-4 transition-[border-color,background-color] duration-300 hover:border-[var(--color-royal)] hover:bg-[var(--color-sky)]/30">
            <span className="home-action-number home-action-number-success flex h-10 w-10 items-center justify-center font-display text-[18px] font-bold">02</span>
            <span className="flex-1"><span className="block text-[13px] font-bold text-[var(--color-navy)]">Saya menemukan barang</span><span className="mt-1 block text-[11px] text-[var(--color-ink)]/55">Bantu pemilik menemukannya</span></span>
            <IconArrowRight size={17} className="text-[var(--color-royal)] transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/temukan" className="home-side-reveal home-side-reveal-right home-action-card home-reveal home-reveal-delay-3 group flex items-center gap-4 border border-[var(--color-line)] p-4 transition-[border-color,background-color] duration-300 hover:border-[var(--color-royal)] hover:bg-[var(--color-sky)]/30">
            <span className="home-action-number home-action-number-info flex h-10 w-10 items-center justify-center font-display text-[18px] font-bold">03</span>
            <span className="flex-1"><span className="block text-[13px] font-bold text-[var(--color-navy)]">Saya sedang mencari</span><span className="mt-1 block text-[11px] text-[var(--color-ink)]/55">Jelajahi semua laporan</span></span>
            <IconArrowRight size={17} className="text-[var(--color-royal)] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="home-scroll-reveal home-process-section border-b border-[var(--color-line)] bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-24">
          <div className="home-side-reveal home-side-reveal-left home-reveal home-reveal-delay-1">
            <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--color-royal)]"><IconSparkles size={15} /> Dibuat untuk situasi nyata</p>
            <h2 className="mt-4 max-w-md font-display text-[30px] font-bold leading-tight text-[var(--color-navy)] sm:text-[38px]">Dari panik menjadi proses yang jelas.</h2>
            <p className="mt-5 max-w-md text-[14px] leading-7 text-[var(--color-ink)]/60">KampusFind membantu kamu tahu harus mulai dari mana, apa yang terjadi berikutnya, dan kapan barang bisa diambil.</p>
            <Link to="/temukan" className="mt-8 inline-flex items-center gap-2 text-[13px] font-bold text-[var(--color-royal)] transition-colors hover:text-[var(--color-royal-2)]">Lihat laporan terbaru <IconArrowRight size={17} /></Link>
            <div className="mt-12 hidden border-t border-[var(--color-line)] pt-4 sm:block">
            </div>
          </div>
          <div className="home-side-reveal home-side-reveal-right home-process-rail">
            {TRUST_POINTS.map((point, index) => (
              <div key={point.label} className={`home-process-step home-reveal home-reveal-delay-${index + 1}`}>
                <div className={`home-process-number home-process-number-${point.tone}`}>{String(index + 1).padStart(2, "0")}</div>
                <div className="min-w-0 flex-1">
                  <p className={`home-process-label home-process-label-${point.tone}`}>{point.label}</p>
                  <h3 className="mt-2 font-display text-[18px] font-bold leading-snug text-[var(--color-navy)] sm:text-[20px]">{point.title}</h3>
                  <p className="mt-2 max-w-lg text-[13px] leading-6 text-[var(--color-ink)]/60">{point.desc}</p>
                </div>
                <IconCheck className={`home-process-check home-process-check-${point.tone} hidden shrink-0 sm:block`} size={18} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-scroll-reveal home-flow-section border-y border-[var(--color-line)]">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="home-side-reveal home-side-reveal-left"><p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--color-royal)]">Alur yang jelas</p><h2 className="mt-3 font-display text-[28px] font-bold text-[var(--color-navy)] sm:text-[34px]">Dari laporan sampai kembali</h2></div>
            <p className="home-side-reveal home-side-reveal-right max-w-xs text-[13px] leading-6 text-[var(--color-ink)]/55">Semua pihak tahu langkah berikutnya, tanpa perlu menebak-nebak.</p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.n} className={`home-side-reveal ${index % 2 === 0 ? "home-side-reveal-left" : "home-side-reveal-right"} home-reveal home-reveal-delay-${index + 1} relative border-t-2 border-[var(--color-royal)] pt-4`}>
                <span className="font-mono text-[11px] font-bold text-[var(--color-royal)]">{step.n}</span>
                <h3 className="mt-3 font-display text-[16px] font-bold text-[var(--color-navy)]">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-[var(--color-ink)]/60">{step.desc}</p>
                {index < STEPS.length - 1 && <IconChevronRight className="absolute -right-5 top-[-11px] hidden text-[var(--color-royal)]/40 md:block" size={20} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-scroll-reveal mx-auto max-w-6xl px-5 py-20">
        <div className="home-reveal relative overflow-hidden bg-[var(--color-royal)] px-6 py-10 text-white sm:px-12 sm:py-12">
          <div className="pointer-events-none absolute -right-12 -top-20 h-60 w-60 rounded-full border-[28px] border-white/10" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="home-side-reveal home-side-reveal-left"><p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-cyan)]">Jangan tunggu terlalu lama</p><h2 className="mt-3 max-w-lg font-display text-[28px] font-bold leading-tight sm:text-[34px]">Satu laporan kecil bisa mempercepat kepulangan barang.</h2></div>
            <div className="home-side-reveal home-side-reveal-right flex shrink-0 flex-col gap-3 sm:flex-row"><Link to="/lapor/hilang" className="inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-[13px] font-bold text-[var(--color-royal)] transition-colors hover:bg-[var(--color-cyan)]">Lapor sekarang <IconArrowRight size={17} /></Link><Link to="/temukan" className="inline-flex items-center justify-center gap-2 border border-white/30 px-5 py-3 text-[13px] font-bold text-white transition-colors hover:bg-white/10">Cari barang</Link></div>
          </div>
        </div>
      </section>
    </div>
  );
}
