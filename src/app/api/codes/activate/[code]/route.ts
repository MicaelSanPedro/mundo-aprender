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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!code || !code.trim()) {
    return NextResponse.json({ error: "Código não informado" }, { status: 400 });
  }

  const result = verifySignedCode(code.trim().toUpperCase());
  if (!result.valid) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    productName: result.product.name,
    productEmoji: result.product.emoji,
    productLink: result.product.link,
  });
}
