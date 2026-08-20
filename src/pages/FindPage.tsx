import { useEffect, useMemo, useState } from "react";
import ItemCard from "../components/ItemCard";
import SearchBar from "../components/SearchBar";
import { CATEGORIES, LOCATIONS } from "../lib/constants";
import { supabase } from "../supabaseClient";
import type { Report, ReportStatus, ReportType } from "../types";

type TypeFilter =
  | "SEMUA"
  | "HILANG"
  | "DITEMUKAN"
  | "SUDAH_KEMBALI";

const TYPE_TABS: {
  value: TypeFilter;
  label: string;
}[] = [
  {
    value: "SEMUA",
    label: "Semua",
  },
  {
    value: "HILANG",
    label: "Barang Hilang",
  },
  {
    value: "DITEMUKAN",
    label: "Barang Ditemukan",
  },
  {
    value: "SUDAH_KEMBALI",
    label: "Sudah Kembali",
  },
];

// =====================================================
// HELPER
// =====================================================

function normalizeType(value: unknown): ReportType {
  return value === "DITEMUKAN" ? "DITEMUKAN" : "HILANG";
}

function normalizeStatus(value: unknown): ReportStatus {
  const validStatuses: ReportStatus[] = [
    "MENUNGGU",
    "DIVERIFIKASI",
    "DITEMUKAN",
    "PROSES_KLAIM",
    "PROSES_PENGEMBALIAN",
    "SUDAH_KEMBALI",
  ];

  if (
    typeof value === "string" &&
    validStatuses.includes(value as ReportStatus)
  ) {
    return value as ReportStatus;
  }

  return "MENUNGGU";
}

function normalizeDate(value: unknown): string {
  if (!value) return "";

  const date = String(value);

  // Kalau dari MySQL bentuknya:
  // 2026-08-18T00:00:00.000Z
  // atau
  // 2026-08-18 00:00:00
  return date.slice(0, 10);
}

function normalizeTime(value: unknown): string {
  if (!value) return "";

  return String(value).slice(0, 5);
}

// =====================================================
// COMPONENT
// =====================================================

