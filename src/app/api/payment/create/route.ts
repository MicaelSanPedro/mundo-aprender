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

    // Call AbacatePay API
    const abacatePayBody = {
      customer: {
        name: customer.name,
        email: customer.email,
        phone: (customer.phone || "").replace(/\D/g, ""),
      },
      products: items.map((item: OrderItem) => ({
        description: item.name,
        quantity: item.quantity,
        priceInCents: Math.round(item.price * 100),
      })),
      frequency: "ONE_TIME",
    };

    const abacatePayRes = await fetch("https://api.abacatepay.com/v2/payment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(abacatePayBody),
    });

    if (!abacatePayRes.ok) {
      const errorText = await abacatePayRes.text();
      console.error("AbacatePay API error:", abacatePayRes.status, errorText);
      return NextResponse.json(
        { error: "Failed to create payment. Please try again." },
        { status: 502 }
      );
    }

    const abacatePayData = await abacatePayRes.json();

    // Create order in local system
    const now = new Date().toISOString();
    const order: Order = {
      id: generateId(),
      orderNumber: generateOrderNumber(),
      items,
      customer,
      total: total || items.reduce((sum: number, item: OrderItem) => sum + item.price * item.quantity, 0),
      status: "pendente",
      createdAt: now,
      updatedAt: now,
      abacatePayId: abacatePayData.id,
    };

    const orders = await readOrders();
    orders.push(order);
    await writeOrders(orders);

    // Return combined data
    return NextResponse.json({
      ...order,
      pixQrCode: abacatePayData.pixQrCode,
      pixBrCode: abacatePayData.pixBrCode,
      paymentStatus: abacatePayData.status,
    }, { status: 201 });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
