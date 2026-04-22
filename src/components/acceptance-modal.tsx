"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Shield, FileText, CheckCircle2, ExternalLink, ArrowLeft } from "lucide-react";

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
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!isOpen || !ready) return null;

  const canAccept = terms && privacy;

  function accept() {
    if (!terms || !privacy) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accepted: true,
        version: ACCEPTANCE_VERSION,
        acceptedAt: new Date().toISOString(),
      }));
    } catch {}
    setTerms(false);
    setPrivacy(false);
    onClose();
  }

  function back() {
    setTerms(false);
    setPrivacy(false);
    onClose();
  }

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={back}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          background: "white",
          borderRadius: "1.5rem",
          maxWidth: "32rem",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #FFD43B 0%, #FF922B 25%, #F783AC 50%, #B197FC 75%, #4DABF7 100%)",
            backgroundSize: "300% 300%",
            animation: "gradient-shift 12s ease infinite",
            padding: "1.5rem",
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Shield style={{ width: "1.5rem", height: "1.5rem", color: "white" }} />
            </div>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "white" }}>
                Aceite os Termos
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>
                Necessario para continuar
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <p style={{ fontSize: "0.875rem", color: "rgba(26,26,46,0.7)", lineHeight: 1.6 }}>
            Para prosseguir com a compra ou ativacao de produto, e necessario que
            voce leia e aceite nossos Termos de Uso e Politica de Privacidade,
            em conformidade com a LGPD (Lei 13.709/2018).
          </p>

          {/* Terms checkbox */}
          <button
            type="button"
            onClick={() => setTerms(!terms)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: `2px solid ${terms ? "#69DB7C" : "rgba(255,146,43,0.2)"}`,
              background: terms ? "rgba(105,219,124,0.05)" : "rgba(255,146,43,0.05)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div style={{ marginTop: "2px" }}>
              <div style={{
                width: "1.25rem",
                height: "1.25rem",
                borderRadius: "0.375rem",
                border: `2px solid ${terms ? "#69DB7C" : "#d1d5db"}`,
                background: terms ? "#69DB7C" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {terms && <CheckCircle2 style={{ width: "1.25rem", height: "1.25rem", color: "white" }} />}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a1a2e" }}>
                Li e aceito os{" "}
                <a
                  href="/termos-de-uso"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: "#4DABF7", textDecoration: "underline" }}
                >
                  Termos de Uso ↗
                </a>
              </span>
              <p style={{ fontSize: "0.75rem", color: "rgba(26,26,46,0.5)", marginTop: "0.25rem" }}>
                Regras de utilizacao, compra, propriedade intelectual e limitacoes.
              </p>
            </div>
          </button>

          {/* Privacy checkbox */}
          <button
            type="button"
            onClick={() => setPrivacy(!privacy)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: `2px solid ${privacy ? "#69DB7C" : "rgba(77,171,247,0.2)"}`,
              background: privacy ? "rgba(105,219,124,0.05)" : "rgba(77,171,247,0.05)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div style={{ marginTop: "2px" }}>
              <div style={{
                width: "1.25rem",
                height: "1.25rem",
                borderRadius: "0.375rem",
                border: `2px solid ${privacy ? "#69DB7C" : "#d1d5db"}`,
                background: privacy ? "#69DB7C" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {privacy && <CheckCircle2 style={{ width: "1.25rem", height: "1.25rem", color: "white" }} />}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1a1a2e" }}>
                Li e aceito a{" "}
                <a
                  href="/politica-de-privacidade"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: "#4DABF7", textDecoration: "underline" }}
                >
                  Politica de Privacidade ↗
                </a>
              </span>
              <p style={{ fontSize: "0.75rem", color: "rgba(26,26,46,0.5)", marginTop: "0.25rem" }}>
                Coleta, uso, armazenamento e protecao dos seus dados pessoais.
              </p>
            </div>
          </button>

          {/* Accept button */}
          <button
            type="button"
            onClick={accept}
            disabled={!canAccept}
            style={{
              width: "100%",
              borderRadius: "0.75rem",
              fontWeight: 700,
              fontSize: "0.875rem",
              padding: "0.875rem",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              cursor: canAccept ? "pointer" : "not-allowed",
              background: canAccept ? "#69DB7C" : "#e5e7eb",
              color: canAccept ? "white" : "#9ca3af",
              boxShadow: canAccept ? "0 8px 30px rgba(105,219,124,0.3)" : "none",
            }}
          >
            <CheckCircle2 style={{ width: "1.25rem", height: "1.25rem" }} />
            Aceitar e Continuar
          </button>

          {/* Back button */}
          <button
            type="button"
            onClick={back}
            style={{
              width: "100%",
              borderRadius: "0.75rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              padding: "0.75rem",
              border: "none",
              background: "transparent",
              color: "rgba(26,26,46,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            <ArrowLeft style={{ width: "1rem", height: "1rem" }} />
            Voltar para a loja
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
