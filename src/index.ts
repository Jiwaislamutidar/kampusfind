export type ReportType = "HILANG" | "DITEMUKAN";

export type ReportStatus =
  | "MENUNGGU"
  | "DIVERIFIKASI"
  | "DITEMUKAN"
  | "PROSES_KLAIM"
  | "PROSES_PENGEMBALIAN"
  | "SUDAH_KEMBALI";

export type ItemCondition = "BAIK" | "RUSAK_RINGAN" | "RUSAK_BERAT";

export type StorageOption =
  | "Ruang Dosen"
  | "Satpam / Pos Keamanan"
  | "Sekretariat Hima"
  | "Dibawa Penemu";

export type ClaimStatus =
  | "MENUNGGU_VERIFIKASI"
  | "DISETUJUI"
  | "DITOLAK";

export interface Report {
  id: string;
  type: ReportType;
  itemName: string;
  category: string;
  color: string;
  description: string;
  distinctiveFeatures: string;
  date: string;
  time: string;
  location: string;
  detailLocation: string;
  reporterName: string;
  reporterContact: string;
  condition: ItemCondition;
  storage?: StorageOption;
  photoUrl?: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface ClaimAnswer {
  question: string;
  answer: string;
}

export interface Claim {
  id: string;
  reportId: string;
  claimantName: string;
  claimantContact: string;
  answers: ClaimAnswer[];
  status: ClaimStatus;
  createdAt: string;
}

export interface MatchBreakdown {
  label: string;
  matched: "cocok" | "tidak" | "dekat" | "mirip";
  points: number;
}

export interface MatchResult {
  report: Report;
  score: number;
  breakdown: MatchBreakdown[];
}