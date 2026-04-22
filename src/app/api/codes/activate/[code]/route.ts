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

async function writeCodes(codes: ActivationCode[]): Promise<void> {
  const dir = path.dirname(CODES_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(CODES_FILE, JSON.stringify(codes, null, 2), "utf-8");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { customerName } = body;
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
        { error: "Código inválido" },
        { status: 404 }
      );
    }

    if (found.usedAt) {
      return NextResponse.json(
        { error: "Este código já foi utilizado", usedAt: found.usedAt },
        { status: 410 }
      );
    }

    // Activate the code
    found.usedAt = new Date().toISOString();
    found.activatedBy = customerName || null;
    await writeCodes(codes);

    return NextResponse.json({
      success: true,
      productName: found.productName,
      productEmoji: found.productEmoji,
      productLink: found.productLink,
    });
  } catch {
    return NextResponse.json(
      { error: "Requisição inválida" },
      { status: 400 }
    );
  }
}
