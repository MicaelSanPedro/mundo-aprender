import { NextRequest, NextResponse } from "next/server";

// Checar status do pagamento PIX junto ao Mercado Pago
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId is required" },
        { status: 400 }
      );
    }

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Mercado Pago access token not configured" },
        { status: 500 }
      );
    }

    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Mercado Pago check error:", res.status, errorText);
      return NextResponse.json(
        { error: "Erro ao checar pagamento" },
        { status: 502 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      id: data.id,
      status: data.status, // "approved", "pending", "rejected", etc.
      statusDetail: data.status_detail,
      externalReference: data.external_reference,
    });
  } catch (error) {
    console.error("Payment check error:", error);
    return NextResponse.json(
      { error: "Erro ao checar pagamento" },
      { status: 500 }
    );
  }
}
