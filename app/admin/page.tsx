import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStorageProvider } from "@/lib/storage";
import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const results = await getStorageProvider().listResults();

  return <AdminDashboard results={results} />;
}
