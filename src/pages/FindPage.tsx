import { useEffect, useMemo, useRef, useState } from "react";
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
  { value: "SEMUA", label: "Semua" },
  { value: "HILANG", label: "Barang Hilang" },
  { value: "DITEMUKAN", label: "Barang Ditemukan" },
  { value: "SUDAH_KEMBALI", label: "Sudah Kembali" },
];

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
  return String(value).slice(0, 10);
}

function normalizeTime(value: unknown): string {
  if (!value) return "";
  return String(value).slice(0, 5);
}

export default function FindPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("SEMUA");

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [openDropdown, setOpenDropdown] = useState<"category" | "location" | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        !categoryDropdownRef.current?.contains(target) &&
        !locationDropdownRef.current?.contains(target)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function openDatePicker() {
    const input = dateInputRef.current;
    if (!input) return;

    const pickerInput = input as HTMLInputElement & {
      showPicker?: () => void;
    };

    if (pickerInput.showPicker) {
      pickerInput.showPicker();
    } else {
      input.focus();
    }
  }

  async function fetchReports() {
    try {
      setLoading(true);
      setError("");

      const { data, error: reportsError } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (reportsError) throw reportsError;

      if (!Array.isArray(data)) {
        throw new Error("Format data laporan dari Supabase tidak valid.");
      }

      const mappedReports: Report[] = data.map((item: any) => ({
        id: String(item.id),
        type: normalizeType(item.type),
        itemName: item.item_name || "",
        category: item.category || "",
        color: item.color || "",
        description: item.description || "",
        distinctiveFeatures: item.distinctive_features || "",
        date: normalizeDate(item.date_seen),
        time: normalizeTime(item.time_seen),
        location: item.location || "",
        detailLocation: item.location_detail || "",
        status: normalizeStatus(item.status),
        photoUrl: item.image_url ? String(item.image_url) : "",
        reporterName: item.reporter_name || "",
        reporterContact: item.reporter_contact || "",
        createdAt: item.created_at || new Date().toISOString(),
        condition: "BAIK",
      }));

      setReports(mappedReports);
    } catch (err) {
      console.error("Error mengambil laporan:", err);
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data laporan."
      );
    } finally {
      setLoading(false);
    }
  }

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

  const activeFilterCount = [category, location, date].filter(Boolean).length;

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (r.status === "MENUNGGU") return false;

      if (typeFilter === "HILANG" && r.type !== "HILANG") return false;
      if (typeFilter === "DITEMUKAN" && r.type !== "DITEMUKAN") return false;
      if (typeFilter === "SUDAH_KEMBALI" && r.status !== "SUDAH_KEMBALI") return false;

      if (category && r.category !== category) return false;
      if (location && r.location !== location) return false;
      if (date && r.date !== date) return false;

      if (query.trim()) {
        const q = query.trim().toLowerCase();
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

        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [reports, query, typeFilter, category, location, date]);

  if (loading) {
    return (
      <div className="find-page mx-auto max-w-6xl px-4 sm:px-5 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <p className="text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
            Pencarian
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-[26px] font-bold text-[var(--color-navy)]">
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

  if (error) {
    return (
      <div className="find-page mx-auto max-w-6xl px-4 sm:px-5 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8">
          <p className="text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
            Pencarian
          </p>
          <h1 className="mt-1 font-display text-2xl sm:text-[26px] font-bold text-[var(--color-navy)]">
            Temukan Barang
          </h1>
        </div>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <p className="font-display text-[15px] font-semibold text-red-700">
            Gagal mengambil laporan
          </p>
          <p className="mt-2 text-[13px] text-red-600">{error}</p>
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

  return (
    <div className="find-page mx-auto max-w-6xl px-4 sm:px-5 py-6 sm:py-12">
      {/* HEADER */}
      <div className="find-reveal mb-6 sm:mb-8">
        <p className="text-[12px] sm:text-[12.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
          Pencarian
        </p>
        <h1 className="mt-1 font-display text-2xl sm:text-[26px] font-bold text-[var(--color-navy)]">
          Temukan Barang
        </h1>
        <p className="mt-1.5 max-w-2xl text-[12.5px] sm:text-[13px] leading-relaxed text-[var(--color-ink)]/60">
          Cari laporan barang hilang dan barang ditemukan yang telah diverifikasi oleh admin KampusFind.
        </p>
      </div>

      {/* SEARCH DAN FILTER */}
      <div className="find-reveal find-reveal-delay-1 space-y-3.5 sm:space-y-4 relative z-30 overflow-visible">
        <SearchBar value={query} onChange={setQuery} />

        {/* FILTER TIPE (HORIZONTAL SCROLL DI MOBILE) */}
        <div className="find-type-filter">
          <span className="find-filter-heading hidden sm:block">Jenis laporan</span>
          <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {TYPE_TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTypeFilter(t.value)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-[12.5px] sm:text-[13px] font-medium transition-colors flex-shrink-0 ${
                  typeFilter === t.value
                    ? "bg-[var(--color-navy)] text-white"
                    : "bg-[var(--color-sky)] text-[var(--color-navy)]/70 hover:text-[var(--color-navy)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* MOBILE FILTER TRIGGER BUTTON (Hanya Tampil di Mobile) */}
        <div className="block sm:hidden">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm active:bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <span className="text-[13px] font-semibold text-slate-700">Filter Detail</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <span className="text-[12px] font-medium text-blue-600">
              {category || location || date ? "Diubah" : "Atur"}
            </span>
          </button>
        </div>

        {/* DESKTOP FILTER DROPDOWNS (Hanya Tampil di Tablet/Desktop) */}
        <div className="hidden sm:grid gap-3 sm:grid-cols-3">
          {/* KATEGORI */}
          <div ref={categoryDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
              className={`flex w-full flex-col justify-between rounded-xl border p-3 text-left transition-all duration-200 ${
                openDropdown === "category"
                  ? "border-blue-500 ring-2 ring-blue-500/20 bg-white shadow-md"
                  : category
                  ? "border-blue-400 bg-blue-50/20"
                  : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Kategori
              </span>
              <div className="mt-0.5 flex items-center justify-between">
                <strong className="text-[13.5px] font-semibold text-slate-800">
                  {category || "Semua kategori"}
                </strong>
                <svg
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                    openDropdown === "category" ? "rotate-180 text-blue-600" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            {openDropdown === "category" && (
              <div className="absolute left-0 top-full z-[9999] mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95">
                {["", ...CATEGORIES].map((option) => (
                  <button
                    key={option || "all-category"}
                    type="button"
                    onClick={() => {
                      setCategory(option);
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                      category === option
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700 hover:bg-slate-100/80"
                    }`}
                  >
                    <span>{option || "Semua kategori"}</span>
                    {category === option && (
                      <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LOKASI */}
          <div ref={locationDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === "location" ? null : "location")}
              className={`flex w-full flex-col justify-between rounded-xl border p-3 text-left transition-all duration-200 ${
                openDropdown === "location"
                  ? "border-blue-500 ring-2 ring-blue-500/20 bg-white shadow-md"
                  : location
                  ? "border-blue-400 bg-blue-50/20"
                  : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Lokasi
              </span>
              <div className="mt-0.5 flex items-center justify-between">
                <strong className="text-[13.5px] font-semibold text-slate-800">
                  {location || "Semua lokasi"}
                </strong>
                <svg
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                    openDropdown === "location" ? "rotate-180 text-blue-600" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>

            {openDropdown === "location" && (
              <div className="absolute left-0 top-full z-[9999] mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95">
                {["", ...LOCATIONS].map((option) => (
                  <button
                    key={option || "all-location"}
                    type="button"
                    onClick={() => {
                      setLocation(option);
                      setOpenDropdown(null);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                      location === option
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700 hover:bg-slate-100/80"
                    }`}
                  >
                    <span>{option || "Semua lokasi"}</span>
                    {location === option && (
                      <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* TANGGAL */}
          <label className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all duration-200 ${
            date ? "border-blue-400 bg-blue-50/20" : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tanggal
            </span>
            <div className="mt-0.5 flex items-center justify-between">
              <strong className="text-[13.5px] font-semibold text-slate-800">
                {date || "Pilih tanggal"}
              </strong>
              <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none">
                <rect x="3.5" y="5" width="17" height="15.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M7.5 3v4M16.5 3v4M3.5 9h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <input
              ref={dateInputRef}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onClick={openDatePicker}
              aria-label="Filter tanggal"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET MODAL */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end bg-black/50 backdrop-blur-sm sm:hidden animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative z-10 rounded-t-3xl bg-white p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display text-base font-bold text-slate-800">Filter Laporan</h3>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Select Kategori */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[13.5px] font-semibold text-slate-800 outline-none focus:border-blue-500"
              >
                <option value="">Semua Kategori</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Select Lokasi */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lokasi</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[13.5px] font-semibold text-slate-800 outline-none focus:border-blue-500"
              >
                <option value="">Semua Lokasi</option>
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Input Tanggal */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[13.5px] font-semibold text-slate-800 outline-none focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCategory("");
                  setLocation("");
                  setDate("");
                }}
                className="w-1/3 rounded-xl border border-slate-200 py-3 text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-2/3 rounded-xl bg-[var(--color-navy)] py-3 text-[13px] font-semibold text-white shadow-md active:opacity-90"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JUMLAH HASIL */}
      <p className="find-reveal find-reveal-delay-2 mt-5 sm:mt-6 text-[12.5px] sm:text-[13px] text-[var(--color-ink)]/50">
        {filtered.length} laporan ditemukan
      </p>

      {/* HASIL KOSONG */}
      {filtered.length === 0 ? (
        <div className="find-empty card-surface mt-4 flex flex-col items-center gap-2 px-6 py-16 text-center">
          <p className="font-display text-[15px] font-semibold text-[var(--color-navy)]">
            Belum ada laporan yang cocok
          </p>
          <p className="text-[13px] text-[var(--color-ink)]/50">
            Coba ubah kata kunci atau filter pencarian kamu.
          </p>
        </div>
      ) : (
        /* LIST LAPORAN */
        <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
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