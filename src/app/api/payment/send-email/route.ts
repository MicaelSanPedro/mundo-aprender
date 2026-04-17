import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
  link?: string;
}

interface Product {
  id: number;
  name: string;
  link?: string;
}

// Lista de produtos do site (mesma do page.tsx)
const products: Product[] = [
  {
    id: 1,
    name: "O Código Secreto do Mundo",
    link: "https://docs.google.com/document/d/1AW-YdqoprQcQzkLzMWE2G_PNwb5kEspQoQMAz4lXHe8/edit?usp=drivesdk",
  },
];

// Criar transporter do Gmail SMTP
function createTransporter() {
  const email = process.env.GMAIL_EMAIL;
  const password = process.env.GMAIL_APP_PASSWORD;

  if (!email || !password) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, items, customer, total } = body;

    if (!customer?.email || !orderNumber || !items) {
      return NextResponse.json(
        { error: "Dados insuficientes para enviar email" },
        { status: 400 }
      );
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.log(`[EMAIL SKIP] Sem GMAIL_EMAIL ou GMAIL_APP_PASSWORD. Pedido ${orderNumber} - ${customer.email}`);
      return NextResponse.json({ sent: false, reason: "no_gmail_config" });
    }

    // Montar lista de links de download dos itens
    const downloadItems = items.map((item: OrderItem) => {
      const product = products.find((p) => p.id === item.id);
      return {
        name: item.name,
        link: product?.link || "#",
        emoji: item.emoji,
      };
    });

    // Montar HTML do email
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f0f4ff; margin: 0; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(135deg, #00b4d8, #9b5de5); padding: 30px; text-align: center; }
            .header h1 { color: white; font-size: 24px; margin: 0; }
            .header p { color: rgba(255,255,255,0.85); font-size: 14px; margin: 8px 0 0; }
            .content { padding: 25px; }
            .greeting { font-size: 18px; color: #333; margin-bottom: 8px; }
            .subtext { font-size: 14px; color: #666; margin-bottom: 20px; }
            .order-badge { display: inline-block; background: #f0f4ff; padding: 8px 16px; border-radius: 12px; font-size: 13px; color: #00b4d8; font-weight: 700; margin-bottom: 20px; }
            .download-card { border: 2px solid #e8f4fd; border-radius: 16px; padding: 16px; margin-bottom: 12px; background: #fafcff; }
            .item-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
            .item-emoji { font-size: 24px; }
            .item-name { font-size: 15px; font-weight: 700; color: #333; }
            .download-btn { display: block; width: 100%; padding: 12px; background: linear-gradient(135deg, #00b4d8, #0077b6); color: white; text-align: center; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; }
            .download-btn:hover { opacity: 0.9; }
            .total-section { margin-top: 20px; padding-top: 15px; border-top: 2px dashed #e0e0e0; text-align: center; }
            .total-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
            .total-value { font-size: 28px; font-weight: 900; color: #333; margin: 4px 0; }
            .footer { padding: 20px; text-align: center; background: #fafafa; }
            .footer p { font-size: 12px; color: #999; margin: 4px 0; }
            .footer a { color: #00b4d8; text-decoration: none; }
            .confetti { font-size: 30px; text-align: center; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="confetti">🎉📚🌈</div>
              <h1>Mundo Aprender</h1>
              <p>Seu material educativo chegou!</p>
            </div>
            <div class="content">
              <p class="greeting">Olá, ${customer.name}! 🎉</p>
              <p class="subtext">O pagamento do seu pedido foi confirmado e seus materiais estão prontos para download.</p>
              <div class="order-badge">Pedido ${orderNumber}</div>

              ${downloadItems.map((item: { name: string; link: string; emoji: string }) => `
                <div class="download-card">
                  <div class="item-header">
                    <span class="item-emoji">${item.emoji}</span>
                    <span class="item-name">${item.name}</span>
                  </div>
                  <a href="${item.link}" target="_blank" class="download-btn">
                    📥 Baixar Material (PDF)
                  </a>
                </div>
              `).join("")}

              <div class="total-section">
                <p class="total-label">Valor total</p>
                <p class="total-value">R$ ${Number(total).toFixed(2)}</p>
              </div>
            </div>
            <div class="footer">
              <p>Obrigado por escolher o <strong>Mundo Aprender</strong>! 💜</p>
              <p>Qualquer dúvida, entre em contato conosco.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const gmailEmail = process.env.GMAIL_EMAIL!;

    const info = await transporter.sendMail({
      from: `"Mundo Aprender" <${gmailEmail}>`,
      to: customer.email,
      subject: `Seu material do Mundo Aprender chegou! Pedido ${orderNumber}`,
      html: htmlEmail,
    });

    console.log(`[EMAIL SENT] Pedido ${orderNumber} para ${customer.email} - MsgID: ${info.messageId}`);
    return NextResponse.json({ sent: true, messageId: info.messageId });
  } catch (error) {
    console.error("[EMAIL ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao enviar email", details: error instanceof Error ? error.message : "unknown" },
      { status: 500 }
    );
  }
}
