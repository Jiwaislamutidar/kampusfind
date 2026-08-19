# KampusFind

Sistem Lost & Found untuk lingkungan kampus — dibuat untuk lomba web development
bertema **"Innovative Web Solutions"**.

> "Barang Hilang, Jangan Dibiarkan."

## Alur utama

```
LAPOR → CARI → COCOKKAN → KLAIM → KEMBALIKAN
```

## Fitur

- **Lapor Barang Hilang / Ditemukan** — form lengkap dengan pilihan lokasi
  kampus, kondisi barang, upload foto (preview), dan pilihan tempat
  penitipan (termasuk input WhatsApp privat khusus opsi "Pribadi").
- **Temukan Barang** — pencarian, filter tipe/kategori/lokasi/tanggal, dan
  tampilan kartu laporan.
- **Smart Match** — pencocokan berbasis skor sederhana (bukan AI) antara
  laporan hilang dan ditemukan berdasarkan kategori, warna, lokasi, waktu,
  dan kemiripan deskripsi.
- **Klaim & Verifikasi** — tombol "Ini Barang Saya" membuka form verifikasi
  sebelum klaim diteruskan ke admin.
- **Panel Admin** — statistik ringkas, tabel seluruh laporan dengan
  pengubahan status, dan antrian verifikasi klaim.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

Untuk build produksi:

```bash
npm run build
npm run preview
```

## Data & penyimpanan

Proyek ini memakai `localStorage` sebagai "database" sisi klien (lengkap
dengan data contoh/dummy untuk demo) sehingga bisa langsung dijalankan tanpa
backend. Struktur data (`src/types/index.ts`) sudah disiapkan agar mudah
dipindahkan ke Supabase atau backend lain — lihat `src/lib/store.ts` untuk
titik integrasinya. Tombol **"Reset data demo"** di halaman Admin
mengembalikan data ke kondisi awal.

## Struktur proyek

```
src/
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── SearchBar.tsx
│   ├── FormHilang.tsx
│   ├── FormDitemukan.tsx
│   ├── ItemCard.tsx
│   ├── SmartMatch.tsx
│   ├── ClaimModal.tsx
│   ├── StatusBadge.tsx
│   ├── StatsCard.tsx
│   └── Footer.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── FindPage.tsx
│   ├── FormHilangPage.tsx
│   ├── FormDitemukanPage.tsx
│   ├── DetailPage.tsx
│   └── AdminPage.tsx
├── lib/
│   ├── constants.ts
│   ├── seed.ts
│   └── store.ts
└── types/
    └── index.ts
```
