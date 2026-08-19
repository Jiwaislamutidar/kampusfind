import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, LOCATIONS } from '../lib/constants';
import { addReport } from '../lib/store';

const inputClass =
  'focus-ring w-full rounded-xl border border-[var(--color-line)] bg-white p-3 text-[13.5px] outline-none resize-none';

const labelClass =
  'mb-1.5 block text-[13px] font-medium text-[var(--color-navy)]';

export default function FormHilang() {
  const navigate = useNavigate();

  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('');
  const [color, setColor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [detailLocation, setDetailLocation] = useState('');

  // State upload foto
  const [foto, setFoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // =====================================================
  // HANDLE FILE
  // =====================================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      setFoto(selectedFile);

      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const finalLocation =
      location === 'Lainnya'
        ? customLocation
        : location;

    // Validasi
    if (
      !reporterName ||
      !reporterContact ||
      !itemName ||
      !description ||
      !color ||
      !date ||
      !time ||
      !finalLocation
    ) {
      setError(
        'Mohon lengkapi seluruh data yang wajib diisi.'
      );
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // =====================================================
      // 1. KIRIM DATA KE NODE.JS + MYSQL
      // =====================================================

      const formData = new FormData();

      formData.append('type', 'HILANG');
      formData.append(
        'nama_pelapor',
        reporterName
      );
      formData.append(
        'no_whatsapp',
        reporterContact
      );
      formData.append(
        'jenis_barang',
        category
      );
      formData.append('warna', color);
      formData.append(
        'nama_barang',
        itemName
      );
      formData.append(
        'deskripsi',
        description
      );
      formData.append(
        'ciri_khas',
        distinctiveFeatures
      );
      formData.append('tanggal', date);
      formData.append('jam', time);
      formData.append(
        'lokasi',
        finalLocation
      );
      formData.append(
        'detail_lokasi',
        detailLocation || '-'
      );

      // Upload foto kalau ada
      if (foto) {
        formData.append('foto', foto);
      }

      const res = await fetch(
        'http://localhost:5000/api/reports',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            'Gagal menyimpan laporan ke database.'
        );
      }

      // =====================================================
      // 2. URL FOTO DARI BACKEND
      // =====================================================

      let backendPhotoUrl = '';

      if (data.foto) {
        backendPhotoUrl =
          `http://localhost:5000/uploads/${data.foto}`;
      }

      // =====================================================
      // 3. SIMPAN KE LOCAL STORE
      // =====================================================

      addReport({
        type: 'HILANG',
        itemName,
        category,
        color,
        location: finalLocation,
        detailLocation:
          detailLocation || '-',
        date,
        time,
        description,
        distinctiveFeatures,
        reporterName,
        reporterContact,

        // Kondisi default untuk laporan hilang
        condition: 'BAIK',

        // Gunakan foto backend jika tersedia,
        // jika tidak gunakan preview lokal
        photoUrl:
          backendPhotoUrl ||
          previewUrl ||
          undefined,
      });

      // =====================================================
      // 4. PINDAH KE DETAIL LAPORAN
      // =====================================================

      navigate(`/lapor-sukses?id=${data.id}&type=HILANG`);
    } catch (err) {
      console.error(
        'Backend Error:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan laporan.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-sm sm:p-8">

      {/* HEADER */}
      <div className="mb-8">

        <p className="text-center text-[15px] font-bold tracking-wider text-[var(--color-royal)] uppercase">
          LAPOR BARANG HILANG
        </p>

        <h1 className="mt-2 font-display text-2xl font-bold text-[var(--color-navy)] sm:text-3xl">
          Ceritakan barang Apa Yang Telah Hilang Darimu!
        </h1>

        <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
          Semakin lengkap dan spesifik detailnya, semakin akurat Smart Match mencocokkan dengan laporan barang ditemukan.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-[13px] font-medium text-red-700">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* NAMA + WHATSAPP */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div>
            <label className={labelClass}>
              Nama Pelapor *
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

        {/* KATEGORI + NAMA BARANG */}
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

        {/* WARNA + TANGGAL */}
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
              Tanggal Terakhir Dilihat *
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

        {/* JAM + LOKASI */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div>
            <label className={labelClass}>
              Perkiraan Jam *
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
              Lokasi Terakhir Dilihat *
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
        {location === 'Lainnya' && (
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
            placeholder="Contoh: Di meja sudut dekat jendela, lantai 2"
            className={inputClass}
          />
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
            placeholder="Jelaskan secara detail mengenai barang yang hilang..."
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
            Gunakan foto barang yang jelas agar membantu proses pencarian.
          </p>

          {previewUrl ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-line)] p-4">

              <img
                src={previewUrl}
                alt="Preview"
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
          className="w-full rounded-xl bg-[var(--color-navy)] py-3.5 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting
            ? 'Mengirim...'
            : 'Kirim Laporan Barang Hilang'}
        </button>

      </form>
    </div>
  );
}