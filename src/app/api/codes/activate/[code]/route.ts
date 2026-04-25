import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PRODUCTS } from "@/config/products";

const SECRET = process.env.ADMIN_PASSWORD || "mundo2024";
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const clean = decodeURIComponent(code).replace(/-/g, "").toUpperCase();

    if (clean.length !== 16 || !/^[0-9A-Z]{16}$/.test(clean)) {
      return NextResponse.json({ success: false, error: "Formato inválido" });
    }

    const payload = clean.slice(0, 12);
    const providedSig = clean.slice(12, 16);

    for (const [id, product] of Object.entries(PRODUCTS)) {
      const expectedSig = computeSignature(payload, parseInt(id));
      if (providedSig === expectedSig) {
        return NextResponse.json({
          success: true,
          productName: product.name,
          productEmoji: product.emoji,
          productPrice: product.price,
          productLink: product.link,
        });
      }
    }

    return NextResponse.json({ success: false, error: "Código inválido" });
  } catch {
    return NextResponse.json({ success: false, error: "Erro ao ativar código" });
  }
}
