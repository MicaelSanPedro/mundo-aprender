import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SECRET = process.env.ADMIN_PASSWORD || "mundo2024";

// Products catalog — mirrors page.tsx
const PRODUCTS: Record<number, { name: string; emoji: string; link: string; price: number }> = {
  1: {
    name: "O Código Secreto do Mundo",
    emoji: "🔢",
    price: 4.99,
    link: "https://docs.google.com/document/d/1AW-YdqoprQcQzkLzMWE2G_PNwb5kEspQoQMAz4lXHe8/edit?usp=drivesdk",
  },
};

/**
 * Code format: XXXX-XXXX-XXXX-XXXX (16 chars)
 *   2 chars = product ID (base-36)
 *   6 chars = random nonce (hex)
 *   8 chars = HMAC-SHA256 signature (hex)
 *
 * Verification only needs the secret + code — no database required!
 */
function generateSignedCode(productId: number): string {
  if (!PRODUCTS[productId]) throw new Error("Produto não encontrado");

  const nonce = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 hex chars
  const prod = productId.toString(36).toUpperCase().padStart(2, "0"); // 2 chars

  const payload = `${prod}${nonce}`;
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex")
    .toUpperCase()
    .slice(0, 8); // 8 hex chars

  const code = `${prod}${nonce}${signature}`; // 16 chars
  return code.match(/.{1,4}/g).join("-");
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
    return { valid: false, error: "Código inválido" };
  }

  const productId = parseInt(prod, 36);
  const product = PRODUCTS[productId];

  if (!product) {
    return { valid: false, error: "Produto não encontrado" };
  }

  return { valid: true, productId, product };
}

// GET — verify a code (public, no auth needed)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // If ?password= is present, this is an admin listing request
  const password = searchParams.get("password");
  const codeParam = searchParams.get("code");

  if (password) {
    // Admin auth check
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
