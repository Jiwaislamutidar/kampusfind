import FormHilang from "../components/FormHilang";

export default function FormHilangPage() {
  return (
    <div className="form-page mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-royal)]">
        Lapor Barang Anda Yang Hilang Disini!
      </p>
      <div className="mt-7">
        <FormHilang />
      </div>
    </div>
  );
}
