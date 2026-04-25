"use client";

import React from "react";
import { motion } from "framer-motion";

const categories = [
  { id: "matematica", emoji: "🔢", name: "Matemática", color: "bg-kid-blue", shadow: "shadow-kid-blue" },
  { id: "portugues", emoji: "📝", name: "Português", color: "bg-kid-pink", shadow: "shadow-kid-pink" },
  { id: "ciencias", emoji: "🔬", name: "Ciências", color: "bg-emerald-500", shadow: "shadow-emerald-500" },
  { id: "geografia", emoji: "🌍", name: "Geografia", color: "bg-amber-500", shadow: "shadow-amber-500" },
  { id: "artes", emoji: "🎨", name: "Artes", color: "bg-fuchsia-500", shadow: "shadow-fuchsia-500" },
  { id: "educacao-fisica", emoji: "⚽", name: "Educação Física", color: "bg-red-500", shadow: "shadow-red-500" },
];

export function Categories() {
  return (
    <section className="py-12 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className={`flex flex-col items-center gap-3 p-4 md:p-6 rounded-3xl bg-white border-2 border-transparent hover:border-gray-100 shadow-sm transition-all group`}
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${cat.color} flex items-center justify-center text-3xl md:text-4xl shadow-lg group-hover:rotate-6 transition-transform`}>
                {cat.emoji}
              </div>
              <span className="text-sm md:text-base font-bold text-foreground/80">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
