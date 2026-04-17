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
  emailSent?: boolean;
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

// Disparar email de confirmação
async function sendConfirmationEmail(order: Order) {
  if (order.emailSent) return;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/payment/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: order.orderNumber,
        items: order.items,
        customer: order.customer,
        total: order.total,
      }),
    });

    const result = await res.json();
    if (result.sent) {
      console.log(`[WEBHOOK EMAIL] Enviado para ${order.customer.email} - Pedido ${order.orderNumber}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("[WEBHOOK EMAIL] Falha:", error);
    return false;
  }
}

// Webhook recebe confirmação de pagamento da AbacatePay
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received webhook:", JSON.stringify(body));

    // AbacatePay v1 webhook
    const pixId = body.data?.id || body.id || body.paymentId;
    const status = body.data?.status || body.status;

    if (!pixId || !status) {
      return NextResponse.json(
        { error: "Missing payment ID or status" },
        { status: 400 }
      );
    }

    console.log(`Webhook: pixId=${pixId}, status=${status}`);

    if (status === "COMPLETED" || status === "PAID" || status === "paid" || status === "completed") {
      const orders = await readOrders();
      const orderIndex = orders.findIndex(
        (o) => o.abacatePayId === pixId
      );

      if (orderIndex !== -1) {
        if (orders[orderIndex].status !== "enviado") {
          orders[orderIndex].status = "enviado";
          orders[orderIndex].updatedAt = new Date().toISOString();

          // Enviar email com links de download
          const emailSent = await sendConfirmationEmail(orders[orderIndex]);
          orders[orderIndex].emailSent = emailSent;

          await writeOrders(orders);
          console.log(`Pedido ${orders[orderIndex].orderNumber} atualizado para enviado. Email: ${emailSent ? "sim" : "nao"}`);
        }
      } else {
        console.log(`Nenhum pedido encontrado para AbacatePay ID: ${pixId}`);
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
