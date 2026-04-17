import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

interface OrderItem {
  id: number;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customer: Customer;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  abacatePayId?: string;
}

async function readOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    const dir = path.dirname(ORDERS_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(ORDERS_FILE, "[]", "utf-8");
    return [];
  }
}

async function writeOrders(orders: Order[]): Promise<void> {
  const dir = path.dirname(ORDERS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

function generateOrderNumber(): string {
  const digits = Math.floor(10000 + Math.random() * 90000);
  return `#MP-${digits}`;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer, total } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required and must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!customer || !customer.name || !customer.email) {
      return NextResponse.json(
        { error: "Customer name and email are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ABACATEPAY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Payment API key not configured" },
        { status: 500 }
      );
    }

    // Calcular total em centavos
    const totalInCents = Math.round(
      (total || items.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0)) * 100
    );

    // Criar QR Code PIX via AbacatePay API v1
    const description = items.map((i: OrderItem) => i.name).join(", ");

    const abacatePayRes = await fetch("https://api.abacatepay.com/v1/pixQrCode/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: totalInCents,
        description: `Mundo Aprender - ${description}`,
        metadata: {
          customerEmail: customer.email,
          customerName: customer.name,
        },
      }),
    });

    if (!abacatePayRes.ok) {
      const errorText = await abacatePayRes.text();
      console.error("AbacatePay API error:", abacatePayRes.status, errorText);
      return NextResponse.json(
        { error: "Erro ao gerar QR Code. Tente novamente." },
        { status: 502 }
      );
    }

    const abacatePayData = await abacatePayRes.json();

    if (!abacatePayData.success || !abacatePayData.data) {
      console.error("AbacatePay response error:", JSON.stringify(abacatePayData));
      return NextResponse.json(
        { error: "Erro ao gerar pagamento. Tente novamente." },
        { status: 502 }
      );
    }

    const pixData = abacatePayData.data;

    // Criar pedido no sistema local
    const now = new Date().toISOString();
    const order: Order = {
      id: generateId(),
      orderNumber: generateOrderNumber(),
      items,
      customer,
      total: totalInCents / 100,
      status: "pendente",
      createdAt: now,
      updatedAt: now,
      abacatePayId: pixData.id,
    };

    const orders = await readOrders();
    orders.push(order);
    await writeOrders(orders);

    // Retornar dados do pedido + QR Code
    return NextResponse.json({
      ...order,
      pixQrCode: pixData.brCodeBase64, // imagem do QR Code em base64
      pixBrCode: pixData.brCode, // código copia-e-cola
      paymentStatus: pixData.status,
    }, { status: 201 });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json(
      { error: "Erro ao processar pedido. Tente novamente." },
      { status: 400 }
    );
  }
}
