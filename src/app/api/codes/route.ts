import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SECRET = process.env.ADMIN_PASSWORD || "mundo2024";

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Products catalog — mirrors page.tsx
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

/**
 * Code format: XXXX-XXXX-XXXX-XXXX (16 alphanumeric chars)
 *   12 chars = fully random payload (no product ID visible!)
 *    4 chars = HMAC signature (product ID is used in HMAC computation)
 *
 * Product ID is NOT visible in the code — it's only used in the HMAC.
 * Verification tries all known products to find which one matches.
 * Codes look completely random: e.g. K7XW-3M9P-F2HJ-8QTL
 */
function randomChars(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) {
    s += ALPHABET[Math.floor(Math.random() * 36)];
  }
  return s;
}

function computeSignature(payload: string, productId: number): string {
  const hmac = crypto
    .createHmac("sha256", SECRET)
    .update(`${payload}:${productId}`)
    .digest("hex")
    .toUpperCase();
  // Convert 8 hex chars to 4 alphanumeric chars for compact display
  let sig = "";
  sig += ALPHABET[parseInt(hmac.slice(0, 2), 16) % 36];
  sig += ALPHABET[parseInt(hmac.slice(2, 4), 16) % 36];
  sig += ALPHABET[parseInt(hmac.slice(4, 6), 16) % 36];
  sig += ALPHABET[parseInt(hmac.slice(6, 8), 16) % 36];
  return sig;
}

function generateSignedCode(productId: number): string {
  if (!PRODUCTS[productId]) throw new Error("Produto não encontrado");
  const payload = randomChars(12);
  const sig = computeSignature(payload, productId);
  const code = (payload + sig).match(/.{1,4}/g).join("-");
  return code;
}

function verifySignedCode(
  code: string
):
  | { valid: true; productId: number; product: (typeof PRODUCTS)[number] }
  | { valid: false; error: string } {
  const clean = code.replace(/-/g, "").toUpperCase();

  if (clean.length !== 16) {
    return { valid: false, error: "Formato inválido" };
  }

  if (!/^[0-9A-Z]{16}$/.test(clean)) {
    return { valid: false, error: "Formato inválido" };
  }

  const payload = clean.slice(0, 12);
  const providedSig = clean.slice(12, 16);

  // Try all known products — the correct one will match the signature
  for (const [id, product] of Object.entries(PRODUCTS)) {
    const expectedSig = computeSignature(payload, parseInt(id));
    if (providedSig === expectedSig) {
      return { valid: true, productId: parseInt(id), product };
    }
  }

  return { valid: false, error: "Código inválido" };
}

// GET — verify a code (public, no auth needed)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const password = searchParams.get("password");
  const codeParam = searchParams.get("code");

  if (password) {
    if (password !== SECRET) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }
    return NextResponse.json({ products: PRODUCTS, message: "Authenticated" });
  }

  if (!codeParam) {
    return NextResponse.json({ error: "Código não informado" }, { status: 400 });
  }

  const result = verifySignedCode(codeParam.trim());
  if (!result.valid) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    productName: result.product.name,
    productEmoji: result.product.emoji,
    productPrice: result.product.price,
  });
}

// POST — generate a new code (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, productId } = body;

    if (password !== SECRET) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    if (!productId || !PRODUCTS[productId]) {
      return NextResponse.json(
        { error: "Produto inválido" },
        { status: 400 }
      );
    }

    const code = generateSignedCode(productId);
    const product = PRODUCTS[productId];

    return NextResponse.json({
      code,
      productId,
      productName: product.name,
      productEmoji: product.emoji,
      productPrice: product.price,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }
}
