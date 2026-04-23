import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SECRET = process.env.ADMIN_PASSWORD || "mundo2024";

const PRODUCTS: Record<number, { name: string; emoji: string; link: string; price: number }> = {
  1: {
    name: "O Código Secreto do Mundo",
    emoji: "🔢",
    price: 4.99,
    link: "https://docs.google.com/document/d/1AW-YdqoprQcQzkLzMWE2G_PNwb5kEspQoQMAz4lXHe8/edit?usp=drivesdk",
  },
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const clean = decodeURIComponent(code).replace(/-/g, "").toUpperCase();

    if (clean.length !== 16) {
      return NextResponse.json({ success: false, error: "Formato inválido" });
    }

    const prod = clean.slice(0, 2);
    const nonce = clean.slice(2, 8);
    const providedSig = clean.slice(8, 16);

    const expectedSig = crypto
      .createHmac("sha256", SECRET)
      .update(`${prod}${nonce}`)
      .digest("hex")
      .toUpperCase()
      .slice(0, 8);

    if (providedSig !== expectedSig) {
      return NextResponse.json({ success: false, error: "Código inválido" });
    }

    const productId = parseInt(prod, 36);
    const product = PRODUCTS[productId];

    if (!product) {
      return NextResponse.json({ success: false, error: "Produto não encontrado" });
    }

    // Return product info — code is cryptographically signed so it can't be guessed
    return NextResponse.json({
      success: true,
      productName: product.name,
      productEmoji: product.emoji,
      productPrice: product.price,
      productLink: product.link,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Erro ao ativar código" });
  }
}
