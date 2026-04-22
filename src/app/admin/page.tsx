"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  KeyRound,
  Plus,
  Copy,
  Trash2,
  Check,
  X,
  Shield,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface ActivationCode {
  id: string;
  code: string;
  productId: number;
  productName: string;
  productEmoji: string;
  productLink: string;
  productPrice: number;
  createdAt: string;
  usedAt: string | null;
  activatedBy: string | null;
}

// Products available for code generation
const productOptions = [
  { id: 1, name: "O Código Secreto do Mundo", emoji: "🔢", price: 4.99, link: "https://docs.google.com/document/d/1AW-YdqoprQcQzkLzMWE2G_PNwb5kEspQoQMAz4lXHe8/edit?usp=drivesdk" },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [createError, setCreateError] = useState("");

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/codes?password=${encodeURIComponent(password)}`);
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setCodes(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [password]);

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`/api/codes?password=${encodeURIComponent(password)}`);
      if (res.status === 401) {
        setLoginError("Senha incorreta");
        return;
      }
      const data = await res.json();
      setCodes(data);
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
    try {
      const res = await fetch("/api/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          productId: product.id,
          productName: product.name,
          productEmoji: product.emoji,
          productLink: product.link,
          productPrice: product.price,
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        setCodes((prev) => [data, ...prev]);
        setCopiedId(data.id);
        setTimeout(() => setCopiedId(null), 3000);
      } else {
        setCreateError(data.error || "Erro ao criar código");
      }
    } catch {
      setCreateError("Erro de conexão");
    } finally {
      setCreating(false);
    }
  };

  const deleteCode = async (codeId: string) => {
    try {
      const res = await fetch("/api/codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, codeId }),
      });
      if (res.ok) {
        setCodes((prev) => prev.filter((c) => c.id !== codeId));
        setDeleteConfirmId(null);
      }
    } catch {
      // silent
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  useEffect(() => {
    if (authenticated) fetchCodes();
  }, [authenticated, fetchCodes]);

  const activeCodes = codes.filter((c) => !c.usedAt);
  const usedCodes = codes.filter((c) => c.usedAt);

  // ─── Login Screen ──────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-kid-purple/5 to-kid-blue/5 flex items-center justify-center p-4">
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-kid-purple/10 flex items-center justify-center">
              <KeyRound className="h-4.5 w-4.5 text-kid-purple" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">Códigos de Ativação</h1>
              <p className="text-[10px] text-foreground/40">{activeCodes.length} disponíveis · {usedCodes.length} usados</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchCodes}
              disabled={loading}
              className="rounded-xl text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setAuthenticated(false); setPassword(""); }}
              className="rounded-xl text-xs text-foreground/40"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
        {/* Create new code */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <Plus className="h-4 w-4 text-kid-green" />
            Gerar Novo Código
          </h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(Number(e.target.value))}
              className="flex-1 h-10 rounded-xl border border-gray-200 px-3 text-sm bg-gray-50 focus:outline-none focus:border-kid-purple/50"
            >
              {productOptions.map((p, i) => (
                <option key={p.id} value={i}>{p.emoji} {p.name} — R$ {p.price.toFixed(2)}</option>
              ))}
            </select>

            <Button
              onClick={createCode}
              disabled={creating}
              className="h-10 rounded-xl bg-kid-green hover:bg-kid-green/90 text-white font-bold text-sm"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Gerar
                </>
              )}
            </Button>
          </div>

          {createError && (
            <p className="text-xs font-semibold text-red-500 mt-2">{createError}</p>
          )}
        </div>

        {/* Active codes */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-kid-green" />
              Códigos Disponíveis ({activeCodes.length})
            </h2>
          </div>

          {activeCodes.length === 0 ? (
            <p className="text-xs text-foreground/40 text-center py-6">Nenhum código disponível</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {activeCodes.map((code) => (
                <div key={code.id} className="px-4 py-3 flex items-center gap-3">
                  <span className="text-lg">{code.productEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{code.productName}</p>
                    <p className="text-[10px] text-foreground/40 font-mono">{code.code}</p>
                    <p className="text-[10px] text-foreground/30">{new Date(code.createdAt).toLocaleString("pt-BR")}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {copiedId === code.id ? (
                      <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs text-kid-green bg-kid-green/10">
                        <Check className="h-3 w-3 mr-1" />
                        Copiado!
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCode(code.code, code.id)}
                        className="h-8 rounded-lg text-xs bg-kid-blue/10 text-kid-blue hover:bg-kid-blue/20"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                    )}
                    {deleteConfirmId === code.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCode(code.id)}
                          className="h-8 rounded-lg text-xs text-red-600 bg-red-50 hover:bg-red-100"
                        >
                          Confirmar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(null)}
                          className="h-8 rounded-lg text-xs"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(code.id)}
                        className="h-8 w-8 rounded-lg text-foreground/30 hover:text-red-500 hover:bg-red-50 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Used codes */}
        {usedCodes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-300" />
                Códigos Utilizados ({usedCodes.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-50">
              {usedCodes.map((code) => (
                <div key={code.id} className="px-4 py-3 flex items-center gap-3 opacity-60">
                  <span className="text-lg">{code.productEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{code.productName}</p>
                    <p className="text-[10px] text-foreground/40 font-mono line-through">{code.code}</p>
                    <p className="text-[10px] text-foreground/30">
                      Usado em {code.usedAt ? new Date(code.usedAt).toLocaleString("pt-BR") : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