export default function FindPage() {
  const [reports, setReports] = useState<Report[]>([]);

  const [query, setQuery] = useState("");

  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>("SEMUA");

  const [category, setCategory] = useState("");

  const [location, setLocation] = useState("");

  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // AMBIL DATA DARI NODE.JS + MYSQL
  // =====================================================

  async function fetchReports() {
    try {
      setLoading(true);
      setError("");

      const { data, error: reportsError } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (reportsError) {
        throw reportsError;
      }

      if (!Array.isArray(data)) {
        throw new Error(
          "Format data laporan dari Supabase tidak valid."
        );
      }

      // =================================================
      // MYSQL SNAKE_CASE
      //        ↓
      // FRONTEND CAMELCASE
      // =================================================

      const mappedReports: Report[] =
        data.map((item: any) => ({
          id: String(item.id),

          type: normalizeType(item.type),

          itemName: item.item_name || "",

          category: item.category || "",

          color: item.color || "",

          description: item.description || "",

          distinctiveFeatures:
            item.distinctive_features || "",

          date: normalizeDate(item.date_seen),

          time: normalizeTime(item.time_seen),

          location: item.location || "",

          detailLocation:
            item.location_detail || "",

          status: normalizeStatus(item.status),

          photoUrl: item.image_url
            ? String(item.image_url)
            : "",

          reporterName:
            item.reporter_name || "",

          reporterContact:
            item.reporter_contact || "",

          createdAt:
            item.created_at ||
            new Date().toISOString(),

          // Field ini tidak tersedia di database
          // sehingga diberi nilai default.
          condition: "BAIK",
        }));

      setReports(mappedReports);
    } catch (err) {
      console.error(
        "Error mengambil laporan:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data laporan."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchReports();

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        fetchReports();
      }
    };

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  // =====================================================
  // FILTER LAPORAN
  // =====================================================

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      // =================================================
      // 1. LAPORAN YANG BELUM DIVERIFIKASI
      // TIDAK DITAMPILKAN KE PUBLIK
      // =================================================

      if (r.status === "MENUNGGU") {
        return false;
      }

      // =================================================
      // 2. FILTER JENIS LAPORAN
      // =================================================

      if (
        typeFilter === "HILANG" &&
        r.type !== "HILANG"
      ) {
        return false;
      }

      if (
        typeFilter === "DITEMUKAN" &&
        r.type !== "DITEMUKAN"
      ) {
        return false;
      }

      if (
        typeFilter === "SUDAH_KEMBALI" &&
        r.status !== "SUDAH_KEMBALI"
      ) {
        return false;
      }

      // =================================================
      // 3. FILTER KATEGORI
      // =================================================

      if (
        category &&
        r.category !== category
      ) {
        return false;
      }

      // =================================================
      // 4. FILTER LOKASI
      // =================================================

      if (
        location &&
        r.location !== location
      ) {
        return false;
      }

      // =================================================
      // 5. FILTER TANGGAL
      // =================================================

      if (
        date &&
        r.date !== date
      ) {
        return false;
      }

      // =================================================
      // 6. SEARCH
      // =================================================

      if (query.trim()) {
        const q = query
          .trim()
          .toLowerCase();

        const haystack = [
          r.itemName,
          r.category,
          r.color,
          r.location,
          r.detailLocation,
          r.description,
          r.distinctiveFeatures,
          r.type,
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [
    reports,
    query,
    typeFilter,
    category,
    location,
    date,
  ]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="find-page mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8">
          <p className="text-[12.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
            Pencarian
          </p>

          <h1 className="mt-1.5 font-display text-[26px] font-bold text-[var(--color-navy)]">
            Temukan Barang
          </h1>
        </div>

        <div className="card-surface flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="font-display text-[15px] font-semibold text-[var(--color-navy)]">
            Memuat laporan...
          </p>

          <p className="mt-1 text-[13px] text-[var(--color-ink)]/50">
            Sedang mengambil data dari server.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="find-page mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8">
          <p className="text-[12.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
            Pencarian
          </p>

          <h1 className="mt-1.5 font-display text-[26px] font-bold text-[var(--color-navy)]">
            Temukan Barang
          </h1>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <p className="font-display text-[15px] font-semibold text-red-700">
            Gagal mengambil laporan
          </p>

          <p className="mt-2 text-[13px] text-red-600">
            {error}
          </p>

          <p className="mt-4 text-[12px] text-red-500">
            Pastikan URL API dan database backend
            sudah aktif.
          </p>

          <button
            type="button"
            onClick={fetchReports}
            className="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-red-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // HALAMAN UTAMA
  // =====================================================

  return (
    <div className="find-page mx-auto max-w-6xl px-5 py-12">
      {/* HEADER */}

      <div className="find-reveal mb-8">
        <p className="text-[12.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
          Pencarian
        </p>

        <h1 className="mt-1.5 font-display text-[26px] font-bold text-[var(--color-navy)]">
          Temukan Barang
        </h1>

        <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-[var(--color-ink)]/60">
          Cari laporan barang hilang dan barang
          ditemukan yang telah diverifikasi oleh
          admin KampusFind.
        </p>
      </div>

      {/* SEARCH DAN FILTER */}

      <div className="find-reveal find-reveal-delay-1 space-y-4">
        <SearchBar
          value={query}
          onChange={setQuery}
        />

        {/* FILTER TIPE */}

        <div className="flex flex-wrap gap-2">
          {TYPE_TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() =>
                setTypeFilter(t.value)
              }
              className={`rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors ${
                typeFilter === t.value
                  ? "bg-[var(--color-navy)] text-white"
                  : "bg-[var(--color-sky)] text-[var(--color-navy)]/70 hover:text-[var(--color-navy)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* FILTER DETAIL */}

        <div className="grid gap-3 sm:grid-cols-3">
          {/* KATEGORI */}

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="focus-ring rounded-xl border border-[var(--color-line)] bg-white p-2.5 text-[13px] outline-none"
          >
            <option value="">
              Semua kategori
            </option>

            {CATEGORIES.map((c) => (
              <option
                key={c}
                value={c}
              >
                {c}
              </option>
            ))}
          </select>

          {/* LOKASI */}

          <select
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="focus-ring rounded-xl border border-[var(--color-line)] bg-white p-2.5 text-[13px] outline-none"
          >
            <option value="">
              Semua lokasi
            </option>

            {LOCATIONS.map((l) => (
              <option
                key={l}
                value={l}
              >
                {l}
              </option>
            ))}
          </select>

          {/* TANGGAL */}

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="focus-ring rounded-xl border border-[var(--color-line)] bg-white p-2.5 text-[13px] outline-none"
          />
        </div>
      </div>

      {/* JUMLAH HASIL */}

      <p className="find-reveal find-reveal-delay-2 mt-6 text-[13px] text-[var(--color-ink)]/50">
        {filtered.length} laporan ditemukan
      </p>

      {/* HASIL KOSONG */}

      {filtered.length === 0 ? (
        <div className="find-empty card-surface mt-4 flex flex-col items-center gap-2 px-6 py-16 text-center">
          <p className="font-display text-[15px] font-semibold text-[var(--color-navy)]">
            Belum ada laporan yang cocok
          </p>

          <p className="text-[13px] text-[var(--color-ink)]/50">
            Coba ubah kata kunci atau filter
            pencarian kamu.
          </p>
        </div>
      ) : (
        /* LIST LAPORAN */

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, index) => (
            <div
              key={r.id}
              className="find-card-reveal"
              style={{ animationDelay: `${Math.min(index, 5) * 55}ms` }}
            >
              <ItemCard report={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}