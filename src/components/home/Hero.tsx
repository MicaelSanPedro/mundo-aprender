"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0] 
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] w-32 h-32 bg-kid-yellow/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -8, 0] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[15%] right-[8%] w-48 h-48 bg-kid-blue/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-kid-purple/20 shadow-sm">
            <Sparkles className="h-4 w-4 text-kid-purple animate-pulse" />
            <span className="text-xs font-bold text-kid-purple uppercase tracking-wider">Aprendizado Divertido</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1]">
            Onde o <span className="text-transparent bg-clip-text bg-gradient-to-r from-kid-purple via-kid-blue to-kid-green">Conhecimento</span> vira uma grande aventura!
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/60 font-medium leading-relaxed">
            Materiais didáticos exclusivos, coloridos e lúdicos para transformar o estudo em um momento de pura descoberta e alegria.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button className="h-14 px-8 rounded-2xl bg-kid-orange hover:bg-kid-orange/90 text-white font-bold text-lg shadow-lg shadow-kid-orange/20 group">
              <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Explorar Materiais
            </Button>
            <Button variant="ghost" className="h-14 px-8 rounded-2xl border-2 border-transparent hover:border-gray-200 text-foreground/60 font-bold text-lg">
              Ver Categorias
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
