import { useState } from "react";
import { addClaim } from "../lib/store";
import type { Report } from "../index";

const QUESTIONS = [
  "Sebutkan ciri khusus barang yang tidak terlihat pada foto.",
  "Di mana terakhir kali Anda menggunakan atau melihat barang tersebut?",
  "Apa detail khusus yang terdapat pada barang (misalnya isi, stiker, atau tanda tertentu)?",
];

export default function ClaimModal({
  report,
  onClose,
  onSubmitted,
}: {
  report: Report;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit =
    name.trim() && contact.trim() && answers.every((a) => a.trim().length > 3);

  function handleSubmit() {
    addClaim({
      reportId: report.id,
      claimantName: name,
      claimantContact: contact,
      answers: QUESTIONS.map((q, i) => ({ question: q, answer: answers[i] })),
    });
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--color-navy)]/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl">
        {submitted ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-sky)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5 10 17l9-10" stroke="var(--color-royal)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="font-display text-[17px] font-bold text-[var(--color-navy)]">
              Klaim terkirim
            </h3>
            <p className="max-w-xs text-[13.5px] text-[var(--color-ink)]/60">
              Klaim kamu untuk "{report.itemName}" sudah masuk ke admin untuk
              diverifikasi. Kamu akan dihubungi lewat kontak yang diberikan.
            </p>
            <button
              onClick={() => {
                onSubmitted();
                onClose();
              }}
              className="mt-2 rounded-xl bg-[var(--color-royal)] px-5 py-2.5 text-[13.5px] font-semibold text-white"
            >
              Selesai
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between border-b border-[var(--color-line)] px-5 py-4">
              <div>
                <p className="text-[11.5px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
                  Verifikasi Klaim
                </p>
                <h3 className="font-display text-[17px] font-bold text-[var(--color-navy)]">
                  Ini Barang Saya
                </h3>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-ink)]/50 hover:bg-[var(--color-sky)]"
                aria-label="Tutup"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <p className="rounded-xl bg-[var(--color-sky)] px-3.5 py-3 text-[12.5px] leading-relaxed text-[var(--color-navy)]/80">
                Untuk mencegah klaim sembarangan, kami akan meminta beberapa
                detail yang hanya diketahui pemilik asli barang "
                <strong>{report.itemName}</strong>". Jawabanmu akan diperiksa
                oleh admin sebelum barang dikembalikan.
              </p>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[var(--color-navy)]">
                  Nama lengkap
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu"
                  className="focus-ring w-full rounded-xl border border-[var(--color-line)] bg-white p-3 text-[13.5px] outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[var(--color-navy)]">
                  Nomor WhatsApp aktif
                </label>
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="focus-ring w-full rounded-xl border border-[var(--color-line)] bg-white p-3 text-[13.5px] outline-none"
                />
              </div>

              {QUESTIONS.map((q, i) => (
                <div key={q}>
                  <label className="mb-1.5 block text-[13px] font-medium text-[var(--color-navy)]">
                    {q}
                  </label>
                  <textarea
                    value={answers[i]}
                    onChange={(e) => {
                      const next = [...answers];
                      next[i] = e.target.value;
                      setAnswers(next);
                    }}
                    rows={2}
                    className="focus-ring w-full resize-none rounded-xl border border-[var(--color-line)] bg-white p-3 text-[13.5px] outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 border-t border-[var(--color-line)] px-5 py-4">
              <button
                onClick={onClose}
                className="rounded-xl border border-[var(--color-line)] px-4 py-2.5 text-[13.5px] font-medium text-[var(--color-navy)]/70"
              >
                Batal
              </button>
              <button
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="ml-auto rounded-xl bg-[var(--color-royal)] px-5 py-2.5 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Kirim Klaim
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
