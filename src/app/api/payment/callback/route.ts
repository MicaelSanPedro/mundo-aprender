import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

interface Order {
  id: string;
  orderNumber: string;
  items: { id: number; name: string; price: number; emoji: string; quantity: number }[];
  customer: { name: string; email: string; phone: string };
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  mercadoPagoPreferenceId?: string;
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

// Enviar email de confirmação
async function sendConfirmationEmail(order: Order) {
  if (order.emailSent) return;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("[CALLBACK EMAIL] NEXT_PUBLIC_BASE_URL não configurada");
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
    return result.sent;
  } catch (error) {
    console.error("[CALLBACK EMAIL] Falha:", error);
    return false;
  }
}

function getBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL;
  if (!configured) {
    console.error("[CALLBACK] NEXT_PUBLIC_BASE_URL não configurada!");
  }
  return configured || "https://mundoaprender.vercel.app";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const externalReference = searchParams.get("external_reference");
    const paymentId = searchParams.get("payment_id");
    const collectionId = searchParams.get("collection_id");

    const baseUrl = getBaseUrl();

    // Se não tem external_reference, redirect pra home
    if (!externalReference) {
      return NextResponse.redirect(`${baseUrl}/`);
    }

    // Se o pagamento foi aprovado, atualizar o pedido
    if (status === "approved") {
      const orders = await readOrders();
      const orderIndex = orders.findIndex((o) => o.id === externalReference);

      if (orderIndex !== -1 && orders[orderIndex].status !== "enviado") {
        orders[orderIndex].status = "enviado";
        orders[orderIndex].updatedAt = new Date().toISOString();

        if (paymentId || collectionId) {
          orders[orderIndex].mercadoPagoPreferenceId = String(
            paymentId || collectionId
          );
        }

        // Enviar email
        const emailSent = await sendConfirmationEmail(orders[orderIndex]);
        orders[orderIndex].emailSent = emailSent;

        await writeOrders(orders);
        console.log(
          `[MP CALLBACK] Pedido ${orders[orderIndex].orderNumber} aprovado! Email: ${emailSent ? "sim" : "nao"}`
        );
      }
    }

    // Redirecionar pra home com parâmetros de status
    const params = new URLSearchParams({
      payment_status: status || "unknown",
      order_id: externalReference,
      payment_id: paymentId || collectionId || "",
    });

    return NextResponse.redirect(`${baseUrl}/?${params.toString()}`);
  } catch (error) {
    console.error("[MP CALLBACK] Erro:", error);
    return NextResponse.redirect(
      `${getBaseUrl()}/?payment_status=error`
    );
  }
}
