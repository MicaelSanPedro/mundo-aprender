import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

// ─── MP Limits ───────────────────────────────────────────
const MP = {
  MAX_TITLE_LEN: 256,
  MIN_UNIT_PRICE: 0.01,
  MAX_UNIT_PRICE: 99999999.99,
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 999,
  MAX_ITEMS: 20,
  MAX_STATEMENT_LEN: 14,
} as const;

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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname.includes(".");
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer, total } = body;

    // ─── Validate items ──────────────────────────────────
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items são obrigatórios e devem ser um array não vazio" },
        { status: 400 }
      );
    }

    if (items.length > MP.MAX_ITEMS) {
      return NextResponse.json(
        { error: `Máximo de ${MP.MAX_ITEMS} itens por pedido` },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item.id || !item.name || typeof item.price !== "number" || typeof item.quantity !== "number") {
        return NextResponse.json(
          { error: "Cada item deve ter id, name, price e quantity válidos" },
          { status: 400 }
        );
      }
      if (item.name.length > MP.MAX_TITLE_LEN) {
        return NextResponse.json(
          { error: `Título do item excede ${MP.MAX_TITLE_LEN} caracteres` },
          { status: 400 }
        );
      }
      if (item.quantity < MP.MIN_QUANTITY || item.quantity > MP.MAX_QUANTITY) {
        return NextResponse.json(
          { error: `Quantidade deve ser entre ${MP.MIN_QUANTITY} e ${MP.MAX_QUANTITY}` },
          { status: 400 }
        );
      }
      if (item.price < MP.MIN_UNIT_PRICE || item.price > MP.MAX_UNIT_PRICE) {
        return NextResponse.json(
          { error: `Preço deve ser entre R$ ${MP.MIN_UNIT_PRICE} e R$ ${MP.MAX_UNIT_PRICE}` },
          { status: 400 }
        );
      }
    }

    // ─── Validate customer ───────────────────────────────
    if (!customer || !customer.name || !customer.email) {
      return NextResponse.json(
        { error: "Nome e email do cliente são obrigatórios" },
        { status: 400 }
      );
    }

    const trimmedName = customer.name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { error: "Nome deve ter entre 2 e 100 caracteres" },
        { status: 400 }
      );
    }

    const trimmedEmail = customer.email.trim();
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // ─── Validate access token ───────────────────────────
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Mercado Pago access token não configurado" },
        { status: 500 }
      );
    }

    // ─── Validate BASE_URL (must be HTTPS, public, valid) ─
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl || !isValidUrl(baseUrl)) {
      console.error("[MP] NEXT_PUBLIC_BASE_URL inválida:", baseUrl || "não definida");
      return NextResponse.json(
        { error: "URL base do site não configurada corretamente. Contate o suporte." },
        { status: 500 }
      );
    }

    // ─── Calculate total ─────────────────────────────────
    const orderTotal =
      total ||
      items.reduce(
        (sum: number, item: OrderItem) => sum + item.price * item.quantity,
        0
      );

    const orderId = generateId();

    const nameParts = trimmedName.split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Extract phone digits only
    const phoneDigits = customer.phone ? customer.phone.replace(/\D/g, "") : "";
    const payerPhone = phoneDigits.length >= 10 && phoneDigits.length <= 11 ? phoneDigits : undefined;

    // ─── Build Mercado Pago preference ───────────────────
    const mpItems = items.map((item: OrderItem) => ({
      id: String(item.id),
      title: item.name.substring(0, MP.MAX_TITLE_LEN),
      quantity: Math.min(Math.max(item.quantity, MP.MIN_QUANTITY), MP.MAX_QUANTITY),
      currency_id: "BRL" as const,
      unit_price: Math.round(item.price * 100) / 100, // ensure 2 decimal places
    }));

    const payer: Record<string, unknown> = {
      name: firstName.substring(0, 100),
      surname: lastName.substring(0, 100),
      email: trimmedEmail.toLowerCase(),
    };
    if (payerPhone) {
      payer.phone = { number: payerPhone };
    }

    const backUrls = {
      success: `${baseUrl}/api/payment/callback?status=approved&external_reference=${orderId}`,
      pending: `${baseUrl}/api/payment/callback?status=pending&external_reference=${orderId}`,
      failure: `${baseUrl}/api/payment/callback?status=rejected&external_reference=${orderId}`,
    };

    // Validate all back_urls are valid HTTPS URLs
    for (const [key, url] of Object.entries(backUrls)) {
      if (!isValidUrl(url)) {
        console.error(`[MP] back_url inválida (${key}):`, url);
        return NextResponse.json(
          { error: "Erro interno na configuração de pagamento" },
          { status: 500 }
        );
      }
    }

    const notificationUrl = `${baseUrl}/api/payment/webhook`;
    if (!isValidUrl(notificationUrl)) {
      console.error("[MP] notification_url inválida:", notificationUrl);
      return NextResponse.json(
        { error: "Erro interno na configuração de pagamento" },
        { status: 500 }
      );
    }

    const preferenceBody = {
      items: mpItems,
      payer,
      back_urls: backUrls,
      auto_return: "approved",
      notification_url: notificationUrl,
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
      console.error("Mercado Pago API error:", mpRes.status, errorText);

      // Detect common MP validation errors
      let userMessage = "Erro ao criar pagamento. Tente novamente.";
      try {
        const errJson = JSON.parse(errorText);
        if (errJson.cause?.length) {
          const causes = errJson.cause.map((c: { description?: string }) => c.description).filter(Boolean);
          if (causes.length) userMessage = `Pagamento inválido: ${causes.join("; ")}`;
        } else if (errJson.message) {
          userMessage = errJson.message;
        }
      } catch {
        // keep default message
      }

      return NextResponse.json({ error: userMessage }, { status: 502 });
    }

    const mpData = await mpRes.json();

    const now = new Date().toISOString();
    const order: Order = {
      id: orderId,
      orderNumber: generateOrderNumber(),
      items,
      customer: {
        name: trimmedName,
        email: trimmedEmail.toLowerCase(),
        phone: customer.phone || "",
      },
      total: orderTotal,
      status: "pendente",
      createdAt: now,
      updatedAt: now,
      mercadoPagoPreferenceId: String(mpData.id),
    };

    const orders = await readOrders();
    orders.push(order);
    await writeOrders(orders);

    // Return only production init_point (no sandbox to avoid cred mixing)
    return NextResponse.json(
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        initPoint: mpData.init_point,
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
