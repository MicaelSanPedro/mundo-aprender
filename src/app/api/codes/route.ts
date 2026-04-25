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

function generateSignedCode(productId: number): string {
  if (!PRODUCTS[productId]) throw new Error("Produto não encontrado");
  const payload = Array.from(crypto.randomBytes(9))
    .map((b) => ALPHABET[b % 36])
    .join("")
    .slice(0, 12);
  const sig = computeSignature(payload, productId);
  const code = (payload + sig).match(/.{1,4}/g)?.join("-") || (payload + sig);
  return code;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");
  const codeParam = searchParams.get("code");

  if (password) {
    if (password !== SECRET) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, products: PRODUCTS });
  }

  if (!codeParam) {
    return NextResponse.json({ error: "Código não informado" }, { status: 400 });
  }

  const clean = codeParam.replace(/-/g, "").toUpperCase();
  if (clean.length !== 16) return NextResponse.json({ valid: false }, { status: 404 });

  const payload = clean.slice(0, 12);
  const providedSig = clean.slice(12, 16);

  for (const [id, product] of Object.entries(PRODUCTS)) {
    if (providedSig === computeSignature(payload, parseInt(id))) {
      return NextResponse.json({
        valid: true,
        productName: product.name,
        productEmoji: product.emoji,
        productPrice: product.price,
      });
    }
  }

  return NextResponse.json({ valid: false }, { status: 404 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, productId } = body;

    if (password !== SECRET) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    if (!productId || !PRODUCTS[productId]) {
      return NextResponse.json({ error: "Produto inválido" }, { status: 400 });
    }

    const code = generateSignedCode(productId);
    return NextResponse.json({ success: true, code }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }
}
