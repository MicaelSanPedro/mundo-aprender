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
  mercadoPagoId?: string;
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

    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Mercado Pago access token not configured" },
        { status: 500 }
      );
    }

    // Calcular total
    const orderTotal = total || items.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0);
    const description = items.map((i: OrderItem) => i.name).join(", ");

    // Criar pagamento PIX via Mercado Pago
    const idempotencyKey = generateId();
    const mercadoPagoBody = {
      transaction_amount: Number(orderTotal.toFixed(2)),
      description: `Mundo Aprender - ${description}`,
      payment_method_id: "pix",
      payer: {
        email: customer.email,
        first_name: customer.name.split(" ")[0] || customer.name,
        last_name: customer.name.split(" ").slice(1).join(" ") || "",
        identification: {
          type: "CPF",
          number: "00000000000", // CPF genérico - o Mercado Pago não obriga CPF pra PIX
        },
      },
      external_reference: idempotencyKey,
      notification_url: process.env.MERCADO_PAGO_WEBHOOK_URL || "",
    };

    const mercadoPagoRes = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(mercadoPagoBody),
    });

    if (!mercadoPagoRes.ok) {
      const errorText = await mercadoPagoRes.text();
      console.error("Mercado Pago API error:", mercadoPagoRes.status, errorText);
      return NextResponse.json(
        { error: "Erro ao gerar pagamento PIX. Tente novamente." },
        { status: 502 }
      );
    }

    const mpData = await mercadoPagoRes.json();

    // Verificar se veio os dados do PIX
    const pixData = mpData.point_of_interaction?.transaction_data;
    if (!pixData?.qr_code_base64) {
      console.error("PIX data missing:", JSON.stringify(mpData).substring(0, 300));
      return NextResponse.json(
        { error: "Erro ao gerar QR Code PIX. Tente novamente." },
        { status: 502 }
      );
    }

    // Criar pedido no sistema local
    const now = new Date().toISOString();
    const order: Order = {
      id: idempotencyKey,
      orderNumber: generateOrderNumber(),
      items,
      customer,
      total: orderTotal,
      status: "pendente",
      createdAt: now,
      updatedAt: now,
      mercadoPagoId: String(mpData.id),
    };

    const orders = await readOrders();
    orders.push(order);
    await writeOrders(orders);

    // Retornar dados do pedido + QR Code
    return NextResponse.json({
      ...order,
      pixQrCode: `data:image/png;base64,${pixData.qr_code_base64}`,
      pixBrCode: pixData.qr_code,
      ticketUrl: pixData.ticket_url,
      paymentStatus: mpData.status,
    }, { status: 201 });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json(
      { error: "Erro ao processar pedido. Tente novamente." },
      { status: 400 }
    );
  }
}
