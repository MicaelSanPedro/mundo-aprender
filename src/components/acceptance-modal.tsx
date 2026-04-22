"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileText, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "mundo-aprender-termos-aceitos";
const ACCEPTANCE_VERSION = "2025-04-23";

export function hasAcceptedTerms(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.version === ACCEPTANCE_VERSION && parsed.accepted === true;
    }
  } catch {}
  return false;
}

interface AcceptanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AcceptanceModal({ isOpen, onClose }: AcceptanceModalProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  if (!isOpen) return null;

  const canAccept = acceptedTerms && acceptedPrivacy;

  const handleAccept = () => {
    if (!acceptedTerms || !acceptedPrivacy) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accepted: true,
          version: ACCEPTANCE_VERSION,
          acceptedAt: new Date().toISOString(),
        })
      );
    } catch {}
    setAcceptedTerms(false);
    setAcceptedPrivacy(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.preventDefault()}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Header gradient */}
            <div className="gradient-hero p-6 sm:p-8 rounded-t-2xl sm:rounded-t-3xl relative overflow-hidden">
              <div className="absolute top-2 right-4 text-4xl opacity-20 animate-float">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div className="absolute bottom-3 left-6 text-3xl opacity-15 animate-float-delay-1">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Aceite os Termos
                    </h2>
                    <p className="text-white/80 text-xs sm:text-sm">
                      Necessario para continuar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                Para prosseguir com a compra ou ativacao de produto, e necessario que
                voce leia e aceite nossos Termos de Uso e Politica de Privacidade,
                em conformidade com a LGPD (Lei 13.709/2018).
              </p>

              {/* Terms checkbox */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  acceptedTerms
                    ? "border-kid-green bg-kid-green/5"
                    : "border-kid-orange/20 bg-kid-orange/5 hover:border-kid-orange/40"
                }`}
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                      acceptedTerms
                        ? "bg-kid-green border-kid-green"
                        : "border-gray-300 peer-hover:border-kid-orange"
                    }`}
                  >
                    {acceptedTerms && <CheckCircle2 className="h-5 w-5 text-white" />}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-foreground">
                    Li e aceito os{" "}
                    <Link
                      href="/termos-de-uso"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-kid-blue hover:text-kid-blue/70 underline decoration-kid-blue/30 hover:decoration-kid-blue transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Termos de Uso
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </span>
                  <p className="text-xs text-foreground/50 mt-1">
                    Regras de utilizacao, compra, propriedade intelectual e limitacoes.
                  </p>
                </div>
              </label>

              {/* Privacy checkbox */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  acceptedPrivacy
                    ? "border-kid-green bg-kid-green/5"
                    : "border-kid-blue/20 bg-kid-blue/5 hover:border-kid-blue/40"
                }`}
              >
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                      acceptedPrivacy
                        ? "bg-kid-green border-kid-green"
                        : "border-gray-300 peer-hover:border-kid-blue"
                    }`}
                  >
                    {acceptedPrivacy && <CheckCircle2 className="h-5 w-5 text-white" />}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-foreground">
                    Li e aceito a{" "}
                    <Link
                      href="/politica-de-privacidade"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-kid-blue hover:text-kid-blue/70 underline decoration-kid-blue/30 hover:decoration-kid-blue transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Politica de Privacidade
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </span>
                  <p className="text-xs text-foreground/50 mt-1">
                    Coleta, uso, armazenamento e protecao dos seus dados pessoais.
                  </p>
                </div>
              </label>

              {/* Accept button */}
              <Button
                onClick={handleAccept}
                disabled={!canAccept}
                className={`w-full rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base py-3.5 sm:py-4 transition-all duration-300 ${
                  canAccept
                    ? "bg-kid-green hover:bg-kid-green/90 text-white shadow-kid-green hover:shadow-lg active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Aceitar e Continuar
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
