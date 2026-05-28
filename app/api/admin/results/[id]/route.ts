import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getStorageProvider } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

export async function GET(request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const { id } = await Promise.resolve(context.params);
  const result = await getStorageProvider().getResult(decodeURIComponent(id));

  if (!result) {
    return NextResponse.json({ message: "Resultado não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ result });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Nao autorizado." }, { status: 401 });
  }

  const { id } = await Promise.resolve(context.params);
  const body = await request.json().catch(() => null);

  if (typeof body?.archived !== "boolean") {
    return NextResponse.json(
      { message: "Informe se o resultado deve ser arquivado." },
      { status: 400 }
    );
  }

  const result = await getStorageProvider().archiveResult(
    decodeURIComponent(id),
    body.archived
  );

  if (!result) {
    return NextResponse.json({ message: "Resultado nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ result });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ message: "Nao autorizado." }, { status: 401 });
  }

  const { id } = await Promise.resolve(context.params);
  const deleted = await getStorageProvider().deleteResult(decodeURIComponent(id));

  if (!deleted) {
    return NextResponse.json({ message: "Resultado nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
