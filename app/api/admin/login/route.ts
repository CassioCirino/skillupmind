import { NextRequest, NextResponse } from "next/server";
import { clearAdminCookie, setAdminCookie, verifyAdminCredentials } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const username = typeof payload?.username === "string" ? payload.username : "";
  const password = typeof payload?.password === "string" ? payload.password : "";

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json(
      { message: "Usuário ou senha inválidos." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  setAdminCookie(response);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAdminCookie(response);
  return response;
}
