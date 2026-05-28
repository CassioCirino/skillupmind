import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { buildRanking } from "@/lib/scoring";
import { getStorageProvider } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  try {
    const results = await getStorageProvider().listResults();
    const activeResults = results.filter((result) => result.status !== "archived");

    return NextResponse.json({
      results,
      ranking: buildRanking(activeResults)
    });
  } catch (error) {
    console.error("Failed to list assessment results.", error);
    return NextResponse.json(
      {
        message:
          "Não foi possível carregar os resultados. Verifique a configuração do Vercel Blob."
      },
      { status: 503 }
    );
  }
}
