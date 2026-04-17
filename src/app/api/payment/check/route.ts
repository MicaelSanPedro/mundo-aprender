import { NextRequest, NextResponse } from "next/server";

// Checar status do pagamento PIX junto à AbacatePay
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pixId = searchParams.get("pixId");

    if (!pixId) {
      return NextResponse.json(
        { error: "pixId is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ABACATEPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Payment API key not configured" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.abacatepay.com/v1/pixQrCode/check?id=${pixId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("AbacatePay check error:", res.status, errorText);
      return NextResponse.json(
        { error: "Erro ao checar pagamento" },
        { status: 502 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      success: data.success,
      pixId: data.data?.id,
      status: data.data?.status,
      expiresAt: data.data?.expiresAt,
    });
  } catch (error) {
    console.error("Payment check error:", error);
    return NextResponse.json(
      { error: "Erro ao checar pagamento" },
      { status: 500 }
    );
  }
}
