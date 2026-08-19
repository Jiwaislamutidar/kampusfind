import { Link, useSearchParams } from "react-router-dom";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("id");
  const type = searchParams.get("type"); // "HILANG" atau "DITEMUKAN"

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-lg md:p-10">
        
        {/* ICON CHECKMARK */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* JUDUL */}
        <h1 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">
          Laporan Berhasil Terkirim!
        </h1>

        {/* SUBTITLE */}
        <p className="mt-3 text-[14px] text-slate-600">
          Terima kasih telah berkontribusi menjaga keamanan lingkungan kampus.
        </p>

        {/* BOX PESAN KHUSUS */}
        <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50/60 p-4 text-left">
          <p className="text-[13.5px] leading-relaxed text-slate-700">
            {type === "HILANG"
              ? "Terimakasih Sudah Melapor, Semoga Segera Ditemukan Melalui Website Kami!"
              : "Terimakasih Sudah Menemukan Barang Dan Mengamankannya!"}
          </p>
        </div>

        {/* TOMBOL AKSI */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-xl bg-[#0f172a] px-6 py-3 text-[14px] font-medium text-white transition hover:bg-slate-800"
          >
            Kembali ke Beranda
          </Link>

          {reportId && (
            <Link
              to={`/barang/${reportId}`}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-[14px] font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Lihat Status Laporan
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}