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
  2: {
    name: "Pack de Atividades - 3º Ano (10 atividades)",
    emoji: "📚",
    price: 4.95,
    link: "https://www.mediafire.com/folder/x8dcszq4f7egl/MUNDO-APRENDER-10",
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const clean = decodeURIComponent(code).replace(/-/g, "").toUpperCase();

    if (clean.length !== 16) {
      return NextResponse.json({ valid: false, error: "Formato inválido" });
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
      return NextResponse.json({ valid: false, error: "Código inválido" });
    }

    const productId = parseInt(prod, 36);
    const product = PRODUCTS[productId];

    if (!product) {
      return NextResponse.json({ valid: false, error: "Produto não encontrado" });
    }

    return NextResponse.json({
      valid: true,
      productName: product.name,
      productEmoji: product.emoji,
      productPrice: product.price,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Erro ao verificar código" });
  }
}
