"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Como recebo meu material?",
    a: "Após a confirmação do pagamento, você recebe uma key de ativação pelo WhatsApp. Basta digitar a key no site para baixar seus PDFs pelo MediaFire! O acesso é vitalício e ilimitado.",
    emoji: "📩"
  },
  {
    q: "Quais as formas de pagamento?",
    a: "Por enquanto aceitamos apenas Pix. Após o pagamento, envie o comprovante pelo WhatsApp e receba sua key de ativação na mesma hora! Cartão de crédito em breve!",
    emoji: "💸"
  },
  {
    q: "Posso imprimir os materiais?",
    a: "Sim! Todos os materiais são enviados em formato PDF de alta qualidade, prontos para impressão em tamanho A4 ou qualquer outro formato que desejar.",
    emoji: "🖨️"
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-kid-purple/5">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-foreground mb-4">Dúvidas Frequentes</h2>
          <p className="text-foreground/60 font-medium">Tudo o que você precisa saber sobre o Mundo Aprender</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-3xl border-2 border-transparent hover:border-kid-purple/20 shadow-sm overflow-hidden transition-all">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{faq.emoji}</span>
                  <span className="font-bold text-foreground">{faq.q}</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-kid-purple transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-foreground/60 font-medium leading-relaxed border-t border-gray-50">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
