import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLoginForm } from "@/components/AdminLoginForm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <AdminLoginForm />
    </main>
  );
}
