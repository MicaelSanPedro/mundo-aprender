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

interface DDDSelectorProps {
  selectedDDD: string;
  selectedState: string;
  onStateChange: (uf: string) => void;
  onDDDChange: (ddd: string) => void;
}

export default function DDDSelector({
  selectedDDD,
  selectedState,
  onStateChange,
  onDDDChange,
}: DDDSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDDDPicker, setShowDDDPicker] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  const stateObj = BRAZILIAN_STATES.find((s) => s.abbreviation === selectedState);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowDDDPicker(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if ((isOpen || showDDDPicker) && searchRef.current) {
      // Only focus if the search is visible
      if (isOpen && !showDDDPicker) {
        searchRef.current.focus();
      }
    }
  }, [isOpen, showDDDPicker]);

  const pickState = (state: BrazilianState) => {
    onStateChange(state.abbreviation);
    if (state.ddd.length === 1) {
      onDDDChange(state.ddd[0]);
      setIsOpen(false);
      setShowDDDPicker(false);
      setSearch("");
    } else {
      // Multiple DDDs — show DDD picker
      setShowDDDPicker(true);
      onDDDChange("");
      setSearch("");
    }
  };

  const pickDDD = (ddd: string) => {
    onDDDChange(ddd);
    setShowDDDPicker(false);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      {/* Compact trigger button */}
      <button
        type="button"
        onClick={() => {
          if (showDDDPicker) {
            setShowDDDPicker(false);
            setIsOpen(true);
          } else {
            setIsOpen(!isOpen);
            setShowDDDPicker(false);
          }
        }}
        className={`h-9 flex items-center gap-0.5 px-1.5 rounded-l-2xl border-2 border-r-0 text-xs font-bold transition-all duration-200 cursor-pointer ${
          selectedDDD
            ? "border-kid-orange/40 bg-kid-orange/5 text-kid-orange"
            : "border-kid-orange/20 bg-foreground/[0.02] text-foreground/40 hover:border-kid-orange/30"
        }`}
        title={stateObj ? `${stateObj.name} (${stateObj.abbreviation})` : "Selecione o estado"}
      >
        <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        {selectedDDD ? (
          <span>{selectedDDD}</span>
        ) : (
          <span>DDD</span>
        )}
      </button>

      {/* Dropdown: States + Search */}
      {isOpen && !showDDDPicker && (
        <div className="absolute z-50 mt-1 left-0 w-64 bg-white rounded-2xl border-2 border-kid-orange/20 shadow-xl shadow-black/8 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Search */}
          <div className="p-2 border-b border-foreground/5">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 17a6 6 0 1 0-6-6 6 6 0 0 0 6 6Z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                placeholder="Buscar estado ou DDD..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-foreground/[0.03] border border-foreground/5 focus:border-kid-orange/30 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* State list */}
          <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
            {filteredStates.length === 0 ? (
              <p className="py-4 text-center text-xs text-foreground/30">Nenhum encontrado</p>
            ) : (
              filteredStates.map((state) => (
                <button
                  key={state.abbreviation}
                  type="button"
                  onClick={() => pickState(state)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-all duration-100 ${
                    selectedState === state.abbreviation
                      ? "bg-kid-orange/10 text-kid-orange"
                      : "hover:bg-foreground/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold w-7 text-center rounded-md py-0.5 ${
                      selectedState === state.abbreviation
                        ? "bg-kid-orange text-white"
                        : "bg-foreground/5 text-foreground/50"
                    }`}>
                      {state.abbreviation}
                    </span>
                    <span className="text-xs text-foreground/70">{state.name}</span>
                  </div>
                  <span className="text-[10px] text-foreground/25 shrink-0">
                    {state.ddd.join(", ")}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* DDD Picker (multiple DDDs) */}
      {showDDDPicker && stateObj && stateObj.ddd.length > 1 && (
        <div className="absolute z-50 mt-1 left-0 w-48 bg-white rounded-2xl border-2 border-kid-orange/20 shadow-xl shadow-black/8 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="p-2.5 border-b border-foreground/5">
            <p className="text-[10px] font-semibold text-foreground/50">
              DDD de <span className="text-kid-orange">{stateObj.name}</span>
            </p>
          </div>
          <div className="p-1">
            {stateObj.ddd.map((ddd) => (
              <button
                key={ddd}
                type="button"
                onClick={() => pickDDD(ddd)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-100 ${
                  selectedDDD === ddd
                    ? "bg-kid-green/10 text-kid-green"
                    : "hover:bg-foreground/[0.03]"
                }`}
              >
                <span className={`text-xs font-bold rounded-md py-0.5 px-2.5 ${
                  selectedDDD === ddd
                    ? "bg-kid-green text-white"
                    : "bg-foreground/5 text-foreground/50"
                }`}>
                  {ddd}
                </span>
                {selectedDDD === ddd && (
                  <svg className="w-3.5 h-3.5 text-kid-green shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="p-1.5 border-t border-foreground/5">
            <button
              type="button"
              onClick={() => {
                setShowDDDPicker(false);
                setIsOpen(true);
              }}
              className="w-full text-center text-[10px] text-foreground/35 hover:text-foreground/55 py-1 transition-colors"
            >
              Voltar para estados
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { BRAZILIAN_STATES };
export type { BrazilianState };
