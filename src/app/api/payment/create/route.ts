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
  mercadoPagoPreferenceId?: string;
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
    const orderTotal =
      total ||
      items.reduce(
        (sum: number, item: OrderItem) => sum + item.price * item.quantity,
        0
      );

    // Gerar ID único para o pedido
    const orderId = generateId();

    // URL base da aplicação
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Montar itens no formato do Mercado Pago
    const mpItems = items.map((item: OrderItem) => ({
      id: String(item.id),
      title: item.name,
      quantity: item.quantity,
      currency_id: "BRL",
      unit_price: Number(item.price.toFixed(2)),
    }));

    // Separar nome e sobrenome
    const nameParts = customer.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Criar Preference do Mercado Pago (Checkout Pro)
    const preferenceBody = {
      items: mpItems,
      payer: {
        name: firstName,
        surname: lastName,
        email: customer.email,
        phone: {
          number: customer.phone.replace(/\D/g, "") || "11999999999",
        },
      },
      back_urls: {
        success: `${baseUrl}/api/payment/callback?status=approved&external_reference=${orderId}`,
        pending: `${baseUrl}/api/payment/callback?status=pending&external_reference=${orderId}`,
        failure: `${baseUrl}/api/payment/callback?status=rejected&external_reference=${orderId}`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/payment/webhook`,
      external_reference: orderId,
      statement_descriptor: "MUNDO APRENDER",
    };

    const mpRes = await fetch(
      "https://api.mercadopago.com/v1/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Idempotency-Key": orderId,
        },
        body: JSON.stringify(preferenceBody),
      }
    );

    if (!mpRes.ok) {
      const errorText = await mpRes.text();
      console.error(
        "Mercado Pago Preference API error:",
        mpRes.status,
        errorText
      );
      return NextResponse.json(
        { error: "Erro ao criar pagamento. Tente novamente." },
        { status: 502 }
      );
    }

    const mpData = await mpRes.json();

    // Salvar pedido local
    const now = new Date().toISOString();
    const order: Order = {
      id: orderId,
      orderNumber: generateOrderNumber(),
      items,
      customer,
      total: orderTotal,
      status: "pendente",
      createdAt: now,
      updatedAt: now,
      mercadoPagoPreferenceId: String(mpData.id),
    };

    const orders = await readOrders();
    orders.push(order);
    await writeOrders(orders);

    // Retornar URL do checkout do Mercado Pago
    return NextResponse.json(
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        // Use sandbox_init_point for testing, init_point for production
        initPoint: mpData.init_point,
        sandboxInitPoint: mpData.sandbox_init_point,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json(
      { error: "Erro ao processar pedido. Tente novamente." },
      { status: 400 }
    );
  }
}
