import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber } = body;

    // Email desabilitado — não há credenciais de email configuradas
    console.log(`[EMAIL SKIP] Pedido ${orderNumber || "desconhecido"} — email não configurado`);
    return NextResponse.json({ sent: false, reason: "email_not_configured" });
  } catch (error) {
    return NextResponse.json({ sent: false, reason: "error" }, { status: 500 });
  }
}
