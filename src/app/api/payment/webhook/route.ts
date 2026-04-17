import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

interface Order {
  id: string;
  orderNumber: string;
  items: { id: number; name: string; price: number; emoji: string; quantity: number }[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
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
    return [];
  }
}

async function writeOrders(orders: Order[]): Promise<void> {
  const dir = path.dirname(ORDERS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Received webhook:", JSON.stringify(body));

    // AbacatePay webhook sends the payment status
    const paymentId = body.id || body.paymentId;
    const status = body.status;

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Missing payment ID or status" },
        { status: 400 }
      );
    }

    if (status === "PAID") {
      const orders = await readOrders();
      const orderIndex = orders.findIndex(
        (o) => o.abacatePayId === paymentId
      );

      if (orderIndex !== -1) {
        orders[orderIndex].status = "enviado";
        orders[orderIndex].updatedAt = new Date().toISOString();
        await writeOrders(orders);
        console.log(`Order ${orders[orderIndex].orderNumber} updated to enviado`);
      } else {
        console.log(`No order found for AbacatePay payment ID: ${paymentId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
