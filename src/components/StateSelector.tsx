"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";

interface BrazilianState {
  abbreviation: string;
  name: string;
  ddd: string[];
}

const BRAZILIAN_STATES: BrazilianState[] = [
  { abbreviation: "AC", name: "Acre", ddd: ["68"] },
  { abbreviation: "AL", name: "Alagoas", ddd: ["82"] },
  { abbreviation: "AM", name: "Amazonas", ddd: ["92", "97"] },
  { abbreviation: "AP", name: "Amapá", ddd: ["96"] },
  { abbreviation: "BA", name: "Bahia", ddd: ["71", "73", "74", "75", "77"] },
  { abbreviation: "CE", name: "Ceará", ddd: ["85", "88"] },
  { abbreviation: "DF", name: "Distrito Federal", ddd: ["61"] },
  { abbreviation: "ES", name: "Espírito Santo", ddd: ["27", "28"] },
  { abbreviation: "GO", name: "Goiás", ddd: ["62", "64"] },
  { abbreviation: "MA", name: "Maranhão", ddd: ["98", "99"] },
  { abbreviation: "MG", name: "Minas Gerais", ddd: ["31", "32", "33", "34", "35", "37", "38"] },
  { abbreviation: "MS", name: "Mato Grosso do Sul", ddd: ["67"] },
  { abbreviation: "MT", name: "Mato Grosso", ddd: ["65", "66"] },
  { abbreviation: "PA", name: "Pará", ddd: ["91", "93", "94"] },
  { abbreviation: "PB", name: "Paraíba", ddd: ["83"] },
  { abbreviation: "PE", name: "Pernambuco", ddd: ["81", "87"] },
  { abbreviation: "PI", name: "Piauí", ddd: ["86", "89"] },
  { abbreviation: "PR", name: "Paraná", ddd: ["41", "42", "43", "44", "45", "46"] },
  { abbreviation: "RJ", name: "Rio de Janeiro", ddd: ["21", "22", "24"] },
  { abbreviation: "RN", name: "Rio Grande do Norte", ddd: ["84"] },
  { abbreviation: "RO", name: "Rondônia", ddd: ["69"] },
  { abbreviation: "RR", name: "Roraima", ddd: ["95"] },
  { abbreviation: "RS", name: "Rio Grande do Sul", ddd: ["51", "53", "54", "55"] },
  { abbreviation: "SC", name: "Santa Catarina", ddd: ["47", "48", "49"] },
  { abbreviation: "SE", name: "Sergipe", ddd: ["79"] },
  { abbreviation: "SP", name: "São Paulo", ddd: ["11", "12", "13", "14", "15", "16", "17", "18", "19"] },
  { abbreviation: "TO", name: "Tocantins", ddd: ["63"] },
];

interface StateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function StateSelector({ value, onChange }: StateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredStates = useMemo(() => {
    if (!search.trim()) return BRAZILIAN_STATES;
    const q = search.toLowerCase().trim();
    return BRAZILIAN_STATES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.abbreviation.toLowerCase().includes(q) ||
        s.ddd.some((d) => d.includes(q))
    );
  }, [search]);

  const selectedState = BRAZILIAN_STATES.find((s) => s.abbreviation === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <label className="text-sm font-semibold text-foreground/70 mb-1 block">
        Estado *
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-sm transition-all duration-200 ${
          selectedState
            ? "border-kid-orange/40 bg-white"
            : "border-kid-orange/20 bg-white hover:border-kid-orange/30"
        } ${isOpen ? "ring-2 ring-kid-orange/20 border-kid-orange" : ""}`}
      >
        {selectedState ? (
          <span className="flex items-center gap-2">
            <span className="font-bold text-kid-orange text-base">{selectedState.abbreviation}</span>
            <span className="text-foreground/70">{selectedState.name}</span>
            <span className="text-foreground/30 text-xs">DDD: {selectedState.ddd.join(", ")}</span>
          </span>
        ) : (
          <span className="text-foreground/30">Selecione seu estado</span>
        )}
        <svg
          className={`w-4 h-4 text-foreground/30 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-2xl border-2 border-kid-orange/20 shadow-xl shadow-black/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search input */}
          <div className="p-2 border-b border-foreground/5">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 17a6 6 0 1 0-6-6 6 6 0 0 0 6 6Z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar estado, UF ou DDD..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-foreground/[0.03] border border-foreground/5 focus:border-kid-orange/30 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* States list */}
          <div className="max-h-52 overflow-y-auto custom-scrollbar p-1">
            {filteredStates.length === 0 ? (
              <div className="py-6 text-center text-sm text-foreground/30">
                Nenhum estado encontrado
              </div>
            ) : (
              filteredStates.map((state) => (
                <button
                  key={state.abbreviation}
                  type="button"
                  onClick={() => {
                    onChange(state.abbreviation);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                    value === state.abbreviation
                      ? "bg-kid-orange/10 text-kid-orange"
                      : "hover:bg-foreground/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold w-8 text-center rounded-lg py-1 ${
                      value === state.abbreviation
                        ? "bg-kid-orange text-white"
                        : "bg-foreground/5 text-foreground/50"
                    }`}>
                      {state.abbreviation}
                    </span>
                    <span className="text-sm text-foreground/70">{state.name}</span>
                  </div>
                  <span className="text-xs text-foreground/25 shrink-0">
                    DDD {state.ddd.join(", ")}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { BRAZILIAN_STATES };
export type { BrazilianState };
