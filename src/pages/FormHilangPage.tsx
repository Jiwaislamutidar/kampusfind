import FormHilang from "../components/FormHilang";

export default function FormHilangPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="text-center text-[25px] font-semibold uppercase tracking-wide text-[var(--color-royal)]">
        Lapor Barang Anda Yang Hilang Disini!
      </p>
      <div className="card-surface mt-7 p-5 sm:p-7">
        <FormHilang />
      </div>
    </div>
  );
}
