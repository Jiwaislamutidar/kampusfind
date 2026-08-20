import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ClaimModal from "../components/ClaimModal";
import SmartMatch from "../components/SmartMatch";
import StatusBadge from "../components/StatusBadge";
import type { Report } from "../index";
import { supabase } from "../supabaseClient";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const justSubmitted =
    searchParams.get("submitted") === "1";

  const [report, setReport] =
    useState<Report | null>(null);

  const [claimOpen, setClaimOpen] =
    useState(false);

  const [claimSent, setClaimSent] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // AMBIL DETAIL LAPORAN DARI BACKEND
  // =====================================================

  useEffect(() => {
    async function fetchReport() {
      if (!id) {
        setError("ID laporan tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data: item, error: reportError } = await supabase
          .from("reports")
          .select("*")
          .eq("id", id)
          .single();

        if (reportError || !item) {
          throw reportError || new Error("Laporan tidak ditemukan.");
        }

        // =================================================
        // MYSQL SNAKE_CASE -> FRONTEND CAMEL_CASE
        // =================================================

        const mappedReport: Report = {
          id: String(item.id),

          type: item.type,

          itemName:
            item.item_name || "",

          category:
            item.category || "",

          color:
            item.color || "",

          description:
            item.description || "",

          distinctiveFeatures:
            item.distinctive_features || "",

          date: item.date_seen
            ? String(item.date_seen).slice(0, 10)
            : "",

          time: item.time_seen
            ? String(item.time_seen)
            : "",

          location:
            item.location || "",

          detailLocation:
            item.location_detail || "",

          reporterName:
            item.reporter_name || "",

          reporterContact:
            item.reporter_contact || "",

          /*
           * Database kamu saat ini belum memiliki
           * kolom condition.
           *
           * Jadi sementara gunakan BAIK sebagai
           * nilai default supaya sesuai dengan
           * interface Report.
           */
          condition:
            item.condition || "BAIK",

          /*
           * Database kamu juga belum memiliki
           * kolom storage.
           *
           * Karena property ini optional, cukup
           * tidak dimasukkan dulu.
           */

          photoUrl: item.image_url
            ? String(item.image_url)
            : "",

          status:
            item.status || "MENUNGGU",

          createdAt:
            item.created_at ||
            new Date().toISOString(),

          updatedAt:
            item.updated_at || undefined,
        };

        setReport(mappedReport);
      } catch (err) {
        console.error(
          "Error mengambil detail laporan:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil detail laporan."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-24 text-center">
        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <p className="font-display text-[17px] font-bold text-[var(--color-navy)]">
          Memuat detail barang...
        </p>

        <p className="mt-2 text-[13px] text-[var(--color-ink)]/50">
          Sedang mengambil data dari server.
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR / DATA TIDAK DITEMUKAN
  // =====================================================

  if (error || !report) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10">
          <p className="font-display text-[18px] font-bold text-red-700">
            Laporan tidak ditemukan
          </p>

          <p className="mt-2 text-[13px] text-red-600">
            {error ||
              "Data laporan tidak tersedia."}
          </p>

          <Link
            to="/temukan"
            className="mt-5 inline-block rounded-xl bg-[var(--color-navy)] px-5 py-2.5 text-[13px] font-semibold text-white"
          >
            ← Kembali ke Temukan Barang
          </Link>
        </div>
      </div>
    );
  }

  // =====================================================
  // FORMAT TANGGAL
  // =====================================================

  const formattedDate = report.date
    ? new Date(
        `${report.date}T00:00:00`
      ).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">

      {/* =================================================
          NOTIFIKASI LAPORAN
      ================================================= */}

      {justSubmitted && (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
              ✓
            </div>
            <div>
              <h3 className="font-display text-[16px] font-bold text-emerald-900">
                Laporan Berhasil Terkirim!
              </h3>
              <p className="mt-1 text-[13.5px] font-medium leading-relaxed text-emerald-800">
                {report.type === "HILANG"
                  ? "Terimakasih Sudah Melapor,Semoga Segera Ditemukan Melalui Website Kami!"
                  : "Terimakasih Sudah Menemukan Barang Dan Mengamankannya"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          NOTIFIKASI KLAIM
      ================================================= */}

      {claimSent && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13.5px] text-emerald-700">
          Klaim kamu sudah terkirim dan menunggu
          verifikasi admin.
        </div>
      )}

      {/* =================================================
          BACK
      ================================================= */}

      <Link
        to="/temukan"
        className="text-[13px] font-medium text-[var(--color-royal)] hover:underline"
      >
        ← Kembali ke Temukan Barang
      </Link>

      {/* =================================================
          DETAIL
      ================================================= */}

      <div className="mt-4 grid gap-8 md:grid-cols-[1fr_1.1fr]">

        {/* =================================================
            FOTO
        ================================================= */}

        <div>
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-sky)]">

            {report.photoUrl ? (
              <img
                src={report.photoUrl}
                alt={report.itemName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  x="3"
                  y="7"
                  width="18"
                  height="13"
                  rx="2"
                  stroke="var(--color-royal)"
                  strokeWidth="1.4"
                />

                <path
                  d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7"
                  stroke="var(--color-royal)"
                  strokeWidth="1.4"
                />

                <circle
                  cx="12"
                  cy="13"
                  r="2.4"
                  stroke="var(--color-cyan)"
                  strokeWidth="1.4"
                />
              </svg>
            )}

          </div>
        </div>

        {/* =================================================
            INFORMASI BARANG
        ================================================= */}

        <div>

          {/* TYPE */}

          <span
            className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide ${
              report.type === "HILANG"
                ? "bg-[var(--color-navy)] text-white"
                : "bg-[var(--color-cyan)] text-[var(--color-navy)]"
            }`}
          >
            {report.type === "HILANG"
              ? "BARANG HILANG"
              : "BARANG DITEMUKAN"}
          </span>

          {/* NAMA */}

          <h1 className="mt-3 font-display text-[24px] font-bold text-[var(--color-navy)]">
            {report.itemName}
          </h1>

          {/* STATUS */}

          <div className="mt-2">
            <StatusBadge
              status={report.status}
            />
          </div>

          {/* =================================================
              DATA BARANG
          ================================================= */}

          <dl className="mt-6 space-y-3 text-[13.5px]">

            {/* KATEGORI */}

            <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-3">
              <dt className="text-[var(--color-ink)]/50">
                Kategori
              </dt>

              <dd className="text-right font-medium text-[var(--color-navy)]">
                {report.category || "-"}
              </dd>
            </div>

            {/* WARNA */}

            <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-3">
              <dt className="text-[var(--color-ink)]/50">
                Warna
              </dt>

              <dd className="text-right font-medium text-[var(--color-navy)]">
                {report.color || "-"}
              </dd>
            </div>

            {/* LOKASI */}

            <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-3">
              <dt className="text-[var(--color-ink)]/50">
                Lokasi
              </dt>

              <dd className="text-right font-medium text-[var(--color-navy)]">
                {report.location || "-"}

                {report.detailLocation &&
                report.detailLocation !== "-"
                  ? ` · ${report.detailLocation}`
                  : ""}
              </dd>
            </div>

            {/* TANGGAL */}

            <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-3">
              <dt className="text-[var(--color-ink)]/50">
                Tanggal & jam
              </dt>

              <dd className="text-right font-medium text-[var(--color-navy)]">
                {formattedDate}

                {report.time
                  ? ` · ${report.time}`
                  : ""}
              </dd>
            </div>

            {/* KONDISI */}

            <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-3">
              <dt className="text-[var(--color-ink)]/50">
                Kondisi
              </dt>

              <dd className="text-right font-medium text-[var(--color-navy)]">
                {report.condition ===
                "RUSAK_RINGAN"
                  ? "Rusak Ringan"
                  : report.condition ===
                      "RUSAK_BERAT"
                    ? "Rusak Berat"
                    : "Baik"}
              </dd>
            </div>

          </dl>

          {/* =================================================
              DESKRIPSI
          ================================================= */}

          <div className="mt-5">

            <p className="text-[13px] font-semibold text-[var(--color-navy)]">
              Deskripsi
            </p>

            <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--color-ink)]/65">
              {report.description || "-"}
            </p>

          </div>

          {/* =================================================
              CIRI KHUSUS
          ================================================= */}

          {report.distinctiveFeatures && (
            <div className="mt-4">

              <p className="text-[13px] font-semibold text-[var(--color-navy)]">
                Ciri-ciri khusus
              </p>

              <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--color-ink)]/65">
                {report.distinctiveFeatures}
              </p>

            </div>
          )}

          {/* =================================================
              KLAIM
          ================================================= */}

          {report.type === "DITEMUKAN" &&
            report.status !== "SUDAH_KEMBALI" && (
              <button
                type="button"
                onClick={() =>
                  setClaimOpen(true)
                }
                className="mt-7 w-full rounded-xl bg-[var(--color-royal)] py-3.5 text-[14px] font-semibold text-white hover:bg-[var(--color-royal-2)] sm:w-auto sm:px-6"
              >
                Ini Barang Saya
              </button>
            )}

        </div>
      </div>

      {/* =================================================
          SMART MATCH
      ================================================= */}

      {report.type === "HILANG" && (
        <div className="mt-14">

          <div className="mb-4 flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-[var(--color-cyan)]" />

            <h2 className="font-display text-[17px] font-bold text-[var(--color-navy)]">
              Smart Match — Kemungkinan Cocok
            </h2>

          </div>

          <SmartMatch matches={[]} />

        </div>
      )}

      {/* =================================================
          CLAIM MODAL
      ================================================= */}

      {claimOpen && (
        <ClaimModal
          report={report}
          onClose={() =>
            setClaimOpen(false)
          }
          onSubmitted={() =>
            setClaimSent(true)
          }
        />
      )}

    </div>
  );
}