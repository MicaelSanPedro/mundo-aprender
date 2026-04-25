import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SECRET = process.env.ADMIN_PASSWORD || "mundo2024";
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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

function computeSignature(payload: string, productId: number): string {
  const hmac = crypto
    .createHmac("sha256", SECRET)
    .update(`${payload}:${productId}`)
    .digest("hex")
    .toUpperCase();
  let sig = "";
  sig += ALPHABET[parseInt(hmac.slice(0, 2), 16) % 36];
  sig += ALPHABET[parseInt(hmac.slice(2, 4), 16) % 36];
  sig += ALPHABET[parseInt(hmac.slice(4, 6), 16) % 36];
  sig += ALPHABET[parseInt(hmac.slice(6, 8), 16) % 36];
  return sig;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const clean = decodeURIComponent(code).replace(/-/g, "").toUpperCase();

    if (clean.length !== 16 || !/^[0-9A-Z]{16}$/.test(clean)) {
      return NextResponse.json({ valid: false, error: "Formato inválido" });
    }

    const payload = clean.slice(0, 12);
    const providedSig = clean.slice(12, 16);

    for (const [id, product] of Object.entries(PRODUCTS)) {
      const expectedSig = computeSignature(payload, parseInt(id));
      if (providedSig === expectedSig) {
        return NextResponse.json({
          valid: true,
          productName: product.name,
          productEmoji: product.emoji,
          productPrice: product.price,
        });
      }
    }

    return NextResponse.json({ valid: false, error: "Código inválido" });
  } catch {
    return NextResponse.json({ valid: false, error: "Erro ao verificar código" });
  }
}
