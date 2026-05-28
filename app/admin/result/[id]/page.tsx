import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStorageProvider } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { ExportPdfButton } from "@/components/ExportPdfButton";
import { StudentReport } from "@/components/StudentReport";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ResultPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function AdminResultPage({ params }: ResultPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await Promise.resolve(params);
  const result = await getStorageProvider().getResult(decodeURIComponent(id));

  if (!result) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <div className="page-shell space-y-5">
        <div className="print-hide flex flex-col gap-3 rounded-lg border bg-white/85 p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Relatório individual</p>
            <h1 className="text-2xl font-semibold tracking-normal text-slate-950">{result.student.name}</h1>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ExportPdfButton />
            <Button asChild variant="outline">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao dashboard
              </Link>
            </Button>
          </div>
        </div>

        <div className="print-report">
          <StudentReport result={result} showAnswers />
        </div>
      </div>
    </main>
  );
}
