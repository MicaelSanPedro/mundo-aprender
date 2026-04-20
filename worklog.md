---
Task ID: 1
Agent: Main Agent
Task: Migrar integração de pagamento de AbacatePay/Mercado Pago Direct para Mercado Pago Checkout Pro

Work Log:
- Lidos todos os arquivos relevantes: .env, api/payment/create, check, webhook, page.tsx
- Adicionadas credenciais do Mercado Pago ao .env (ACCESS_TOKEN e PUBLIC_KEY)
- Reescrito /api/payment/create para criar Preference do Checkout Pro (em vez de Payment direto)
- Criado /api/payment/callback/route.ts para receber redirect do Mercado Pago após pagamento
- Mantidos /api/payment/check e /api/payment/webhook (compatíveis com MP)
- Atualizado page.tsx: handleCheckout agora redireciona pro checkout do MP
- Substituída tela de QR Code PIX por telas de resultado (approved, pending, rejected, error)
- Removidos: polling de PIX, cópia de código PIX, estado pixData/pixPolling/pixCopied
- Removido import QrCode (não mais necessário)
- Build passou sem erros

Stage Summary:
- Checkout Pro implementado com sucesso
- Fluxo: Cliente preenche dados → Revisa pedido → Clica "Ir para o Pagamento" → Redirecionado ao MP → Paga → MP redireciona de volta → Tela de resultado
- Suporta: pagamento aprovado (com download), pendente, recusado, erro
- Webhook ainda funciona para notificações assíncronas do MP
