import { ReportForm } from "@/components/lapor/report-form";

export default function LaporPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Laporkan Jalan Rusak
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lengkapi informasi di bawah ini agar laporan cepat diproses.
        </p>
      </div>
      <ReportForm />
    </div>
  );
}
