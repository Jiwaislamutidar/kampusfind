import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import VerificationCard from '../components/VerificationCard';
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import { STATUS_LABEL } from "../lib/constants";
import {
  getClaims,
  resetDemoData,
  updateClaimStatus,
} from "../lib/store";
import { supabase } from "../supabaseClient";

import type { ReportStatus } from "../index";

const STATUS_OPTIONS: ReportStatus[] = [
  "MENUNGGU",
  "DIVERIFIKASI",
  "DITEMUKAN",
  "PROSES_KLAIM",
  "PROSES_PENGEMBALIAN",
  "SUDAH_KEMBALI",
];

type DatabaseReport = {
  id: number;
  type: "HILANG" | "DITEMUKAN";
  item_name: string;
  category: string;
  color: string | null;
  description: string | null;
  distinctive_features: string | null;
  date_seen: string | null;
  time_seen: string | null;
  location: string;
  location_detail: string | null;
  status: ReportStatus;
  image_url: string | null;
  reporter_name: string | null;
  reporter_contact: string | null;
  created_at: string;
  updated_at: string;
};

export default function AdminPage() {
  const navigate = useNavigate();

  // ==========================================
  // CEK APAKAH ADMIN SUDAH LOGIN
  // ==========================================
  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("adminLoggedIn") === "true" ||
      sessionStorage.getItem("adminLoggedIn") === "true";

    if (!isLoggedIn) {
      navigate("/login/admin", { replace: true });
    }
  }, [navigate]);

  // ==========================================
  // STATE DATA REPORTS DARI DATABASE
  // ==========================================
  const [reports, setReports] = useState<DatabaseReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorReports, setErrorReports] = useState("");

  // ==========================================
  // REFRESH KEY
  // ==========================================
  const [refreshKey, setRefreshKey] = useState(0);

  // ==========================================
  // AMBIL REPORTS DARI MYSQL
  // ==========================================
  useEffect(() => {
    async function fetchReports() {
      try {
        setLoadingReports(true);
        setErrorReports("");

        const { data, error: reportsError } = await supabase
          .from("reports")
          .select("*")
          .order("created_at", { ascending: false });

        if (reportsError) {
          throw reportsError;
        }

        setReports(data || []);
      } catch (error) {
        console.error(
          "Error mengambil reports:",
          error
        );

        setErrorReports(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data laporan"
        );
      } finally {
        setLoadingReports(false);
      }
    }

    fetchReports();
  }, [refreshKey]);

  // ==========================================
  // CLAIMS
  // ==========================================
  const claims = useMemo(() => {
    return getClaims();
  }, [refreshKey]);

  // ==========================================
  // STATISTIK
  // ==========================================
  const total = reports.length;

  const hilang = reports.filter(
    (r) => r.type === "HILANG"
  ).length;

  const ditemukan = reports.filter(
    (r) => r.type === "DITEMUKAN"
  ).length;

  const kembali = reports.filter(
    (r) => r.status === "SUDAH_KEMBALI"
  ).length;

  // ==========================================
  // REFRESH
  // ==========================================
  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  // ==========================================
  // UBAH STATUS LAPORAN
  // ==========================================
  async function handleStatusChange(
    id: number,
    status: ReportStatus
  ) {
    try {
      const { error: updateError } = await supabase
        .from("reports")
        .update({ status })
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      // Ambil ulang data dari database
      refresh();
    } catch (error) {
      console.error(
        "Error update status:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui status laporan"
      );
    }
  }

  // ==========================================
  // TERIMA / TOLAK KLAIM
  // ==========================================
  function handleClaim(
    id: string,
    status: "DISETUJUI" | "DITOLAK"
  ) {
    console.log("CLAIM DIUPDATE:", {
      id,
      status,
    });

    updateClaimStatus(id, status);
    refresh();
  }

  // ==========================================
  // CARI NAMA BARANG
  // ==========================================
  function reportName(reportId: string) {
    const report = reports.find(
      (r) => String(r.id) === reportId
    );

    return report?.item_name ?? reportId;
  }

  // ==========================================
  // LOGOUT
  // ==========================================
  function handleLogout() {
    localStorage.removeItem("adminLoggedIn");
    sessionStorage.removeItem("adminLoggedIn");

    navigate("/login/admin", { replace: true });
  }

  // ==========================================
  // RESET DATA
  // ==========================================
  function handleResetData() {
    resetDemoData();
    refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">

      {/* =====================================
          HEADER
      ===================================== */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">

        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
            Panel Admin
          </p>

          <h1 className="mt-1.5 font-display text-[24px] font-bold text-[var(--color-navy)]">
            Dashboard KampusFind
          </h1>
        </div>

        <div className="flex gap-2">

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[var(--color-line)] px-3.5 py-2 text-[12.5px] font-medium text-[var(--color-ink)]/60 hover:bg-[var(--color-sky)]"
          >
            Logout
          </button>

          {/* RESET DATA */}
          <button
            type="button"
            onClick={handleResetData}
            className="rounded-lg border border-[var(--color-line)] px-3.5 py-2 text-[12.5px] font-medium text-[var(--color-ink)]/60 hover:bg-[var(--color-sky)]"
          >
            Reset data demo
          </button>

        </div>
      </div>

      {/* =====================================
          STATISTIK
      ===================================== */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatsCard
          value={total}
          label="Total Laporan"
          accent
        />

        <StatsCard
          value={hilang}
          label="Barang Hilang"
        />

        <StatsCard
          value={ditemukan}
          label="Barang Ditemukan"
        />

        <StatsCard
          value={kembali}
          label="Berhasil Kembali"
        />

      </div>

      {/* =====================================
          ERROR DATABASE
      ===================================== */}
      {errorReports && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {errorReports}
        </div>
      )}

      {/* =====================================
          LOADING
      ===================================== */}
      {loadingReports && (
        <div className="mt-6 rounded-xl border border-[var(--color-line)] bg-white px-4 py-3 text-[13px] text-[var(--color-ink)]/60">
          Memuat laporan dari database...
        </div>
      )}

      {/* =====================================
          KLAIM MENUNGGU VERIFIKASI
      ===================================== */}
      {claims.filter(
        (c) => c.status === "MENUNGGU_VERIFIKASI"
      ).length > 0 && (

        <section className="mt-12">

          <h2 className="mb-4 font-display text-[16px] font-bold text-[var(--color-navy)]">
            Klaim Menunggu Verifikasi
          </h2>

          <div className="space-y-3">

            {claims
              .filter((c) => c.status === "MENUNGGU_VERIFIKASI")
              .map((c: any) => (

                <VerificationCard
                  key={c.id}

                  claim={{
                    // ID KLAIM
                    // Dipakai oleh tombol Setujui / Tolak
                    id: String(c.id),

                    // reportId tetap dipakai untuk mencari nama barang
                    itemName:
                      reportName(
                        String(
                          c.reportId ||
                          c.report_id ||
                          ""
                        )
                      ) ||
                      c.item_name ||
                      "Barang Temuan",

                    category:
                      c.category ||
                      "Umum",

                    dateFound:
                      c.created_at ||
                      c.date ||
                      new Date().toISOString(),

                    claimantName:
                      c.claimantName ||
                      c.claimant_name ||
                      "Pengklaim",

                    claimantStatus:
                      "Mahasiswa Aktif",

                    claimantPhone:
                      c.claimantContact ||
                      c.claimantPhone ||
                      "-",

                    featureAnswer:
                      c.answers?.find(
                        (a: any) =>
                          a.question
                            ?.toLowerCase()
                            .includes("ciri")
                      )?.answer ||
                      c.answers?.[0]?.answer ||
                      "-",

                    locationAnswer:
                      c.answers?.find(
                        (a: any) =>
                          a.question
                            ?.toLowerCase()
                            .includes("lokasi")
                      )?.answer ||
                      c.answers?.[1]?.answer ||
                      "-",

                    itemImage:
                      c.image_url ||
                      c.imageUrl ||
                      null,
                  }}

                  onApprove={(id) =>
                    handleClaim(
                      String(id),
                      "DISETUJUI"
                    )
                  }

                  onReject={(id) =>
                    handleClaim(
                      String(id),
                      "DITOLAK"
                    )
                  }

                  onViewDetail={(id) =>
                    navigate(`/barang/${id}`)
                  }
                />

              ))}

          </div>
        </section>
      )}

      {/* =====================================
          SEMUA LAPORAN
      ===================================== */}
      <section className="mt-12">

        <h2 className="mb-4 font-display text-[16px] font-bold text-[var(--color-navy)]">
          Semua Laporan
        </h2>

        <div className="card-surface overflow-x-auto">

          <table className="w-full min-w-[720px] text-left text-[13px]">

            <thead>

              <tr className="border-b border-[var(--color-line)] text-[11.5px] uppercase tracking-wide text-[var(--color-ink)]/45">

                <th className="px-4 py-3 font-medium">
                  ID
                </th>

                <th className="px-4 py-3 font-medium">
                  Barang
                </th>

                <th className="px-4 py-3 font-medium">
                  Tipe
                </th>

                <th className="px-4 py-3 font-medium">
                  Lokasi
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>

                <th className="px-4 py-3 font-medium">
                  Ubah status
                </th>

              </tr>

            </thead>

            <tbody>

              {reports.map((r) => (

                <tr
                  key={r.id}
                  className="border-b border-[var(--color-line)] last:border-0"
                >

                  {/* ID */}
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-[var(--color-ink)]/50">
                    {r.id}
                  </td>

                  {/* NAMA BARANG */}
                  <td className="px-4 py-3 font-medium text-[var(--color-navy)]">
                    {r.item_name}
                  </td>

                  {/* TIPE */}
                  <td className="px-4 py-3 text-[var(--color-ink)]/60">
                    {r.type === "HILANG"
                      ? "Hilang"
                      : "Ditemukan"}
                  </td>

                  {/* LOKASI */}
                  <td className="px-4 py-3 text-[var(--color-ink)]/60">
                    {r.location}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>

                  {/* UBAH STATUS */}
                  <td className="px-4 py-3">

                    <select
                      value={r.status}
                      onChange={(e) =>
                        handleStatusChange(
                          r.id,
                          e.target.value as ReportStatus
                        )
                      }
                      className="focus-ring rounded-lg border border-[var(--color-line)] bg-white px-2 py-1.5 text-[12.5px] outline-none"
                    >

                      {STATUS_OPTIONS.map((s) => (

                        <option
                          key={s}
                          value={s}
                        >
                          {STATUS_LABEL[s]}
                        </option>

                      ))}

                    </select>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}