import type {
  Claim,
  MatchResult,
  Report,
  ReportStatus,
} from "../types";

const REPORTS_KEY = "kampusfind_reports_v1";
const CLAIMS_KEY = "kampusfind_claims_v1";

// =====================================================
// LOCAL STORAGE HELPER
// =====================================================

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// =====================================================
// REPORTS
// =====================================================

export function getReports(): Report[] {
  return read<Report[]>(REPORTS_KEY, []);
}

// =====================================================
// CLAIMS
// =====================================================

export function getClaims(): Claim[] {
  return read<Claim[]>(CLAIMS_KEY, []);
}

// =====================================================
// GENERATE ID
// =====================================================

function genId(prefix: string) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// =====================================================
// TAMBAH REPORT
// =====================================================

export function addReport(
  report: Omit<Report, "id" | "createdAt" | "status">
): Report {
  const reports = getReports();

  const newReport: Report = {
    ...report,
    id: genId("R"),
    status: "MENUNGGU",
    createdAt: new Date().toISOString(),
  };

  const updated = [newReport, ...reports];

  write(REPORTS_KEY, updated);

  return newReport;
}

// =====================================================
// UPDATE STATUS REPORT
// =====================================================

export function updateReportStatus(
  id: string,
  status: ReportStatus
) {
  const reports = getReports().map((r) =>
    r.id === id
      ? {
          ...r,
          status,
        }
      : r
  );

  write(REPORTS_KEY, reports);

  return reports;
}

// =====================================================
// CLAIM
// =====================================================

export function addClaim(
  claim: Omit<Claim, "id" | "createdAt" | "status">
): Claim {
  const claims = getClaims();

  const newClaim: Claim = {
    ...claim,
    id: genId("C"),
    status: "MENUNGGU_VERIFIKASI",
    createdAt: new Date().toISOString(),
  };

  write(CLAIMS_KEY, [newClaim, ...claims]);

  // Ketika barang diklaim,
  // status laporan masuk proses klaim.
  updateReportStatus(
    claim.reportId,
    "PROSES_KLAIM"
  );

  return newClaim;
}

// =====================================================
// UPDATE STATUS CLAIM
// =====================================================

export function updateClaimStatus(
  id: string,
  status: Claim["status"]
) {
  const claims = getClaims().map((c) =>
    c.id === id
      ? {
          ...c,
          status,
        }
      : c
  );

  write(CLAIMS_KEY, claims);

  const claim = claims.find(
    (c) => c.id === id
  );

  if (claim) {
    if (status === "DISETUJUI") {
      updateReportStatus(
        claim.reportId,
        "PROSES_PENGEMBALIAN"
      );
    }

    if (status === "DITOLAK") {
      updateReportStatus(
        claim.reportId,
        "DITEMUKAN"
      );
    }
  }

  return claims;
}

// =====================================================
// SMART MATCH
// =====================================================

function daysBetween(
  a: string,
  b: string
) {
  const diff = Math.abs(
    new Date(a).getTime() -
      new Date(b).getTime()
  );

  return diff / (1000 * 60 * 60 * 24);
}

function wordOverlapScore(
  a: string,
  b: string
) {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2);

  const wordsA = new Set(norm(a));
  const wordsB = new Set(norm(b));

  if (
    wordsA.size === 0 ||
    wordsB.size === 0
  ) {
    return 0;
  }

  let overlap = 0;

  wordsA.forEach((w) => {
    if (wordsB.has(w)) {
      overlap += 1;
    }
  });

  return (
    overlap /
    Math.max(wordsA.size, wordsB.size)
  );
}

// =====================================================
// SMART MATCH
// =====================================================

export function computeMatches(
  hilangReport: Report
): MatchResult[] {
  const candidates = getReports().filter(
    (r) =>
      r.type === "DITEMUKAN" &&
      r.status === "DIVERIFIKASI"
  );

  const results: MatchResult[] =
    candidates.map((candidate) => {
      const breakdown: MatchResult["breakdown"] =
        [];

      let score = 0;

      // KATEGORI
      if (
        candidate.category ===
        hilangReport.category
      ) {
        breakdown.push({
          label: "Kategori",
          matched: "cocok",
          points: 30,
        });

        score += 30;
      } else {
        breakdown.push({
          label: "Kategori",
          matched: "tidak",
          points: 0,
        });
      }

      // WARNA
      if (
        candidate.color
          .trim()
          .toLowerCase() ===
        hilangReport.color
          .trim()
          .toLowerCase()
      ) {
        breakdown.push({
          label: "Warna",
          matched: "cocok",
          points: 20,
        });

        score += 20;
      } else {
        breakdown.push({
          label: "Warna",
          matched: "tidak",
          points: 0,
        });
      }

      // LOKASI
      if (
        candidate.location ===
        hilangReport.location
      ) {
        breakdown.push({
          label: "Lokasi",
          matched: "cocok",
          points: 25,
        });

        score += 25;
      } else {
        breakdown.push({
          label: "Lokasi",
          matched: "tidak",
          points: 0,
        });
      }

      // WAKTU
      const gap = daysBetween(
        candidate.date,
        hilangReport.date
      );

      if (gap <= 3) {
        const points =
          gap <= 1 ? 15 : 8;

        breakdown.push({
          label: "Waktu",
          matched:
            gap <= 1
              ? "cocok"
              : "dekat",
          points,
        });

        score += points;
      } else {
        breakdown.push({
          label: "Waktu",
          matched: "tidak",
          points: 0,
        });
      }

      // DESKRIPSI
      const overlap =
        wordOverlapScore(
          `${hilangReport.description} ${hilangReport.distinctiveFeatures}`,
          `${candidate.description} ${candidate.distinctiveFeatures}`
        );

      if (overlap > 0.15) {
        breakdown.push({
          label: "Deskripsi",
          matched: "mirip",
          points: 10,
        });

        score += 10;
      } else {
        breakdown.push({
          label: "Deskripsi",
          matched: "tidak",
          points: 0,
        });
      }

      return {
        report: candidate,
        score,
        breakdown,
      };
    });

  return results
    .filter((r) => r.score >= 30)
    .sort(
      (a, b) => b.score - a.score
    );
}

// =====================================================
// RESET LOCAL DATA
// =====================================================

export function resetDemoData() {
  localStorage.removeItem(REPORTS_KEY);
  localStorage.removeItem(CLAIMS_KEY);
}