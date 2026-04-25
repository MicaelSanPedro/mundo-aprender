"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomCursor from "@/components/CustomCursor";
import { PRODUCT_LIST } from "@/config/products";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Shield,
  Loader2,
  LogOut,
  ExternalLink
} from "lucide-react";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [creating, setCreating] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(PRODUCT_LIST[0].id);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [createError, setCreateError] = useState("");

  const handleLogin = async () => {
    if (!password) return;
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
    setCreating(true);
    setCreateError("");
    setCopied(false);
    try {
      const res = await fetch("/api/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, productId: selectedProductId }),
      });
      const data = await res.json();
      if (res.status === 201 || data.success) {
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
    });
  };

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
            <p className="text-xs text-foreground/50 mt-1">Mundo Aprender — Gestão de Chaves</p>
          </div>

          <div className="space-y-3">
            <Input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
              placeholder="Senha de acesso"
              className="h-12 rounded-xl border-2 focus:border-kid-purple/50"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoFocus
            />

            {loginError && (
              <p className="text-xs font-semibold text-red-500 text-center bg-red-50 p-2 rounded-lg">{loginError}</p>
            )}

            <Button
              onClick={handleLogin}
              disabled={!password || loginLoading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-kid-purple to-kid-blue text-white font-bold shadow-lg active:scale-95 transition-transform"
            >
              {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar no Painel"}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <CustomCursor />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kid-purple/10 flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-kid-purple" />
            </div>
            <h1 className="text-base font-bold text-foreground">Admin Mundo Aprender</h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="hidden sm:flex items-center gap-1.5 rounded-xl text-xs font-bold text-kid-blue bg-kid-blue/10 px-3 py-2 hover:bg-kid-blue/15 transition-colors"
            >
              <ExternalLink size={14} /> Site
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setAuthenticated(false); setPassword(""); setLastCode(null); }}
              className="rounded-xl text-xs font-bold text-red-400 hover:text-red-500 hover:bg-red-50"
            >
              <LogOut size={14} className="mr-1.5" /> Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Generate Section */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Plus className="h-4 w-4 text-kid-blue" />
              Gerar Nova Chave de Ativação
            </h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground/40 uppercase ml-1">Produto</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="w-full h-12 rounded-2xl border-2 border-gray-100 px-4 text-sm bg-white focus:outline-none focus:border-kid-purple/30 transition-all appearance-none cursor-pointer"
              >
                {PRODUCT_LIST.map((p) => (
                  <option key={p.id} value={p.id}>{p.emoji} {p.name} — R$ {p.price.toFixed(2)}</option>
                ))}
              </select>
            </div>

            <Button
              onClick={createCode}
              disabled={creating}
              className="w-full h-13 rounded-2xl bg-gradient-to-r from-kid-purple to-kid-blue text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
            >
              {creating ? <Loader2 className="h-5 w-5 animate-spin" /> : "Gerar Código de Ativação"}
            </Button>

            {createError && (
              <p className="text-xs font-bold text-red-500 text-center bg-red-50 p-3 rounded-xl">{createError}</p>
            )}
          </div>
        </div>

        {/* Generated Code Result */}
        <AnimatePresence>
          {lastCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border-2 border-kid-green/20 shadow-xl shadow-kid-green/5 p-6 text-center space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kid-green/10 text-kid-green text-[10px] font-bold uppercase tracking-wider">
                <Check size={12} /> Código Gerado com Sucesso
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200">
                <p className="text-3xl sm:text-4xl font-mono font-bold tracking-[0.2em] text-foreground select-all">
                  {lastCode}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={copyCode}
                  className={`h-12 rounded-2xl font-bold text-sm transition-all ${
                    copied
                      ? "bg-kid-green text-white"
                      : "bg-white border-2 border-gray-200 text-foreground hover:bg-gray-50"
                  }`}
                >
                  {copied ? (
                    <><Check className="h-4 w-4 mr-2" /> Copiado!</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-2 text-kid-blue" /> Copiar Código</>
                  )}
                </Button>
                
                <a 
                  href={`https://wa.me/?text=Olá! Aqui está sua chave de ativação para o Mundo Aprender: *${lastCode}*. Ative em: https://mundoaprender.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 rounded-2xl bg-kid-green text-white hover:bg-kid-green/90 font-bold flex items-center justify-center shadow-md active:scale-95 transition-transform"
                >
                  Enviar WhatsApp
                </a>
              </div>

              <p className="text-[10px] text-foreground/30 italic">
                O cliente deve inserir este código no modal de ativação do site para liberar o download.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
