import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CATEGORIES,
  LOCATIONS,
  CONDITIONS,
  STORAGE_OPTIONS,
} from "../lib/constants";
import type {
  ItemCondition,
  StorageOption,
} from "../index";
import { supabase } from "../supabaseClient";

const inputClass =
  "form-input focus-ring w-full rounded-xl border border-[var(--color-line)] bg-white p-3 text-[13.5px] outline-none resize-none";

const labelClass =
  "form-label mb-1.5 block text-[13px] font-medium text-[var(--color-navy)]";

export default function FormDitemukan() {
  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [reporterName, setReporterName] = useState("");
  const [reporterContact, setReporterContact] = useState("");

  const [category, setCategory] = useState(
    CATEGORIES[0] || ""
  );

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [distinctiveFeatures, setDistinctiveFeatures] =
    useState("");

  const [color, setColor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [location, setLocation] = useState(
    LOCATIONS[0] || ""
  );

  const [customLocation, setCustomLocation] =
    useState("");

  const [detailLocation, setDetailLocation] =
    useState("");

  // =====================================================
  // KONDISI BARANG
  // =====================================================

  const [condition, setCondition] =
    useState<ItemCondition>(
      CONDITIONS[0]?.value as ItemCondition
    );

  // =====================================================
  // PENYIMPANAN BARANG
  // =====================================================

  const [storage, setStorage] =
    useState<StorageOption>(
      (
        typeof STORAGE_OPTIONS[0] === "string"
          ? STORAGE_OPTIONS[0]
          : STORAGE_OPTIONS[0]?.value
      ) as StorageOption
    );

  // =====================================================
  // FOTO
  // =====================================================

  const [foto, setFoto] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  // =====================================================
  // SUBMIT STATE
  // =====================================================

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // PILIH FOTO
  // =====================================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setError("File yang dipilih harus berupa gambar.");
      return;
    }

    // Validasi ukuran maksimal 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5 MB.");
      return;
    }

    setError("");
    setFoto(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // SUBMIT FORM
  // =====================================================

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");

    // ===================================================
    // LOKASI FINAL
    // ===================================================

    const finalLocation =
      location === "Lainnya"
        ? customLocation.trim()
        : location;

    // ===================================================
    // VALIDASI
    // ===================================================

    if (
      !reporterName.trim() ||
      !reporterContact.trim() ||
      !itemName.trim() ||
      !description.trim() ||
      !color.trim() ||
      !date ||
      !time ||
      !finalLocation
    ) {
      setError(
        "Mohon lengkapi seluruh data yang wajib diisi."
      );

      return;
    }

    // Validasi nomor WhatsApp sederhana
    const phone = reporterContact.trim();

    if (!/^[0-9+\-\s]{8,20}$/.test(phone)) {
      setError(
        "Nomor WhatsApp tidak valid. Masukkan nomor yang benar."
      );

      return;
    }

    setSubmitting(true);

    try {
      let imageUrl: string | null = null;

      if (foto) {
        const filePath = `${crypto.randomUUID()}-${foto.name}`;
        const { error: uploadError } = await supabase.storage
          .from("report-images")
          .upload(filePath, foto, {
            contentType: foto.type,
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("report-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data: createdReport, error: insertError } = await supabase
        .from("reports")
        .insert({
          type: "DITEMUKAN",
          reporter_name: reporterName.trim(),
          reporter_contact: reporterContact.trim(),
          category,
          color: color.trim(),
          item_name: itemName.trim(),
          description: description.trim(),
          distinctive_features: distinctiveFeatures.trim(),
          date_seen: date,
          time_seen: time,
          location: finalLocation,
          location_detail: detailLocation.trim() || "-",
          status: "MENUNGGU",
          image_url: imageUrl,
        })
        .select("id")
        .single();

      if (insertError || !createdReport) {
        throw insertError || new Error("Gagal menyimpan laporan ke database.");
      }

      console.log(
        "Laporan ditemukan berhasil disimpan:",
        createdReport
      );

      // =================================================
      // BERHASIL
      // =================================================

      /*
       * TIDAK menggunakan addReport().
       *
       * Data sudah disimpan ke:
       *
       * FormDitemukan
       *       ↓
       * Node.js
       *       ↓
       * MySQL
       *
       * Status awal:
       * MENUNGGU
       *
       * Jadi laporan belum tampil ke publik
       * sampai diverifikasi admin.
       */

      const createdId = createdReport.id || "";

      if (!createdId) {
        throw new Error("Server tidak mengembalikan ID laporan.");
      }

      navigate(`/lapor-sukses?id=${createdId}&type=DITEMUKAN`);

    } catch (err) {
      console.error(
        "API Error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim laporan."
      );

    } finally {
      setSubmitting(false);
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="form-card stacked-card mx-auto max-w-3xl rounded-2xl border border-[var(--color-line)] bg-white p-5 shadow-sm sm:p-8">

      {/* HEADER */}

      <div className="mb-8">

        <p className="text-center text-[12.5px] font-semibold tracking-wide text-[var(--color-royal)] uppercase">
          LAPOR BARANG DITEMUKAN
        </p>

        <h1 className="mt-2 font-display text-2xl font-bold text-[var(--color-navy)] sm:text-3xl">
          Ceritakan barang yang kamu temukan
        </h1>

        <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
          Semakin lengkap dan spesifik detailnya,
          semakin mudah bagi pemilik sah untuk
          mengenali barangnya.
        </p>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-[13px] font-medium text-red-700">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="form-layout space-y-5"
      >

        {/* NAMA & WHATSAPP */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div>
            <label className={labelClass}>
              Nama Penemu *
            </label>

            <input
              type="text"
              value={reporterName}
              onChange={(e) =>
                setReporterName(
                  e.target.value
                )
              }
              placeholder="Contoh: Budi Santoso"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Nomor WhatsApp *
            </label>

            <input
              type="tel"
              value={reporterContact}
              onChange={(e) =>
                setReporterContact(
                  e.target.value
                )
              }
              placeholder="081234567890"
              className={inputClass}
              required
            />
          </div>

        </div>

        {/* KATEGORI & NAMA BARANG */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div>
            <label className={labelClass}>
              Kategori Barang *
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className={inputClass}
            >
              {CATEGORIES.map(
                (cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Nama Barang *
            </label>

            <input
              type="text"
              value={itemName}
              onChange={(e) =>
                setItemName(
                  e.target.value
                )
              }
              placeholder="Contoh: Dompet Biru / Tumbler Hydro Flask"
              className={inputClass}
              required
            />
          </div>

        </div>

        {/* WARNA & TANGGAL */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div>
            <label className={labelClass}>
              Warna Utama Barang *
            </label>

            <input
              type="text"
              value={color}
              onChange={(e) =>
                setColor(
                  e.target.value
                )
              }
              placeholder="Contoh: Hitam, Biru Tua"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Tanggal Ditemukan *
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }
              className={inputClass}
              required
            />
          </div>

        </div>

        {/* JAM & LOKASI */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div>
            <label className={labelClass}>
              Jam Ditemukan *
            </label>

            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(
                  e.target.value
                )
              }
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Lokasi Ditemukan *
            </label>

            <select
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              className={inputClass}
            >
              {LOCATIONS.map(
                (loc) => (
                  <option
                    key={loc}
                    value={loc}
                  >
                    {loc}
                  </option>
                )
              )}
            </select>
          </div>

        </div>

        {/* LOKASI LAINNYA */}

        {location === "Lainnya" && (
          <div>

            <label className={labelClass}>
              Sebutkan Lokasi *
            </label>

            <input
              type="text"
              value={customLocation}
              onChange={(e) =>
                setCustomLocation(
                  e.target.value
                )
              }
              placeholder="Masukkan nama lokasi"
              className={inputClass}
              required
            />

          </div>
        )}

        {/* DETAIL LOKASI */}

        <div>

          <label className={labelClass}>
            Detail Lokasi (Opsional)
          </label>

          <input
            type="text"
            value={detailLocation}
            onChange={(e) =>
              setDetailLocation(
                e.target.value
              )
            }
            placeholder='Contoh: "Depan ruang 204"'
            className={inputClass}
          />

        </div>

        {/* KONDISI */}

        <div>

          <label className={labelClass}>
            Kondisi Barang
          </label>

          <div className="flex flex-wrap gap-2.5 pt-1">

            {CONDITIONS.map(
              (c) => {

                const isSelected =
                  condition ===
                  c.value;

                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() =>
                      setCondition(
                        c.value as ItemCondition
                      )
                    }
                    className={`rounded-xl px-4 py-2 text-[13px] font-medium transition ${
                      isSelected
                        ? "border border-blue-600 bg-blue-50 text-blue-600"
                        : "border border-[var(--color-line)] bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* PENYIMPANAN */}

        <div>

          <label className={labelClass}>
            Barang Dititipkan di Mana
          </label>

          <select
            value={storage}
            onChange={(e) =>
              setStorage(
                e.target.value as StorageOption
              )
            }
            className={inputClass}
          >

            {STORAGE_OPTIONS &&
            STORAGE_OPTIONS.length > 0 ? (

              STORAGE_OPTIONS.map(
                (opt: any) => {

                  const value =
                    typeof opt ===
                    "string"
                      ? opt
                      : opt.value ||
                        opt.label;

                  const label =
                    typeof opt ===
                    "string"
                      ? opt
                      : opt.label ||
                        opt.value;

                  return (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  );
                }
              )

            ) : (

              <>
                <option value="Ruang Dosen">
                  Ruang Dosen
                </option>

                <option value="Satpam / Pos Keamanan">
                  Satpam / Pos Keamanan
                </option>

                <option value="Sekretariat Hima">
                  Sekretariat Hima
                </option>

                <option value="Dibawa Penemu">
                  Saya Bawa Sendiri
                </option>
              </>

            )}

          </select>

        </div>

        {/* DESKRIPSI */}

        <div>

          <label className={labelClass}>
            Deskripsi Barang *
          </label>

          <textarea
            rows={3}
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            placeholder="Jelaskan secara detail mengenai barang yang ditemukan..."
            className={inputClass}
            required
          />

        </div>

        {/* CIRI KHUSUS */}

        <div>

          <label className={labelClass}>
            Ciri-ciri khusus barang
          </label>

          <textarea
            rows={2}
            value={distinctiveFeatures}
            onChange={(e) =>
              setDistinctiveFeatures(
                e.target.value
              )
            }
            placeholder="Contoh: Ada stiker anime di bagian belakang, gantungan kunci merah"
            className={inputClass}
          />

        </div>

        {/* FOTO */}

        <div>

          <label className={labelClass}>
            Foto Barang (Opsional)
          </label>

          <p className="mb-2 text-[12px] text-gray-400">
            Gunakan foto yang cukup jelas
            untuk membantu pemilik mengenali
            barang.
          </p>

          {previewUrl ? (

            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-line)] p-4">

              <img
                src={previewUrl}
                alt="Preview barang"
                className="max-h-48 rounded-xl object-contain"
              />

              <button
                type="button"
                onClick={() => {
                  setFoto(null);
                  setPreviewUrl(null);
                }}
                className="mt-3 text-xs font-semibold text-red-500 hover:underline"
              >
                Hapus / Ganti Foto
              </button>

            </div>

          ) : (

            <input
              type="file"
              accept="image/*"
              onChange={
                handleFileChange
              }
              className={inputClass}
            />

          )}

        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-blue-600 py-3.5 text-[14px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting
            ? "Mengirim..."
            : "Kirim Laporan Barang Ditemukan"}
        </button>

      </form>

    </div>
  );
}