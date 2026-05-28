import { NextRequest, NextResponse } from "next/server";
import { getStorageProvider } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { allowed: false, message: "Informe um email valido." },
      { status: 400 }
    );
  }

  const results = await getStorageProvider().listResults();
  const hasActiveAssessment = results.some(
    (result) =>
      result.status !== "archived" &&
      result.student.email.trim().toLowerCase() === email
  );

  if (hasActiveAssessment) {
    return NextResponse.json(
      {
        allowed: false,
        message:
          "Este email ja possui uma avaliacao ativa. Procure o administrador para arquivar a tentativa anterior e liberar um novo teste."
      },
      { status: 409 }
    );
  }

  return NextResponse.json({ allowed: true });
}
