import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CODES_FILE = path.join(process.cwd(), "data", "codes.json");

// Admin password — in production use env variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "mundo2024";

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
    const dir = path.dirname(CODES_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(CODES_FILE, "[]", "utf-8");
    return [];
  }
}

async function writeCodes(codes: ActivationCode[]): Promise<void> {
  const dir = path.dirname(CODES_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(CODES_FILE, JSON.stringify(codes, null, 2), "utf-8");
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments: string[] = [];
  for (let s = 0; s < 3; s++) {
    let segment = "";
    for (let i = 0; i < 4; i++) {
      segment += chars[Math.floor(Math.random() * chars.length)];
    }
    segments.push(segment);
  }
  return segments.join("-");
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// GET — list all codes (admin, requires password)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
  }

  const codes = await readCodes();
  const sorted = codes.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sorted);
}

// POST — create new code (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, productId, productName, productEmoji, productLink, productPrice } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    if (!productId || !productName || !productLink) {
      return NextResponse.json(
        { error: "productId, productName e productLink são obrigatórios" },
        { status: 400 }
      );
    }

    // Generate unique code (avoid collisions)
    const existingCodes = await readCodes();
    let code: string;
    let attempts = 0;
    do {
      code = generateCode();
      attempts++;
    } while (existingCodes.some((c) => c.code === code) && attempts < 10);

    const newCode: ActivationCode = {
      id: generateId(),
      code,
      productId,
      productName,
      productEmoji: productEmoji || "📦",
      productLink,
      productPrice: productPrice || 0,
      createdAt: new Date().toISOString(),
      usedAt: null,
      activatedBy: null,
    };

    existingCodes.push(newCode);
    await writeCodes(existingCodes);

    return NextResponse.json(newCode, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Requisição inválida" },
      { status: 400 }
    );
  }
}

// DELETE — delete a code (admin)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, codeId } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    if (!codeId) {
      return NextResponse.json({ error: "codeId é obrigatório" }, { status: 400 });
    }

    const codes = await readCodes();
    const filtered = codes.filter((c) => c.id !== codeId);

    if (filtered.length === codes.length) {
      return NextResponse.json({ error: "Código não encontrado" }, { status: 404 });
    }

    await writeCodes(filtered);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });
  }
}
