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

// Disparar email de confirmação com link de download
async function sendConfirmationEmail(order: Order) {
  // Não enviar se já foi enviado
  if (order.emailSent) return;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/payment/send-email`, {
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
      console.log(`[EMAIL] Enviado com sucesso para ${order.customer.email} - Pedido ${order.orderNumber}`);
      return true;
    } else {
      console.log(`[EMAIL] Não enviado: ${result.reason || "desconhecido"}`);
      return false;
    }
  } catch (error) {
    console.error("[EMAIL] Falha ao enviar:", error);
    return false;
  }
}

// GET single order by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orders = await readOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

// PUT update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["pendente", "em processamento", "enviado", "entregue", "cancelado"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const orders = await readOrders();
    const orderIndex = orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    // Quando o status muda para "enviado", enviar email automaticamente
    if (status === "enviado" && !orders[orderIndex].emailSent) {
      const emailSent = await sendConfirmationEmail(orders[orderIndex]);
      orders[orderIndex].emailSent = emailSent;
    }

    await writeOrders(orders);

    return NextResponse.json(orders[orderIndex]);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// DELETE cancel/delete order
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orders = await readOrders();
  const orderIndex = orders.findIndex((o) => o.id === id);

  if (orderIndex === -1) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const deletedOrder = orders[orderIndex];
  orders.splice(orderIndex, 1);
  await writeOrders(orders);

  return NextResponse.json({ message: "Order deleted", order: deletedOrder });
}
