import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const TOKENS_FILE = path.join(process.cwd(), "data", "download-tokens.json");

interface DownloadToken {
  token: string;
  orderId: string;
  productId: number;
  productName: string;
  email: string;
  downloadsLeft: number;
  expiresAt: string;
  createdAt: string;
}

async function readTokens(): Promise<DownloadToken[]> {
  try {
    const data = await fs.readFile(TOKENS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    const dir = path.dirname(TOKENS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(TOKENS_FILE, "[]", "utf-8");
    return [];
  }
}

async function writeTokens(tokens: DownloadToken[]): Promise<void> {
  const dir = path.dirname(TOKENS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf-8");
}

function generateToken(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 8) +
    Math.random().toString(36).substring(2, 8)
  );
}

// POST - Generate a download token (called after purchase)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, productId, productName, email } = body;

    if (!orderId || !productId || !productName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const token: DownloadToken = {
      token: generateToken(),
      orderId,
      productId,
      productName,
      email,
      downloadsLeft: 3,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    const tokens = await readTokens();
    tokens.push(token);
    await writeTokens(tokens);

    return NextResponse.json({
      token: token.token,
      expiresAt: token.expiresAt,
      downloadsLeft: token.downloadsLeft,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}

// GET - Validate token
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token: tokenParam } = await params;
  const tokens = await readTokens();
  const tokenData = tokens.find((t) => t.token === tokenParam);

  if (!tokenData) {
    return NextResponse.json({ error: "Token invalido" }, { status: 404 });
  }

  if (new Date(tokenData.expiresAt) < new Date()) {
    return NextResponse.json(
      { error: "Token expirado. Solicite um novo link de download." },
      { status: 410 }
    );
  }

  if (tokenData.downloadsLeft <= 0) {
    return NextResponse.json(
      { error: "Limite de downloads atingido (3 downloads permitidos)." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    valid: true,
    productName: tokenData.productName,
    downloadsLeft: tokenData.downloadsLeft,
    expiresAt: tokenData.expiresAt,
  });
}

// PATCH - Consume one download
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token: tokenParam } = await params;
  const tokens = await readTokens();
  const index = tokens.findIndex((t) => t.token === tokenParam);

  if (index === -1) {
    return NextResponse.json({ error: "Token invalido" }, { status: 404 });
  }

  if (new Date(tokens[index].expiresAt) < new Date()) {
    return NextResponse.json({ error: "Token expirado" }, { status: 410 });
  }

  if (tokens[index].downloadsLeft <= 0) {
    return NextResponse.json(
      { error: "Limite de downloads atingido" },
      { status: 403 }
    );
  }

  tokens[index].downloadsLeft -= 1;
  await writeTokens(tokens);

  return NextResponse.json({
    success: true,
    downloadsLeft: tokens[index].downloadsLeft,
  });
}
