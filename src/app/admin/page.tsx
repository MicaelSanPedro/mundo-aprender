"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomCursor from "@/components/CustomCursor";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Shield,
  Loader2,
} from "lucide-react";

const productOptions = [
  { id: 1, name: "O Código Secreto do Mundo", emoji: "🔢", price: 4.99 },
  { id: 2, name: "Pack de Atividades - 3º Ano (10 atividades)", emoji: "📚", price: 4.95 },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [creating, setCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [createError, setCreateError] = useState("");

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`/api/codes?password=${encodeURIComponent(password)}`);
      if (res.status === 401) {
        setLoginError("Senha incorreta");
        return;
      }
      setAuthenticated(true);
    } catch {
      setLoginError("Erro de conexão");
    } finally {
      setLoginLoading(false);
    }
  };

  const createCode = async () => {
    const product = productOptions[selectedProduct];
    if (!product) return;
    setCreating(true);
    setCreateError("");
    setCopied(false);
    try {
      const res = await fetch("/api/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, productId: product.id }),
      });
      const data = await res.json();
      if (res.status === 201) {
        setLastCode(data.code);
      } else {
        setCreateError(data.error || "Erro ao criar");
      }
    } catch {
      setCreateError("Erro de conexão");
    } finally {
      setCreating(false);
    }
  };

  const copyCode = () => {
    if (!lastCode) return;
    navigator.clipboard.writeText(lastCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = lastCode;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ─── Login Screen ──────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kid-purple/5 to-kid-blue/5 flex items-center justify-center p-4">
      <CustomCursor />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl border border-kid-purple/10 p-6 sm:p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-kid-purple/10 flex items-center justify-center mx-auto mb-3">
              <Shield className="h-7 w-7 text-kid-purple" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Painel Admin</h1>
            <p className="text-xs text-foreground/50 mt-1">Mundo Aprender — Códigos de Ativação</p>
          </div>

          <div className="space-y-3">
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
              placeholder="Senha de acesso"
              className="h-12 rounded-xl"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoFocus
            />

            {loginError && (
              <p className="text-xs font-semibold text-red-500 text-center">{loginError}</p>
            )}

            <Button
              onClick={handleLogin}
              disabled={!password || loginLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-kid-purple to-kid-blue text-white font-bold"
            >
              {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Admin Dashboard ────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <CustomCursor />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kid-purple/10 flex items-center justify-center">
              <KeyRound className="h-4.5 w-4.5 text-kid-purple" />
            </div>
            <h1 className="text-sm font-bold text-foreground">Gerar Códigos</h1>
          </div>
          <div className="flex items-center gap-1">
            <a
              href="/"
              className="rounded-xl text-xs text-kid-blue hover:text-kid-blue/70 bg-kid-blue/10 hover:bg-kid-blue/15 px-2.5 py-1.5 transition-colors"
            >
              ← Voltar ao site
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setAuthenticated(false); setPassword(""); setLastCode(null); }}
              className="rounded-xl text-xs text-foreground/40"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Generate */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Plus className="h-4 w-4 text-kid-green" />
            Novo Código
          </h2>

          <div className="space-y-3">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(Number(e.target.value))}
              className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm bg-gray-50 focus:outline-none focus:border-kid-purple/50"
            >
              {productOptions.map((p, i) => (
                <option key={p.id} value={i}>{p.emoji} {p.name} — R$ {p.price.toFixed(2)}</option>
              ))}
            </select>

            <Button
              onClick={createCode}
              disabled={creating}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-kid-purple to-kid-blue text-white font-bold text-sm"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <Plus className="h-4 w-4 mr-1.5" />
                  Gerar Código
                </>
              )}
            </Button>

            {createError && (
              <p className="text-xs font-semibold text-red-500">{createError}</p>
            )}
          </div>
        </div>

        {/* Generated code display */}
        {lastCode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-kid-green/30 p-5 text-center"
          >
            <p className="text-xs text-foreground/50 font-medium mb-2">Código gerado com sucesso!</p>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-2xl sm:text-3xl font-mono font-bold tracking-[0.15em] text-foreground select-all">
                {lastCode}
              </p>
            </div>

            <Button
              onClick={copyCode}
              className={`w-full h-11 rounded-xl font-bold text-sm transition-all ${
                copied
                  ? "bg-kid-green text-white"
                  : "bg-kid-blue hover:bg-kid-blue/90 text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5" />
                  Copiar Código
                </>
              )}
            </Button>

            <p className="text-[10px] text-foreground/30 mt-3">
              Envie este código ao cliente pelo WhatsApp após confirmar o pagamento
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
