export const CATEGORIES = [
  "Dompet",
  "Kartu / Identitas",
  "Elektronik",
  "Kunci",
  "Buku & Alat Tulis",
  "Pakaian",
  "Aksesoris",
  "Botol / Tempat Makan",
  "Lainnya",
];

export const LOCATIONS = [
  "Gedung A",
  "Gedung B",
  "Gedung C",
  "Perpustakaan",
  "Laboratorium",
  "Masjid",
  "Kantin",
  "Lapangan",
  "Sekretariat HIMA",
  "Lainnya",
];

export const CONDITIONS = [
  { value: "BAIK", label: "Kondisi baik" },
  { value: "SEDIKIT_RUSAK", label: "Sedikit rusak" },
  { value: "RUSAK", label: "Rusak" },
] as const;

export const STORAGE_OPTIONS = [
  { value: "RUANG_DOSEN", label: "Ruang Dosen" },
  { value: "SEKRETARIAT_HIMA", label: "Sekretariat HIMA" },
  { value: "OB", label: "OB (Office Boy)" },
  { value: "PRIBADI", label: "Pribadi (penemu membawa sendiri)" },
] as const;

export const STATUS_LABEL: Record<string, string> = {
  MENUNGGU: "Menunggu",
  DIVERIFIKASI: "Diverifikasi",
  DITEMUKAN: "Ditemukan",
  PROSES_KLAIM: "Proses Klaim",
  PROSES_PENGEMBALIAN: "Proses Pengembalian",
  SUDAH_KEMBALI: "Sudah Kembali",
};

export const STATUS_COLOR: Record<string, string> = {
  MENUNGGU: "bg-[var(--color-line)] text-[var(--color-navy)]",
  DIVERIFIKASI: "bg-[var(--color-sky)] text-[var(--color-royal)]",
  DITEMUKAN: "bg-[var(--color-sky)] text-[var(--color-royal)]",
  PROSES_KLAIM: "bg-amber-50 text-amber-700 border border-amber-200",
  PROSES_PENGEMBALIAN: "bg-amber-50 text-amber-700 border border-amber-200",
  SUDAH_KEMBALI: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};
