import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStorageProvider } from "@/lib/storage";
import { AssessmentResult } from "@/lib/types";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  let results: AssessmentResult[] = [];
  let storageWarning = "";

  try {
    results = await getStorageProvider().listResults();
  } catch (error) {
    console.error("Failed to load assessment results.", error);
    storageWarning =
      "Não foi possível carregar os resultados. Verifique se o Vercel Blob está conectado e se BLOB_READ_WRITE_TOKEN foi configurado nas variáveis de ambiente do projeto.";
  }

  return <AdminDashboard results={results} storageWarning={storageWarning} />;
}
