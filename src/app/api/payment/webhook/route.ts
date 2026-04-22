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
  mercadoPagoId?: string;
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("[WEBHOOK EMAIL] NEXT_PUBLIC_BASE_URL não configurada");
      return false;
    }
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

// Webhook do Mercado Pago - recebe notificação de pagamento
export async function POST(request: NextRequest) {
  try {
    // Mercado Pago envia different formats:
    // Query params: ?data.id=12345&type=payment
    // Ou body JSON
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get("data.id");
    const queryType = searchParams.get("type");

    // Tentar ler body se existir
    let bodyData = null;
    try {
      bodyData = await request.json();
    } catch {
      // Sem body, usar query params
    }

    // Se é notificação de pagamento
    if ((queryType === "payment" || bodyData?.type === "payment") && (queryId || bodyData?.data?.id)) {
      const paymentId = queryId || bodyData?.data?.id;
      console.log(`[MP WEBHOOK] Notificação de pagamento: ${paymentId}`);

      // Consultar o pagamento no Mercado Pago pra pegar o status
      const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
      if (!accessToken) {
        console.error("[MP WEBHOOK] Sem access token configurado");
        return NextResponse.json({ received: true });
      }

      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (mpRes.ok) {
        const mpPayment = await mpRes.json();
        const externalRef = mpPayment.external_reference;
        const mpStatus = mpPayment.status; // "approved", "pending", "rejected", etc.

        console.log(`[MP WEBHOOK] Status: ${mpStatus}, External ref: ${externalRef}`);

        if (mpStatus === "approved" && externalRef) {
          // Encontrar pedido pelo external_reference (que é o nosso order.id)
          const orders = await readOrders();
          const orderIndex = orders.findIndex((o) => o.id === externalRef);

          if (orderIndex !== -1) {
            if (orders[orderIndex].status !== "enviado") {
              orders[orderIndex].status = "enviado";
              orders[orderIndex].updatedAt = new Date().toISOString();

              // Enviar email
              const emailSent = await sendConfirmationEmail(orders[orderIndex]);
              orders[orderIndex].emailSent = emailSent;

              await writeOrders(orders);
              console.log(`[MP WEBHOOK] Pedido ${orders[orderIndex].orderNumber} atualizado para enviado. Email: ${emailSent ? "sim" : "nao"}`);
            }
          } else {
            console.log(`[MP WEBHOOK] Pedido não encontrado para ref: ${externalRef}`);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[MP WEBHOOK] Erro:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
