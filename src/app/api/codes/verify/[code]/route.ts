import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CODES_FILE = path.join(process.cwd(), "data", "codes.json");

interface ActivationCode {
  id: string;
  code: string;
  productId: number;
  productName: string;
  productEmoji: string;
  productLink: string;
  productPrice: number;
  createdAt: string;
  usedAt: string | null;
  activatedBy: string | null;
}

async function readCodes(): Promise<ActivationCode[]> {
  try {
    const data = await fs.readFile(CODES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return NextResponse.json(
      { error: "Código não informado" },
      { status: 400 }
    );
  }

  const codes = await readCodes();
  const found = codes.find((c) => c.code === normalizedCode);

  if (!found) {
    return NextResponse.json(
      { error: "Código inválido", valid: false },
      { status: 404 }
    );
  }

  if (found.usedAt) {
    return NextResponse.json({
      error: "Este código já foi utilizado",
      valid: false,
      used: true,
      productName: found.productName,
      usedAt: found.usedAt,
    });
  }

  // Code is valid — return product info (but NOT the link yet)
  return NextResponse.json({
    valid: true,
    productName: found.productName,
    productEmoji: found.productEmoji,
    productPrice: found.productPrice,
    codeId: found.id,
  });
}
