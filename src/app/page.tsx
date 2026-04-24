"use client";

import { useState, useEffect, useCallback, useRef, useMemo, useDeferredValue, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmartIcon from "@/components/SmartIcon";
import AnimatedIcon from "@/components/AnimatedIcon";
import StateSelector from "@/components/StateSelector";
import DDDSelector from "@/components/DDDSelector";
import { BRAZILIAN_STATES } from "@/components/StateSelector";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  Menu,
  Star,
  Mail,
  Phone,
  MapPin,
  ChevronUp,
  Search,
  Heart,
  Truck,
  Shield,
  RefreshCw,
  Award,
  Users,
  Package,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  X,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  ClipboardList,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Loader2,
  Download,
  FileText,
  Copy,
  Check,
  KeyRound,
  Share2,
  ShoppingBag,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────── */

const categories = [
  {
    id: "matematica", emoji: "🔢", name: "Matemática", color: "bg-kid-blue", shadow: "shadow-kid-blue", hoverBorder: "hover:border-kid-blue",
    subcategories: [
      { id: "mat-historias", name: "Histórias Educativas", emoji: "📚" },
      { id: "mat-atividades", name: "Atividades", emoji: "✏️" },
      { id: "mat-jogos", name: "Jogos Matemáticos", emoji: "🎲" },
    ],
  },
  {
    id: "portugues", emoji: "📝", name: "Português", color: "bg-kid-pink", shadow: "shadow-kid-pink", hoverBorder: "hover:border-kid-pink",
    subcategories: [
      { id: "port-silabas", name: "Sílabas", emoji: "📖" },
      { id: "port-historias", name: "Histórias Educativas", emoji: "📚" },
      { id: "port-letramento", name: "Letramento", emoji: "✍️" },
    ],
  },
];

const products: { id: number; name: string; description: string; price: number; originalPrice: number | null; rating: number; reviews: number; emoji: string; bgColor: string; borderHover: string; category: string; subcategory: string; tag: string | null; tagColor: string; ageRange: string; schoolYear: string; image?: string; link?: string }[] = [
  {
    id: 1,
    name: "O Código Secreto do Mundo",
    description: "Um guia divertido de superpoderes matemáticos! Descubra como a matemática está escondida em tudo — das teias de aranha às batidas da música.",
    price: 4.99,
    originalPrice: null,
    rating: 5,
    reviews: 12,
    emoji: "🔢",
    bgColor: "bg-gradient-to-br from-kid-blue/10 to-kid-purple/10",
    borderHover: "hover:border-kid-blue/40",
    category: "portugues",
    subcategory: "port-historias",
    tag: "Novo!",
    tagColor: "bg-kid-green/90 text-white",
    ageRange: "6 a 8 anos",
    schoolYear: "1º ao 3º ano",
    image: "/product-2.png",
    link: "https://docs.google.com/document/d/1AW-YdqoprQcQzkLzMWE2G_PNwb5kEspQoQMAz4lXHe8/edit?usp=drivesdk",
  },
];

// Quick lookup: subcategory id → { name, emoji }
const subcategoryMap = Object.fromEntries(
  categories.flatMap((cat) =>
    cat.subcategories.map((sub) => [sub.id, { name: sub.name, emoji: sub.emoji }])
  )
);

const navLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Categorias", href: "#categorias" },
  { label: "Produtos", href: "#produtos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

/* ─── Types ─────────────────────────────────────────────── */

interface CartItem {
  id: number;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  emoji: string;
  quantity: number;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  state: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customer: Customer;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const brazilianStates = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

const statusConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType; label: string }> = {
  "em processamento": { color: "text-amber-700", bgColor: "bg-amber-100 border-amber-200", icon: Clock, label: "Aguardando Pagamento" },
  "enviado": { color: "text-blue-700", bgColor: "bg-blue-100 border-blue-200", icon: Download, label: "Download Liberado" },
  "entregue": { color: "text-green-700", bgColor: "bg-green-100 border-green-200", icon: CheckCircle2, label: "Concluído" },
  "cancelado": { color: "text-red-700", bgColor: "bg-red-100 border-red-200", icon: X, label: "Cancelado" },
};

/* ─── Animated Counter Component ──────────────────────────── */

function AnimatedCounter({ target, suffix = "", prefix = "", decimals = 0, duration = 2000 }: {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          const startTime = performance.now();
          function update(now: number) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(ease * target);
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, hasStarted]);

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString("pt-BR")}{suffix}
    </span>
  );
}

/* ─── FAQ Item Component ──────────────────────────────────── */

function FAQItem({ question, answer, emoji, index }: { question: string; answer: string; emoji: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="bg-white rounded-2xl border-2 border-kid-blue/10 overflow-hidden shadow-sm hover:shadow-md hover:border-kid-blue/20 transition-all duration-200"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left"
      >
        <span className="shrink-0"><SmartIcon emoji={emoji} size={26} /></span>
        <span className="flex-1 font-semibold text-sm sm:text-base text-foreground">{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-foreground/30 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
              <div className="border-t border-kid-blue/10 pt-3 sm:pt-4 ml-8 sm:ml-10">
                <p className="text-sm text-foreground/60 leading-relaxed">{answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Interactive Book Component ──────────────────────────── */

const bookPages = [
  {
    left: {
      emoji: "🎒",
      title: "Mundo Aprender",
      content: `Seja bem-vindo ao mundo da aprendizagem divertida!

Aqui, cada página é uma nova aventura cheia de descobertas. Vamos aprender brincando!`,
      footer: "Passe as páginas para explorar! ➡️",
    },
    right: {
      emoji: "🔢",
      title: "Matemática",
      content: `Descubra os números e suas mágicas!

2 + 3 = 5
4 × 3 = 12
15 ÷ 5 = 3

Os números estão em tudo: nas flores, nas estrelas, na música!`,
      footer: "A Matemática é a linguagem do universo!",
    },
  },
  {
    left: {
      emoji: "✏️",
      title: "Atividades",
      content: `Complete a sequência:

2, 4, 6, ___ , ___
5, 10, 15, ___ , ___
1, 3, 5, ___ , ___

Que padrões você descobriu?`,
      footer: "Respostas: 8, 10  |  20, 25  |  7, 9",
    },
    right: {
      emoji: "📝",
      title: "Português",
      content: `As vogais são:

A  •  E  •  I  •  O  •  U

Sem elas não dá pra falar nem uma única palavra! Experimente falar "O L" sem as vogais...`,
      footer: "As vogais são a alma das palavras!",
    },
  },
  {
    left: {
      emoji: "📚",
      title: "Histórias Educativas",
      content: `Era uma vez um Zero que se achava sozinho...

"Ninguém me nota!" — suspirava o Zero.

Mas quando o 1 chegou, juntos formaram o 10 — o maior número que o Zero já tinha visto!

Moral: Juntos somos mais fortes.`,
      footer: "Cada um importa!",
    },
    right: {
      emoji: "🎲",
      title: "Jogos Matemáticos",
      content: `Jogo dos Dobros:

Se 2 é o dobro de 1
E 4 é o dobro de 2

Qual é o dobro de 3? → 6
Qual é o dobro de 5? → 10
Qual é o dobro de 7? → 14`,
      footer: "Continua assim, pequeno gênio!",
    },
  },
  {
    left: {
      emoji: "📖",
      title: "Sílabas Mágicas",
      content: `Vamos separar as sílabas:

CA-CHOR-ro  (3 sílabas)
BO-NI-TO  (3 sílabas)
LA-PIZ  (2 sílabas)
ES-TRE-LA  (3 sílabas)
A-LE-GRI-A  (4 sílabas)`,
      footer: "Sílabas são os tijolinhos das palavras!",
    },
    right: {
      emoji: "✍️",
      title: "Letramento",
      content: `Complete as palavras:

G___TO  → gato
C___XA  → caixa
B___LA  → bola
S___L   → sol
P___O   → pão

E agora invente uma frase usando uma dessas palavras!`,
      footer: "Quanto mais se lê, mais se aprende!",
    },
  },
];

type PageContent = { emoji: string; title: string; content: string; footer: string };

function PageFace({ page, side }: { page: PageContent; side: "left" | "right" }) {
  return (
    <div className="absolute inset-0 paper-texture overflow-hidden" data-page-inner>
      {/* Spine shadow */}
      <div className={`absolute top-0 bottom-0 w-5 z-[2] pointer-events-none ${
        side === "left"
          ? "right-0 bg-gradient-to-l from-black/[0.07] to-transparent"
          : "left-0 bg-gradient-to-r from-black/[0.07] to-transparent"
      }`} />
      {/* Content */}
      <div className="relative h-full p-4 sm:p-5 md:p-6 flex flex-col z-[1]">
        <span className="mb-2 drop-shadow-sm"><SmartIcon emoji={page.emoji} size={32} animated={false} /></span>
        <h4 className="text-[#4A3728] font-bold text-[11px] sm:text-sm md:text-base mb-2 leading-snug">{page.title}</h4>
        <div className="text-[#5C4A3A] text-[9px] sm:text-[11px] md:text-xs leading-[1.7] flex-1">{page.content.split('\n').map((line, i) => line ? <span key={i}>{line}<br /></span> : <br key={i} />)}</div>
        <div className="border-t border-[#D8CCBA] pt-1.5 mt-2">
          <p className="text-[#A89878] text-[7px] sm:text-[9px] italic">{page.footer}</p>
        </div>
      </div>
    </div>
  );
}

function InteractiveBook() {
  const [spread, setSpread] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeFlip, setActiveFlip] = useState<"next" | "prev" | null>(null);

  // Freeze "from" content so overlays show the old pages while base shows new pages
  const frozenRef = useRef<{ left: PageContent; right: PageContent } | null>(null);

  const nextFlipRef = useRef<HTMLDivElement>(null);
  const nextFadeRef = useRef<HTMLDivElement>(null);
  const prevFlipRef = useRef<HTMLDivElement>(null);
  const prevFadeRef = useRef<HTMLDivElement>(null);
  const nextShadowRef = useRef<HTMLDivElement>(null);
  const prevShadowRef = useRef<HTMLDivElement>(null);

  const totalSpreads = bookPages.length;
  const current = bookPages[spread];
  const frozen = frozenRef.current;

  const flip = useCallback((dir: "next" | "prev") => {
    if (isAnimating) return;
    const canFlip = dir === "next" ? spread < totalSpreads - 1 : spread > 0;
    if (!canFlip) return;

    // Freeze the "from" spread content BEFORE updating state
    frozenRef.current = bookPages[spread];

    // Update spread immediately so base renders new content
    setSpread((s) => (dir === "next" ? s + 1 : s - 1));
    setIsAnimating(true);
    setActiveFlip(dir);
  }, [isAnimating, spread, totalSpreads]);

  // Animate the flip overlay and fade the static overlay
  useEffect(() => {
    if (!activeFlip) return;

    const flipEl = activeFlip === "next" ? nextFlipRef.current : prevFlipRef.current;
    const fadeEl = activeFlip === "next" ? nextFadeRef.current : prevFadeRef.current;
    const shadowEl = activeFlip === "next" ? nextShadowRef.current : prevShadowRef.current;

    if (!flipEl) {
      setActiveFlip(null);
      setIsAnimating(false);
      return;
    }

    const targetAngle = activeFlip === "next" ? -180 : 180;

    // Reset to starting state
    flipEl.style.transition = "none";
    flipEl.style.transform = "rotateY(0deg)";
    if (fadeEl) {
      fadeEl.style.transition = "none";
      fadeEl.style.opacity = "1";
    }
    if (shadowEl) {
      shadowEl.style.transition = "none";
      shadowEl.style.opacity = "0";
    }

    // Force reflow
    void flipEl.offsetHeight;

    // Animate the page flip (front face only — disappears past 90 deg via backface-visibility)
    flipEl.style.transition = "transform 0.7s cubic-bezier(0.0, 0.0, 0.2, 1)";
    flipEl.style.transform = `rotateY(${targetAngle}deg)`;

    // Fade the static overlay to reveal the new page underneath
    if (fadeEl) {
      fadeEl.style.transition = "opacity 0.45s ease 0.18s";
      fadeEl.style.opacity = "0";
    }

    // Reveal shadow on the page being uncovered
    if (shadowEl) {
      shadowEl.style.transition = "opacity 0.7s ease";
      shadowEl.style.opacity = "1";
    }

    const timer = setTimeout(() => {
      flipEl.style.transition = "none";
      flipEl.style.transform = "rotateY(0deg)";
      if (fadeEl) {
        fadeEl.style.transition = "none";
        fadeEl.style.opacity = "0";
      }
      if (shadowEl) {
        shadowEl.style.transition = "none";
        shadowEl.style.opacity = "0";
      }
      setActiveFlip(null);
      setIsAnimating(false);
      frozenRef.current = null;
    }, 780);

    return () => {
      clearTimeout(timer);
      flipEl.style.transition = "none";
      flipEl.style.transform = "rotateY(0deg)";
      if (fadeEl) {
        fadeEl.style.transition = "none";
      }
      if (shadowEl) {
        shadowEl.style.transition = "none";
        shadowEl.style.opacity = "0";
      }
    };
  }, [activeFlip]);

  return (
    <div className="relative w-full max-w-[440px] mx-auto lg:mx-0 select-none">
      {/* Book shadow on surface */}
      <div className="absolute -bottom-3 left-[8%] right-[8%] h-5 bg-black/12 blur-xl rounded-[50%]" />

      {/* Book */}
      <div className="realistic-book relative">
        <div
          className="relative flex"
          style={{ transform: "rotateX(4deg)", transformStyle: "preserve-3d" }}
        >
          {/* LEFT PAGE */}
          <div
            className="flex-1 relative min-h-[210px] sm:min-h-[260px] md:min-h-[310px] overflow-hidden"
            data-page="left"
          >
            <PageFace page={current.left} side="left" />
          </div>

          {/* RIGHT PAGE */}
          <div
            className="flex-1 relative min-h-[210px] sm:min-h-[260px] md:min-h-[310px] overflow-hidden"
            data-page="right"
          >
            <PageFace page={current.right} side="right" />
          </div>

          {/* Spine */}
          <div className="absolute top-[-2px] bottom-[-2px] left-1/2 -translate-x-1/2 w-[7px] z-[20] book-spine rounded-[1px] shadow-inner" />

          {/* Page stack edges — right side (unturned pages) */}
          <div className="absolute top-[2px] right-[-1px] bottom-[2px] flex gap-px z-[15] pointer-events-none">
            {Array.from({ length: Math.min(Math.max(0, totalSpreads - 1 - spread), 5) }).map((_, i) => (
              <div key={`r-${i}`} className="w-[2px] h-full bg-gradient-to-b from-[#E8DCC8] via-[#E0D4BE] to-[#D8CCBA]" />
            ))}
          </div>

          {/* Page stack edges — left side (turned pages) */}
          <div className="absolute top-[2px] left-[-1px] bottom-[2px] flex gap-px z-[15] pointer-events-none">
            {Array.from({ length: Math.min(spread, 5) }).map((_, i) => (
              <div key={`l-${i}`} className="w-[2px] h-full bg-gradient-to-b from-[#E8DCC8] via-[#E0D4BE] to-[#D8CCBA]" />
            ))}
          </div>

          {/* Book cover edges (top & bottom) */}
          <div className="absolute top-[-2px] left-[-2px] right-[-2px] h-[4px] bg-gradient-to-b from-[#C4B494] to-transparent z-[25] rounded-t-xl pointer-events-none" />
          <div className="absolute bottom-[-2px] left-[-2px] right-[-2px] h-[4px] bg-gradient-to-t from-[#A89878] to-transparent z-[25] rounded-b-xl pointer-events-none" />

          {/* === NEXT FLIP: right page turns left (front face only) === */}
          <div
            ref={nextFlipRef}
            data-flip="next"
            style={{ display: activeFlip === "next" ? "block" : "none", zIndex: 30 }}
          >
            <div data-face="front">
              <div className="absolute inset-0 paper-texture overflow-hidden rounded-r-lg shadow-[inset_2px_0_6px_rgba(0,0,0,0.08),_-4px_4px_15px_rgba(0,0,0,0.12)]">
                {frozen && <PageFace page={frozen.right} side="right" />}
              </div>
              <div className="absolute inset-0 pointer-events-none rounded-r-lg" style={{
                background: "linear-gradient(to left, rgba(255,255,255,0.08) 0%, transparent 35%)",
              }} />
            </div>
          </div>

          {/* NEXT FADE: left page fades out to reveal new content */}
          <div
            ref={nextFadeRef}
            style={{
              display: activeFlip === "next" ? "block" : "none",
              position: "absolute", top: 0, left: 0, width: "50%", height: "100%",
              zIndex: 28,
            }}
          >
            <div className="absolute inset-0 paper-texture overflow-hidden rounded-l-lg shadow-[inset_-2px_0_6px_rgba(0,0,0,0.08),_4px_4px_15px_rgba(0,0,0,0.12)]">
              {frozen && <PageFace page={frozen.left} side="left" />}
            </div>
          </div>

          {/* Shadow on revealed left page during next flip */}
          <div
            ref={nextShadowRef}
            className="absolute top-0 left-0 w-1/2 h-full pointer-events-none z-[27] rounded-l-lg"
            style={{
              opacity: 0,
              background: "linear-gradient(to right, rgba(0,0,0,0.12), transparent 60%)",
              transition: "none",
            }}
          />

          {/* === PREV FLIP: left page turns right (front face only) === */}
          <div
            ref={prevFlipRef}
            data-flip="prev"
            style={{ display: activeFlip === "prev" ? "block" : "none", zIndex: 30 }}
          >
            <div data-face="front">
              <div className="absolute inset-0 paper-texture overflow-hidden rounded-l-lg shadow-[inset_-2px_0_6px_rgba(0,0,0,0.08),_4px_4px_15px_rgba(0,0,0,0.12)]">
                {frozen && <PageFace page={frozen.left} side="left" />}
              </div>
              <div className="absolute inset-0 pointer-events-none rounded-l-lg" style={{
                background: "linear-gradient(to right, rgba(255,255,255,0.08) 0%, transparent 35%)",
              }} />
            </div>
          </div>

          {/* PREV FADE: right page fades out to reveal new content */}
          <div
            ref={prevFadeRef}
            style={{
              display: activeFlip === "prev" ? "block" : "none",
              position: "absolute", top: 0, right: 0, width: "50%", height: "100%",
              zIndex: 28,
            }}
          >
            <div className="absolute inset-0 paper-texture overflow-hidden rounded-r-lg shadow-[inset_2px_0_6px_rgba(0,0,0,0.08),_-4px_4px_15px_rgba(0,0,0,0.12)]">
              {frozen && <PageFace page={frozen.right} side="right" />}
            </div>
          </div>

          {/* Shadow on revealed right page during prev flip */}
          <div
            ref={prevShadowRef}
            className="absolute top-0 right-0 w-1/2 h-full pointer-events-none z-[27] rounded-r-lg"
            style={{
              opacity: 0,
              background: "linear-gradient(to left, rgba(0,0,0,0.12), transparent 60%)",
              transition: "none",
            }}
          />
        </div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between mt-4 px-1">
        {/* Previous button */}
        <button
          onClick={() => flip("prev")}
          disabled={spread === 0 || isAnimating}
          className="flex items-center gap-1.5 text-white/90 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 shadow-md backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Page dots */}
        <div className="flex items-center gap-2">
          {bookPages.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === spread || isAnimating) return;
                if (i === spread + 1) flip("next");
                else if (i === spread - 1) flip("prev");
                else setSpread(i);
              }}
              disabled={isAnimating}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === spread
                  ? "w-6 bg-[#D4A854] shadow-sm"
                  : "w-2 bg-[#B8A898]/60 hover:bg-[#B8A898]"
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => flip("next")}
          disabled={spread >= totalSpreads - 1 || isAnimating}
          className="flex items-center gap-1.5 text-white/90 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 shadow-md backdrop-blur-sm"
        >
          <span className="hidden sm:inline">Próximo</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Page indicator */}
      <p className="text-center text-white/35 text-[10px] mt-1.5 font-mono tracking-wide">
        {spread * 2 + 1}–{spread * 2 + 2} de {totalSpreads * 2}
      </p>
    </div>
  );
}


/* ─── Product Card (memoized) ──────────────────────────── */

interface ProductCardProps {
  product: (typeof products)[0];
  isFavorite: boolean;
  isJustFavorited: boolean;
  isJustAdded: boolean;
  isDescExpanded: boolean;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (product: (typeof products)[0]) => void;
  onToggleDesc: (id: number) => void;
  onPreviewImage: (src: string, name: string) => void;
  onShareProduct: (product: (typeof products)[0]) => void;
}

const ProductCard = memo(function ProductCard({
  product, isFavorite, isJustFavorited, isJustAdded, isDescExpanded,
  onToggleFavorite, onAddToCart, onToggleDesc, onPreviewImage, onShareProduct,
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`card-hover group relative bg-white rounded-2xl sm:rounded-3xl border-2 border-transparent ${product.borderHover} overflow-hidden shadow-md hover:shadow-xl`}
    >
      {product.tag && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className={`${product.tagColor} text-white font-bold text-xs rounded-xl px-2.5 py-1 shadow-md`}>
            {product.tag}
          </Badge>
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-12 z-10 w-8 h-8 rounded-xl backdrop-blur-sm hover:scale-110 transition-all bg-white/80 hover:bg-kid-green/20"
        onClick={(e) => { e.stopPropagation(); onShareProduct(product); }}
      >
        <Share2 className="h-4 w-4 text-foreground/30 hover:text-kid-green transition-colors" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-xl backdrop-blur-sm hover:scale-110 transition-all ${isFavorite ? "bg-kid-pink/15 hover:bg-kid-pink/25" : "bg-white/80 hover:bg-kid-pink/20"}`}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
      >
        <motion.div animate={isJustFavorited ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.25, ease: "easeOut" }}>
          <Heart className={`h-4 w-4 transition-colors ${isFavorite ? "text-kid-pink" : "text-foreground/30 hover:text-kid-pink"}`} fill={isFavorite ? "currentColor" : "none"} />
        </motion.div>
      </Button>
      <button
        type="button"
        onClick={() => product.image && onPreviewImage(product.image, product.name)}
        className={`relative ${product.bgColor} p-3 sm:p-6 md:p-8 flex items-center justify-center aspect-square overflow-hidden w-full cursor-pointer group/img`}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover/img:scale-105 transition-transform duration-300 drop-shadow-md" />
        ) : (
          <span className="text-3xl sm:text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
        )}
        {product.image && (
          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-200 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 shadow-lg">
              <Search className="h-5 w-5 text-kid-blue" />
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 z-10">
          <span className="text-[9px] sm:text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm rounded-lg px-1.5 py-0.5">
            👶 {product.ageRange}
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold text-white bg-black/50 backdrop-blur-sm rounded-lg px-1.5 py-0.5">
            📚 {product.schoolYear}
          </span>
        </div>
      </button>
      <div className="p-2.5 sm:p-4 md:p-5">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, j) => (
            <Star key={j} className={`h-3.5 w-3.5 ${j < product.rating ? "fill-kid-yellow text-kid-yellow" : "fill-gray-200 text-gray-200"}`} />
          ))}
          <span className="text-xs text-foreground/40 ml-1">({product.reviews})</span>
        </div>
        {(() => {
          const sub = subcategoryMap[product.subcategory];
          return sub ? (
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-kid-blue/70 bg-kid-blue/8 border border-kid-blue/15 rounded-lg px-2 py-0.5 font-medium mb-1.5">
              {sub.emoji} {sub.name}
            </span>
          ) : null;
        })()}
        <h3 className="font-bold text-xs sm:text-sm md:text-base text-foreground leading-snug line-clamp-2 mb-1">{product.name}</h3>
        <AnimatePresence initial={false}>
          <motion.p
            key={isDescExpanded ? "expanded" : "collapsed"}
            initial={{ height: 0, opacity: 0.7 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0.7 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`text-[10px] sm:text-xs text-foreground/50 mb-2 sm:mb-3 overflow-hidden ${isDescExpanded ? "" : "line-clamp-2"}`}
            style={!isDescExpanded ? { height: "auto", opacity: 1 } : undefined}
          >
            {product.description}
          </motion.p>
        </AnimatePresence>
        <button type="button" onClick={(e) => { e.stopPropagation(); onToggleDesc(product.id); }}
          className="text-[10px] sm:text-xs text-kid-blue font-semibold hover:text-kid-blue/70 hover:underline -mt-1.5 mb-1.5 block transition-colors">
          {isDescExpanded ? "Ver menos ▲" : "Ver mais ▼"}
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-xl font-black text-kid-orange">R$ {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-foreground/30 line-through">R$ {product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <Button
            className={`w-full rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-sm py-3 sm:py-5 transition-all duration-300 ${isJustAdded ? "bg-kid-green text-white" : "bg-kid-orange hover:bg-kid-orange/90 text-white shadow-kid-orange hover:shadow-lg"}`}
            onClick={() => onAddToCart(product)}
          >
            {isJustAdded ? (
              <span className="flex items-center justify-center gap-1">Adicionado! ✅</span>
            ) : (
              <span className="flex items-center justify-center gap-1"><ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />Adicionar</span>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

/* ─── Component ─────────────────────────────────────────── */

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("mundo-carrinho");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [justFavorited, setJustFavorited] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const productsRef = useRef<HTMLElement>(null);

  // Order / Checkout state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer>({
    name: "", email: "", phone: "", state: "",
  });
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Payment callback state (Checkout Pro redirect)
  const [paymentResult, setPaymentResult] = useState<{ status: string; orderId: string; paymentId: string } | null>(null);
  const [paymentResultOrder, setPaymentResultOrder] = useState<Order | null>(null);
  const [paymentResultLoading, setPaymentResultLoading] = useState(false);

  // Order history state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [expandedDescId, setExpandedDescId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<{ src: string; name: string } | null>(null);
  const [cartToast, setCartToast] = useState<{ name: string; emoji: string } | null>(null);

  // Selected DDD from state selector
  const [selectedDDD, setSelectedDDD] = useState<string>("");

  // Terms checkbox for checkout
  const [checkoutTermsAccepted, setCheckoutTermsAccepted] = useState(false);
  const [activateTermsAccepted, setActivateTermsAccepted] = useState(false);

  // Activation code state
  const [activateOpen, setActivateOpen] = useState(false);
  const [activateCode, setActivateCode] = useState("");
  const [activateStep, setActivateStep] = useState<"input" | "loading" | "activated">("input");
  const [activateError, setActivateError] = useState("");
  const [activateProduct, setActivateProduct] = useState<{ name: string; emoji: string; link: string } | null>(null);
  const [activatedProducts, setActivatedProducts] = useState<{ name: string; emoji: string; link: string }[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("mundo-ativados");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Persist activated products to localStorage
  useEffect(() => {
    if (activatedProducts.length > 0) {
      localStorage.setItem("mundo-ativados", JSON.stringify(activatedProducts));
    }
  }, [activatedProducts]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("mundo-carrinho", JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const shareProduct = useCallback((product: (typeof products)[0]) => {
    const url = window.location.href;
    const text = `Confira esse material incrivel: ${product.name} - R$ ${product.price.toFixed(2)} 🔥`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: product.name, text, url }).catch(() => {});
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`;
      window.open(waUrl, "_blank");
    }
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const deferredSearch = useDeferredValue(searchQuery);

  const filteredProducts = useMemo(() => {
    const query = deferredSearch;
    return activeSubcategory
    ? products.filter((p) => p.subcategory === activeSubcategory)
    : activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );
  }, [deferredSearch, activeCategory, activeSubcategory]);

  const addToCart = useCallback((product: (typeof products)[0]) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, emoji: product.emoji, quantity: 1 }];
    });
    setJustAdded(product.id);
    setTimeout(() => setJustAdded(null), 1500);
    setCartToast({ name: product.name, emoji: product.emoji });
    setTimeout(() => setCartToast(null), 3000);
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setJustFavorited(id);
    setTimeout(() => setJustFavorited(null), 1200);
  }, []);

  const handleSubscribe = () => {
    if (email.includes("@")) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  // Phone mask helper
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  // Handle DDD auto-fill using functional state update to avoid stale closure
  const handleDDDChange = useCallback((ddd: string) => {
    setSelectedDDD(ddd);
    if (ddd) {
      setCustomer((prev) => {
        const digits = prev.phone.replace(/\D/g, "");
        const numberPart = digits.length > 2 ? digits.slice(2) : "";
        return { ...prev, phone: formatPhone(ddd + numberPart) };
      });
    }
  }, []);

  // Zip code mask helper
  const formatZipCode = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  // Open checkout from cart
  const [savedCustomer, setSavedCustomer] = useState<Customer | null>(null);
  const [showSavedPrompt, setShowSavedPrompt] = useState(false);

  const openCheckout = () => {
    setCheckoutStep(1);
    setCompletedOrder(null);
    setPaymentResult(null);
    setPaymentResultOrder(null);
    setCheckoutTermsAccepted(false);
    setCartOpen(false);
    // Check localStorage for saved data
    try {
      const saved = localStorage.getItem("mundo-ultimo-checkout");
      if (saved) {
        const parsed = JSON.parse(saved) as Customer;
        if (parsed.name || parsed.email) {
          setSavedCustomer(parsed);
          setCustomer({ name: "", email: "", phone: "", state: "" });
          setShowSavedPrompt(true);
          setTimeout(() => setCheckoutOpen(true), 200);
          return;
        }
      }
    } catch {}
    setSavedCustomer(null);
    setCustomer({ name: "", email: "", phone: "" });
    setShowSavedPrompt(false);
    setTimeout(() => setCheckoutOpen(true), 200);
  };

  const fillFromSaved = () => {
    if (savedCustomer) {
      setCustomer({ ...savedCustomer });
    }
    setShowSavedPrompt(false);
  };

  const fillManually = () => {
    setShowSavedPrompt(false);
  };

  const saveCustomerAndAdvance = () => {
    // Save current data to localStorage
    try {
      localStorage.setItem("mundo-ultimo-checkout", JSON.stringify(customer));
    } catch {}
    setCheckoutStep(2);
  };

  // Submit order — manual PIX payment
  const handleCheckout = () => {
    setCheckoutStep(3);
    setCheckoutLoading(false);
  };

  // Copy PIX code to clipboard
  const [pixCopied, setPixCopied] = useState(false);
  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText("00020126580014BR.GOV.BCB.PIX01361ad6a146-8d7e-4521-a96a-fde7ccd602ac52040000530398654044.995802BR5925Micael San Pedro Aquino d6009SAO PAULO62140510fKnpm0P5q56304B362");
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = "00020126580014BR.GOV.BCB.PIX01361ad6a146-8d7e-4521-a96a-fde7ccd602ac52040000530398654044.995802BR5925Micael San Pedro Aquino d6009SAO PAULO62140510fKnpm0P5q56304B362";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 2500);
    }
  };

  // Verify and activate code
  const handleActivateCode = async () => {
    const code = activateCode.trim().toUpperCase();
    if (code.replace(/-/g, "").length < 16) {
      setActivateError("Digite o código completo (16 caracteres)");
      return;
    }

    setActivateStep("loading");
    setActivateError("");

    try {
      const res = await fetch(`/api/codes/verify/${encodeURIComponent(code)}`);
      const data = await res.json();

      if (!data.valid) {
        setActivateStep("input");
        setActivateError(data.used ? "Este código já foi utilizado" : "Código inválido");
        return;
      }

      // Code is valid — now activate it
      const actRes = await fetch(`/api/codes/activate/${encodeURIComponent(code)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const actData = await actRes.json();

      if (actData.success) {
        const product = { name: actData.productName, emoji: actData.productEmoji, link: actData.productLink };
        setActivateProduct(product);
        setActivateStep("activated");
        // Save to localStorage so it persists forever
        setActivatedProducts((prev) => {
          const already = prev.some((p) => p.name === product.name);
          return already ? prev : [...prev, product];
        });
      } else {
        setActivateStep("input");
        setActivateError(actData.error || "Erro ao ativar");
      }
    } catch {
      setActivateStep("input");
      setActivateError("Erro de conexão. Tente novamente.");
    }
  };

  const closeActivate = () => {
    setActivateOpen(false);
    setActivateStep(activatedProducts.length > 0 ? "activated" : "input");
    setActivateCode("");
    setActivateError("");
    setActivateProduct(activatedProducts.length > 0 ? activatedProducts[0] : null);
  };

  // When opening the modal, show activated products if any
  const openActivate = () => {
    setActivateOpen(true);
    setActivateTermsAccepted(false);
    if (activatedProducts.length > 0) {
      setActivateStep("activated");
      setActivateProduct(activatedProducts[0]);
    } else {
      setActivateStep("input");
      setActivateCode("");
      setActivateError("");
    }
  };


  // Handle payment callback from Mercado Pago redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment_status");
    const orderId = params.get("order_id");
    const paymentId = params.get("payment_id");

    if (paymentStatus && orderId) {
      setPaymentResult({ status: paymentStatus, orderId, paymentId: paymentId || "" });
      setCheckoutOpen(true);
      setCheckoutStep(3);

      // Clean URL params
      window.history.replaceState({}, "", "/");

      // Fetch order data
      const fetchOrder = async () => {
        setPaymentResultLoading(true);
        try {
          // If approved, make sure order status is updated
          if (paymentStatus === "approved") {
            await fetch(`/api/orders/${orderId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "enviado" }),
            });
          }
          const orderRes = await fetch(`/api/orders/${orderId}`);
          if (orderRes.ok) {
            const orderData = await orderRes.json();
            setPaymentResultOrder(orderData);
            setCompletedOrder(orderData);
            if (paymentStatus === "approved") {
              setCartItems([]);
                        }
          }
        } catch (error) {
          console.error("Erro ao buscar pedido:", error);
        } finally {
          setPaymentResultLoading(false);
        }
      };
      fetchOrder();
    }
  }, []);

  // Fetch orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // silently fail
    } finally {
      setOrdersLoading(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        setCancelConfirmId(null);
        setExpandedOrderId(null);
      }
    } catch {
      alert("Erro ao cancelar pedido.");
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      }
    } catch {
      alert("Erro ao atualizar pedido.");
    }
  };

  // Format date to PT-BR
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ─── Render ──────────────────────────────────────────── */

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden pt-14 sm:pt-16 md:pt-20">
      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-kid-yellow/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <a href="#inicio" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
              <span className="text-2xl sm:text-3xl group-hover:animate-wiggle">🎒</span>
              <div className="flex flex-col leading-tight">
                <span className="text-base sm:text-xl md:text-2xl font-black bg-gradient-to-r from-kid-orange via-kid-pink to-kid-purple bg-clip-text text-transparent">
                  Mundo Aprender
                </span>
                <span className="hidden sm:block text-[10px] md:text-xs text-kid-blue font-semibold -mt-0.5">
                  Brincar &bull; Criar &bull; Aprender ✨
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-semibold text-foreground/70 hover:text-kid-orange rounded-2xl hover:bg-kid-orange/10 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Search toggle - desktop only (mobile: inside ☰ menu) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex rounded-2xl hover:bg-kid-yellow/20 h-9 w-9 sm:h-10 sm:w-10"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/60" />
              </Button>

              {/* Favorites panel - desktop only (mobile: inside ☰ menu) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex rounded-2xl hover:bg-kid-pink/10 h-9 w-9 sm:h-10 sm:w-10 relative"
                onClick={() => setFavoritesOpen(true)}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${favorites.size > 0 ? "text-kid-pink" : "text-foreground/60"}`} fill={favorites.size > 0 ? "currentColor" : "none"} />
                {favorites.size > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-kid-pink text-white text-[9px] sm:text-[10px] font-bold rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
                    {favorites.size}
                  </span>
                )}
              </Button>


              {/* Activate code - desktop only (mobile: inside ☰ menu) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex rounded-2xl hover:bg-kid-purple/20 h-9 w-9 sm:h-10 sm:w-10"
                onClick={() => openActivate()}
              >
                <KeyRound className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/60" />
              </Button>

              {/* Cart - desktop only (mobile: inside ☰ menu) */}
              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:inline-flex rounded-2xl hover:bg-kid-pink/20 relative h-9 w-9 sm:h-10 sm:w-10">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/60" />
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-kid-pink text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-md"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md bg-white p-0 flex flex-col">
                  <SheetTitle className="sr-only">Carrinho de Compras</SheetTitle>
                  <div className="bg-gradient-to-r from-kid-pink to-kid-orange p-6 text-white">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-6 w-6" />
                      <h2 className="text-xl font-bold">Meu Carrinho</h2>
                    </div>
                    <p className="text-white/80 text-sm mt-1">{totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho</p>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <span className="text-6xl mb-4">🛒</span>
                        <p className="text-lg font-semibold text-foreground/60">Seu carrinho está vazio</p>
                        <p className="text-sm text-foreground/40 mt-1">Adicione produtos incríveis!</p>
                        <Button
                          className="mt-4 rounded-2xl bg-kid-orange hover:bg-kid-orange/90 text-white font-semibold"
                          onClick={() => setCartOpen(false)}
                        >
                          Ver Produtos
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="flex items-center gap-3 bg-kid-yellow/5 rounded-2xl p-3 border border-kid-yellow/20"
                          >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                              {item.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">{item.name}</p>
                              <p className="text-kid-orange font-bold text-sm">
                                R$ {item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-7 h-7 rounded-xl"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-7 h-7 rounded-xl"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-7 h-7 rounded-xl hover:bg-kid-red/10"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-kid-red" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className="border-t-2 border-kid-yellow/20 p-4 bg-white">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-foreground/60">Total:</span>
                        <span className="text-2xl font-black text-kid-orange">
                          R$ {totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <Button className="w-full rounded-2xl bg-gradient-to-r from-kid-orange to-kid-pink hover:from-kid-orange/90 hover:to-kid-pink/90 text-white font-bold text-lg py-6 shadow-kid-orange" onClick={openCheckout}>
                        Finalizar Compra 🎉
                      </Button>
                      <Button
                        className="w-full mt-3 rounded-2xl bg-white text-[#1a1a2e] font-bold text-lg py-6 shadow-[0_4px_15px_rgba(0,0,0,0.12)] border border-[#e5e5e5] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:bg-gray-50 transition-all duration-300"
                        onClick={() => setCartOpen(false)}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ShoppingBag className="h-5 w-5" />
                          Continuar Comprando
                        </span>
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>

              {/* Mobile Menu - hamburger with cart badge */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="sm:hidden rounded-2xl hover:bg-kid-blue/20 h-9 w-9 sm:h-10 sm:w-10 relative">
                    <Menu className="h-5 w-5 text-foreground/70" />
                    {totalItems > 0 && (
                      <span className="absolute top-0.5 right-0.5 bg-kid-orange text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                className="w-[85vw] sm:max-w-sm bg-white p-0 flex flex-col"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                  <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                  <div className="bg-gradient-to-r from-kid-blue to-kid-purple p-5 sm:p-6 text-white">
                    <span className="text-3xl sm:text-4xl">🎒</span>
                    <h2 className="text-lg sm:text-xl font-bold mt-2">Mundo Aprender</h2>
                    <p className="text-white/70 text-xs sm:text-sm">Brincar &bull; Criar &bull; Aprender ✨</p>
                  </div>

                  {/* Mobile search */}
                  <div className="px-4 pt-4 shrink-0">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-kid-orange/10">
                        <Search className="h-3 w-3 text-kid-orange" />
                      </div>
                      <Input
                        placeholder="O que você procura? 🔍"
                        className="pl-9 pr-9 rounded-2xl border-2 border-kid-orange/20 focus:border-kid-orange bg-gradient-to-r from-kid-orange/5 to-kid-pink/5 shadow-sm focus:shadow-md focus:shadow-kid-orange/10 transition-all duration-300 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            setMobileMenuOpen(false);
                            setTimeout(() => {
                              const header = document.querySelector("header");
                              const headerHeight = header?.offsetHeight ?? 80;
                              const targetY = productsRef.current!.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
                              const startY = window.scrollY;
                              const distance = targetY - startY;
                              const duration = 600;
                              let start: number | null = null;
                              function step(timestamp: number) {
                                if (!start) start = timestamp;
                                const progress = Math.min((timestamp - start) / duration, 1);
                                const ease = progress < 0.5
                                  ? 4 * progress * progress * progress
                                  : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                                window.scrollTo(0, startY + distance * ease);
                                if (progress < 1) requestAnimationFrame(step);
                              }
                              requestAnimationFrame(step);
                            }, 250);
                          }
                        }}
                      />
                      {searchQuery && (
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 hover:bg-kid-orange/10"
                          onClick={() => setSearchQuery("")}
                        >
                          <X className="h-3.5 w-3.5 text-foreground/40" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick actions - Favorites, Cart, Orders */}
                  <div className="px-4 pt-3 pb-1 shrink-0">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider px-4 mb-2">Ações rápidas</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setTimeout(() => setFavoritesOpen(true), 250);
                        }}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-kid-pink/5 hover:bg-kid-pink/10 border border-kid-pink/10 transition-all"
                      >
                        <div className="relative">
                          <Heart className={`h-5 w-5 ${favorites.size > 0 ? "text-kid-pink" : "text-foreground/40"}`} fill={favorites.size > 0 ? "currentColor" : "none"} />
                          {favorites.size > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-kid-pink text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                              {favorites.size}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-foreground/60">Favoritos</span>
                      </button>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setTimeout(() => setCartOpen(true), 250);
                        }}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-kid-orange/5 hover:bg-kid-orange/10 border border-kid-orange/10 transition-all"
                      >
                        <div className="relative">
                          <ShoppingCart className="h-5 w-5 text-foreground/40" />
                          {totalItems > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-kid-orange text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                              {totalItems}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-foreground/60">Carrinho</span>
                      </button>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setTimeout(() => openActivate(), 250);
                        }}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-kid-purple/5 hover:bg-kid-purple/10 border border-kid-purple/10 transition-all"
                      >
                        <KeyRound className="h-5 w-5 text-foreground/40" />
                        <span className="text-[11px] font-semibold text-foreground/60">Ativar</span>
                      </button>
                    </div>
                  </div>

                  {/* Navigation links */}
                  <div className="px-4 pt-3 pb-1">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider px-4 mb-2">Navegação</p>
                  </div>
                  <nav className="px-4 pb-4 space-y-0.5">
                    {navLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-foreground/70 hover:text-kid-orange hover:bg-kid-orange/5 rounded-2xl font-semibold transition-all"
                      >
                        <ArrowRight className="h-4 w-4" />
                        {link.label}
                      </a>
                    ))}
                  </nav>

                  {/* Mobile menu footer */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-kid-yellow/10 border-t border-kid-yellow/20">
                    <div className="flex items-center gap-2 text-xs text-foreground/40">
                      <KeyRound className="h-3.5 w-3.5" />
                      <span>Entrega por key de ativação</span>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pb-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full bg-kid-orange/10">
                      <Search className="h-3.5 w-3.5 text-kid-orange" />
                    </div>
                    <Input
                      placeholder="O que você procura? 🔍"
                      className="pl-12 pr-12 rounded-2xl border-2 border-kid-orange/20 focus:border-kid-orange bg-gradient-to-r from-kid-orange/5 to-kid-pink/5 shadow-sm focus:shadow-md focus:shadow-kid-orange/10 transition-all duration-300 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const header = document.querySelector("header");
                          const headerHeight = header?.offsetHeight ?? 80;
                          const targetY = productsRef.current!.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
                          const startY = window.scrollY;
                          const distance = targetY - startY;
                          const duration = 600;
                          let start: number | null = null;
                          function step(timestamp: number) {
                            if (!start) start = timestamp;
                            const progress = Math.min((timestamp - start) / duration, 1);
                            const ease = progress < 0.5
                              ? 4 * progress * progress * progress
                              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                            window.scrollTo(0, startY + distance * ease);
                            if (progress < 1) requestAnimationFrame(step);
                          }
                          requestAnimationFrame(step);
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl hover:bg-kid-orange/10"
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    >
                      <X className="h-4 w-4 text-foreground/30" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section id="inicio" className="relative gradient-hero overflow-hidden">
        {/* Decorative floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-10 left-[5%] text-5xl md:text-7xl animate-float opacity-30">⭐</span>
          <span className="absolute top-20 right-[10%] text-4xl md:text-6xl animate-float-delay-1 opacity-30">✏️</span>
          <span className="absolute bottom-20 left-[15%] text-4xl md:text-5xl animate-float-delay-2 opacity-25">📖</span>
          <span className="absolute bottom-32 right-[20%] text-5xl md:text-7xl animate-float-slow opacity-30">🎨</span>
          <span className="absolute top-1/2 left-[3%] text-3xl md:text-4xl animate-float-delay-3 opacity-20">📐</span>
          <span className="absolute top-1/3 right-[5%] text-3xl md:text-4xl animate-float opacity-20">🔬</span>
          <span className="absolute bottom-10 left-[40%] text-4xl md:text-5xl animate-float-delay-1 opacity-25">🌈</span>
          <span className="absolute top-5 left-[50%] text-3xl animate-float-delay-2 opacity-20">🎈</span>
        </div>

        {/* Decorative blob shapes */}
        <div className="absolute top-10 right-10 w-28 h-28 md:w-44 md:h-44 bg-white/15 blob-1 blur-xl" />
        <div className="absolute bottom-10 left-10 w-32 h-32 md:w-52 md:h-52 bg-white/10 blob-2 blur-xl" />
        <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-white/10 blob-1 blur-md opacity-60" />
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white/10 blob-2 blur-md opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <Badge className="mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/30 text-white font-semibold text-xs sm:text-sm backdrop-blur-sm border-0">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                Loja Nº 1 em Materiais Didáticos
              </Badge>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-md">
                Materiais Didáticos{" "}
                <span className="text-kid-yellow drop-shadow-lg">Divertidos</span>{" "}
                para o Ensino Fundamental!
              </h1>
              <p className="mt-3 sm:mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-white/85 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Atividades, jogos e cadernos em PDF para imprimir! Material didático digital para
                crianças do 1º ao 9º ano. Receba sua key e acesse! 🗝️
              </p>
              <div className="mt-5 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <a href="#produtos">
                  <Button className="w-full sm:w-auto rounded-2xl bg-white text-kid-orange font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-lg hover:shadow-xl hover:bg-white/95 hover:scale-105 transition-all duration-200 animate-pulse-glow">
                    Ver Produtos 🛍️
                  </Button>
                </a>
                <a href="#categorias">
                  <Button
                    className="w-full sm:w-auto rounded-2xl border-2 border-white/50 bg-transparent text-white font-semibold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 hover:bg-white/20 backdrop-blur-sm"
                  >
                    Explorar Categorias
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-1 sm:gap-1.5 glass rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-white text-xs sm:text-sm">
                  <KeyRound className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Entrega por Key
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 glass rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-white text-xs sm:text-sm">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Compra Segura
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 glass rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-white text-xs sm:text-sm">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Material Digital PDF
                </div>
              </div>
            </motion.div>

            {/* Interactive Book */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <InteractiveBook />
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V100H0V50Z"
              fill="#FFFBEB"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════ CATEGORIES SECTION ═══════════════ */}
      <section id="categorias" className="py-16 md:py-24 bg-background pattern-dots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 rounded-full bg-kid-blue/10 text-kid-blue font-semibold text-sm border-kid-blue/20">
              📚 Explore Nossas Categorias
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
              Navegue por <span className="text-kid-blue">Matéria</span>
            </h2>
            <p className="mt-3 text-foreground/60 max-w-lg mx-auto">
              Encontre o material perfeito para cada disciplina. Clique para filtrar os produtos!
            </p>
          </motion.div>

          {/* Main categories */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveCategory(activeCategory === cat.id ? null : cat.id);
                  setActiveSubcategory(null);
                }}
                className={`relative group flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 ${
                  activeCategory === cat.id
                    ? `${cat.color} border-transparent shadow-lg ${cat.shadow} ring-2 ring-white ring-offset-2`
                    : `bg-white ${cat.hoverBorder} hover:shadow-md hover:-translate-y-1`
                }`}
              >
                <span className="flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <SmartIcon emoji={cat.emoji} size={56} animated={activeCategory === cat.id} />
                </span>
                <span className="font-bold text-sm sm:text-lg md:text-xl text-center leading-tight">{cat.name}</span>
                <span className="text-[10px] sm:text-xs text-foreground/40 font-medium">{products.filter(p => p.category === cat.id).length} itens</span>
                {activeCategory === cat.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                  >
                    <X className="h-3 w-3 text-foreground/50" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Subcategories */}
          <AnimatePresence>
            {activeCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <p className="text-center text-sm font-semibold text-foreground/50 mb-4">
                  Subcategorias de{" "}
                  <span className="text-kid-orange">
                    {categories.find((c) => c.id === activeCategory)?.emoji}{" "}
                    {categories.find((c) => c.id === activeCategory)?.name}
                  </span>
                </p>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {categories
                    .find((c) => c.id === activeCategory)
                    ?.subcategories.map((sub, i) => (
                    <motion.button
                      key={sub.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveSubcategory(activeSubcategory === sub.id ? null : sub.id)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                        activeSubcategory === sub.id
                          ? "bg-kid-orange text-white border-kid-orange shadow-md"
                          : "bg-white text-foreground/70 border-foreground/10 hover:border-kid-orange/40 hover:text-kid-orange"
                      }`}
                    >
                      <span className="flex items-center"><SmartIcon emoji={sub.emoji} size={20} animated={activeSubcategory === sub.id} /></span>
                      <span>{sub.name}</span>
                      {activeSubcategory === sub.id && (
                        <X className="h-3 w-3 ml-0.5" />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Active filter summary */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center"
                >
                  <p className="text-foreground/50 text-sm">
                    {activeSubcategory ? (
                      <>
                        Mostrando{" "}
                        <span className="font-bold text-kid-orange">
                          {categories.find((c) => c.id === activeCategory)?.subcategories.find((s) => s.id === activeSubcategory)?.name}
                        </span>
                      </>
                    ) : (
                      <>
                        Mostrando todos os produtos de{" "}
                        <span className="font-bold text-kid-orange">
                          {categories.find((c) => c.id === activeCategory)?.name}
                        </span>
                      </>
                    )}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════════════ PRODUCTS SECTION ═══════════════ */}
      <section id="produtos" ref={productsRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery.trim() !== "" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <Badge className="mb-3 px-4 py-1 rounded-full bg-kid-blue/10 text-kid-blue font-semibold text-sm border-kid-blue/20">
                🔍 Resultados da Busca
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
                Buscando por: <span className="text-kid-blue">"{searchQuery}"</span>
              </h2>
              <p className="mt-3 text-foreground/60 max-w-lg mx-auto">
                {filteredProducts.length > 0
                  ? `${filteredProducts.length} produto${filteredProducts.length === 1 ? " encontrado" : "s encontrados"}`
                  : "Nenhum produto encontrado para essa busca"}
              </p>
            </motion.div>
          ) : activeCategory || activeSubcategory ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <Badge className="mb-3 px-4 py-1 rounded-full bg-kid-purple/10 text-kid-purple font-semibold text-sm border-kid-purple/20">
                📂 {activeSubcategory ? "Subcategoria" : "Categoria"} Selecionada
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
                {activeSubcategory
                  ? `${categories.find((c) => c.id === activeCategory)?.subcategories.find((s) => s.id === activeSubcategory)?.emoji} ${categories.find((c) => c.id === activeCategory)?.subcategories.find((s) => s.id === activeSubcategory)?.name}`
                  : `${categories.find((c) => c.id === activeCategory)?.emoji} ${categories.find((c) => c.id === activeCategory)?.name}`}
              </h2>
              <p className="mt-3 text-foreground/60 max-w-lg mx-auto">
                {filteredProducts.length} produto{filteredProducts.length === 1 ? "" : "s"} {activeSubcategory ? "nesta subcategoria" : "nesta categoria"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-3 px-4 py-1 rounded-full bg-kid-orange/10 text-kid-orange font-semibold text-sm border-kid-orange/20">
                ⭐ Nossos Melhores Produtos
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
                Produtos em <span className="text-kid-orange">Destaque</span> ⭐
              </h2>
              <p className="mt-3 text-foreground/60 max-w-lg mx-auto">
                Material didático de alta qualidade selecionado por educadores
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.has(product.id)}
                  isJustFavorited={justFavorited === product.id}
                  isJustAdded={justAdded === product.id}
                  isDescExpanded={expandedDescId === product.id}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                  onToggleDesc={(id) => setExpandedDescId(expandedDescId === id ? null : id)}
                  onPreviewImage={(src, name) => setPreviewImage({ src, name })}
                  onShareProduct={shareProduct}
                />
              ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 relative">
              {/* Floating decorative emojis */}
              <div className="absolute top-4 left-1/4 text-4xl animate-float opacity-30">🎨</div>
              <div className="absolute top-8 right-1/4 text-3xl animate-float-delay-1 opacity-25">📚</div>
              <div className="absolute bottom-8 left-1/3 text-3xl animate-float-delay-2 opacity-20">✏️</div>
              <div className="absolute bottom-4 right-1/3 text-4xl animate-float-slow opacity-25">🔬</div>

              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-gradient-to-br from-kid-orange/10 to-kid-pink/10 flex items-center justify-center">
                  <span className="text-5xl sm:text-6xl">🔍</span>
                </div>
                {/* Sparkle dots around */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-kid-yellow rounded-full animate-sparkle" />
                <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-kid-blue rounded-full animate-sparkle" style={{ animationDelay: "0.7s" }} />
                <div className="absolute top-1/2 -right-3 w-2 h-2 bg-kid-pink rounded-full animate-sparkle" style={{ animationDelay: "1.2s" }} />
              </div>

              <p className="text-lg font-bold text-foreground/60">Nenhum produto encontrado</p>
              <p className="text-sm text-foreground/40 mt-2">Nossos produtos incríveis estão a caminho!</p>

              {/* Shimmer "coming soon" message */}
              <div className="mt-4 inline-block relative overflow-hidden rounded-full px-5 py-1.5">
                <div className="shimmer-bg absolute inset-0 rounded-full bg-gradient-to-r from-kid-orange/5 via-kid-yellow/20 to-kid-pink/5" />
                <p className="relative text-sm font-semibold text-kid-orange">✨ Em breve novidades por aqui!</p>
              </div>

              <Button
                className="mt-6 rounded-2xl bg-kid-blue text-white font-semibold hover:shadow-kid-blue hover:scale-105 transition-all duration-300"
                onClick={() => { setSearchQuery(""); setActiveCategory(null); setActiveSubcategory(null); }}
              >
                Ver Todos os Produtos
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 rounded-full bg-kid-orange/10 text-kid-orange font-semibold text-sm border-kid-orange/20">
              📋 Simples e Rápido
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
              Como <span className="text-kid-orange">Funciona</span>?
            </h2>
            <p className="mt-3 text-foreground/60 max-w-lg mx-auto">
              Em apenas 3 passos você já pode usar nossos materiais didáticos em PDF
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 md:gap-8 relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-20 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-kid-orange/30 via-kid-pink/30 to-kid-purple/30" />

            {[
              {
                step: "01",
                emoji: "🔍",
                title: "Escolha seu Material",
                description: "Navegue pelas categorias ou use a busca para encontrar o PDF perfeito para o aprendizado.",
                color: "from-kid-orange to-kid-yellow",
                bgColor: "bg-kid-orange/5",
                borderColor: "border-kid-orange/20",
              },
              {
                step: "02",
                emoji: "💳",
                title: "Finalize a Compra",
                description: "Adicione ao carrinho, preencha seus dados e pague com Pix, cartão ou boleto de forma segura.",
                color: "from-kid-pink to-kid-orange",
                bgColor: "bg-kid-pink/5",
                borderColor: "border-kid-pink/20",
              },
              {
                step: "03",
                emoji: "📥",
                title: "Ative sua Key",
                description: "Após o pagamento, você recebe uma key de ativação pelo WhatsApp. Digite a key no site e acesse seu material!",
                color: "from-kid-purple to-kid-pink",
                bgColor: "bg-kid-purple/5",
                borderColor: "border-kid-purple/20",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className={`relative text-center ${item.bgColor} border-2 ${item.borderColor} rounded-3xl p-6 md:p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${item.color} text-white text-3xl md:text-4xl shadow-lg mb-4`}>
                  {item.emoji}
                </div>
                <span className="absolute top-4 right-4 text-4xl md:text-5xl font-black text-foreground/[0.04]">
                  {item.step}
                </span>
                <h3 className="font-bold text-base md:text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 rounded-full bg-kid-blue/10 text-kid-blue font-semibold text-sm border-kid-blue/20">
              ❓ Dúvidas Frequentes
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
              Perguntas <span className="text-kid-blue">Frequentes</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {[
              {
                q: "Como recebo o material após a compra?",
                a: "Após a confirmação do pagamento, você recebe uma key de ativação pelo WhatsApp. Basta digitar a key no site para acessar seu material! O acesso é vitalício e ilimitado.",
                emoji: "📥",
              },
              {
                q: "Posso imprimir quantas vezes quiser?",
                a: "Sim! Após o download, o PDF é seu. Você pode imprimir quantas cópias precisar para uso pessoal ou em sala de aula. Recomendamos impressão em papel sulfite 75g ou superior.",
                emoji: "🖨️",
              },
              {
                q: "Os materiais são para qual faixa etária?",
                a: "Nossos materiais cobrem do 1º ao 6º ano do Ensino Fundamental. Cada produto tem a indicação de série/ano na descrição, facilitando a escolha do material adequado.",
                emoji: "👨‍🎓",
              },
              {
                q: "Qual a forma de pagamento?",
                a: "Por enquanto aceitamos apenas Pix. Após o pagamento, envie o comprovante pelo WhatsApp e receba sua key de ativação na mesma hora! Cartão de crédito em breve!",
                emoji: "💳",
              },
              {
                q: "Posso solicitar reembolso?",
                a: "Sim! Oferecemos garantia de 7 dias. Se o material não atender suas expectativas, entre em contato pelo WhatsApp ou e-mail damatorres50@hotmail.com e devolvemos 100% do valor.",
                emoji: "🛡️",
              },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} emoji={faq.emoji} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT / STATS ═══════════════ */}
      <section id="sobre" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 rounded-full bg-kid-green/10 text-kid-green font-semibold text-sm border-kid-green/20">
              🌱 Sobre a Mundo Aprender
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
              Transformando a <span className="text-kid-green">Educação</span> Brasileira
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* About text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                A <strong className="text-foreground">Mundo Aprender</strong> nasceu da paixão por
                tornar o aprendizado mais divertido e acessível para crianças brasileiras. Acreditamos
                que cada criança merece materiais didáticos digitais que despertem curiosidade e criatividade.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                Trabalhamos com educadores especializados para desenvolver materiais em PDF que combinam
                qualidade pedagógica com design atrativo, garantindo que aprender seja sempre uma
                aventura empolgante! Imprima, use e reuse quantas vezes quiser! 🚀
              </p>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Download, color: "kid-blue", title: "Entrega por Key", desc: "Receba sua key e ative no site" },
                  { icon: Shield, color: "kid-green", title: "Acesso Vitalício", desc: "Download ilimitado para sempre" },
                  { icon: Heart, color: "kid-pink", title: "Feito com Carinho", desc: "Aprovado por educadores" },
                  { icon: Award, color: "kid-purple", title: "Acesso Ilimitado", desc: "Baixe quantas vezes quiser" },
                ].map((feat, fi) => (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: fi * 0.1 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="relative flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm border-2 border-transparent hover:border-kid-orange/20 transition-all duration-300 group overflow-hidden"
                  >
                    {/* Gradient border glow on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-kid-yellow/5 via-transparent to-kid-pink/5 pointer-events-none" />
                    <div className={`w-10 h-10 bg-${feat.color}/10 rounded-xl flex items-center justify-center shrink-0`}>
                      <feat.icon className={`h-5 w-5 text-${feat.color}`} />
                    </div>
                    <div className="relative">
                      <p className="font-bold text-sm text-foreground">{feat.title}</p>
                      <p className="text-xs text-foreground/50">{feat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative grid grid-cols-2 gap-4 md:gap-6"
            >
              {/* Floating school-themed decorative emojis */}
              <span className="absolute -top-8 -left-4 text-3xl animate-float opacity-25">📚</span>
              <span className="absolute -top-6 -right-2 text-2xl animate-float-delay-1 opacity-20">✏️</span>
              <span className="absolute -bottom-6 left-1/4 text-2xl animate-float-delay-2 opacity-20">🎒</span>
              <span className="absolute bottom-0 -right-4 text-3xl animate-float-slow opacity-25">🌟</span>

              {[
                { emoji: "📄", target: 500, suffix: "+", label: "Materiais em PDF", color: "bg-kid-blue/10", border: "border-kid-blue/20" },
                { emoji: "👨‍👩‍👧‍👦", target: 10000, suffix: "+", label: "Clientes Felizes", color: "bg-kid-pink/10", border: "border-kid-pink/20" },
                { emoji: "⭐", target: 4.9, suffix: "/5", label: "Avaliação Média", color: "bg-kid-yellow/10", border: "border-kid-yellow/20", decimals: 1 },
                { emoji: "🏫", target: 2500, suffix: "+", label: "Escolas Parceiras", color: "bg-kid-green/10", border: "border-kid-green/20" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.4 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`${stat.color} border-2 ${stat.border} rounded-3xl p-5 md:p-6 text-center`}
                >
                  <span className="block mb-2"><SmartIcon emoji={stat.emoji} size={36} /></span>
                  <p className="text-2xl md:text-3xl font-black text-foreground">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} decimals={"decimals" in stat ? stat.decimals : 0} />
                  </p>
                  <p className="text-xs md:text-sm text-foreground/50 font-medium mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SUPORTE ═══════════════ */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#FFF7ED] via-[#FFF0F5] to-[#EFF6FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative rounded-3xl sm:rounded-[2rem] overflow-hidden"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-kid-purple via-kid-pink to-kid-blue bg-[length:300%_300%] animate-gradient-x" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            
            {/* Floating decorative elements */}
            <div className="absolute top-6 left-8 text-5xl animate-float opacity-20">💬</div>
            <div className="absolute bottom-8 right-10 text-5xl animate-float-delay-2 opacity-20">🎧</div>
            <div className="absolute top-1/2 left-4 text-4xl animate-float-delay-1 opacity-15">🛟</div>
            <div className="absolute top-8 right-1/4 text-4xl animate-float-delay-3 opacity-15">🤝</div>
            <div className="absolute bottom-10 left-1/4 text-4xl animate-float-slow opacity-15">💬</div>
            <div className="absolute top-1/3 right-6 text-3xl animate-float opacity-10">⭐</div>
            <div className="absolute bottom-1/3 left-6 text-3xl animate-float-delay-2 opacity-10">💪</div>

            <div className="relative p-8 sm:p-10 md:p-14 lg:p-20 text-center">
              <div className="relative max-w-2xl mx-auto">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-bold mb-6 shadow-lg"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]"></span>
                  </span>
                  Suporte disponível
                </motion.div>

                {/* Icon */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-sm mb-5 shadow-2xl">
                    <span className="text-5xl sm:text-6xl">🛟</span>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-lg"
                >
                  Precisa de ajuda?
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-white/80 text-lg sm:text-xl max-w-md mx-auto font-medium"
                >
                  Estamos aqui pra você! Escolha a melhor forma de falar conosco.
                </motion.p>

                {/* Contact Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="mt-10 grid sm:grid-cols-2 gap-5 max-w-lg mx-auto"
                >
                  {/* WhatsApp */}
                  <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
                    <a
                      href="https://wa.me/5566984447849?text=Olá! Preciso de ajuda com o Mundo Aprender."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-4 p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-[#25D366]/50"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#25D366] rounded-full flex items-center justify-center shadow">
                          <span className="text-white text-[10px]">1</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="block text-base font-black text-foreground">WhatsApp</span>
                        <span className="block text-xs text-foreground/50 mt-1">Resposta rápida</span>
                      </div>
                    </a>
                  </motion.div>

                  {/* Email */}
                  <motion.div whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}>
                    <a
                      href="mailto:damatorres50@hotmail.com?subject=Suporte%20Mundo%20Aprender&body=Olá!%20Preciso%20de%20ajuda%20com%20o%20Mundo%20Aprender."
                      className="flex flex-col items-center gap-4 p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-kid-blue/50"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-kid-blue to-kid-purple flex items-center justify-center shadow-lg">
                          <Mail className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="block text-base font-black text-foreground">E-mail</span>
                        <span className="block text-xs text-foreground/50 mt-1">damatorres50@hotmail.com</span>
                      </div>
                    </a>
                  </motion.div>
                </motion.div>

                {/* Availability info */}
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 text-sm text-white/60 font-medium"
                >
                  ⏰ Atendemos de segunda a sexta, das 8h às 18h
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer id="contato" className="relative bg-foreground text-white/80">
        {/* Gradient overlay at top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Colorful top border */}
        <div className="h-2 bg-gradient-to-r from-kid-yellow via-kid-pink via-kid-purple to-kid-blue" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">🎒</span>
                <span className="text-xl font-black bg-gradient-to-r from-kid-yellow to-kid-orange bg-clip-text text-transparent">
                  Mundo Aprender
                </span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed mb-4">
                A loja favorita dos pequenos aprendizes! Materiais didáticos em PDF que tornam
                o aprendizado uma aventura incrível. Baixe, imprima e divirta-se!
              </p>
              <div className="flex gap-2">
                {[
                  { Icon: Facebook, color: "hover:bg-[#1877F2] hover:text-white" },
                  { Icon: Instagram, color: "hover:bg-[#E4405F] hover:text-white" },
                  { Icon: Twitter, color: "hover:bg-[#1DA1F2] hover:text-white" },
                  { Icon: Youtube, color: "hover:bg-[#FF0000] hover:text-white" },
                ].map(({ Icon, color }, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center transition-all duration-200 ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Links Rápidos
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Início", href: "#inicio" },
                  { label: "Categorias", href: "#categorias" },
                  { label: "Produtos em Destaque", href: "#produtos" },
                  { label: "Sobre Nós", href: "#sobre" },
                  { label: "Política de Privacidade", href: "#" },
                  { label: "Termos de Uso", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 hover:text-kid-yellow transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Categorias
              </h4>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setActiveSubcategory(null);
                        document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-sm text-white/50 hover:text-kid-yellow transition-colors flex items-center gap-1.5 font-semibold"
                    >
                      <span className="flex items-center"><SmartIcon emoji={cat.emoji} size={18} animated={false} /></span> {cat.name}
                    </button>
                    <ul className="ml-6 mt-1 space-y-1">
                      {cat.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <button
                            onClick={() => {
                              setActiveCategory(cat.id);
                              setActiveSubcategory(sub.id);
                              document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="text-xs text-white/35 hover:text-kid-yellow/80 transition-colors flex items-center gap-1"
                          >
                            <span className="flex items-center"><SmartIcon emoji={sub.emoji} size={16} animated={false} /></span> {sub.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
                Contato
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-kid-green shrink-0" />
                  <span className="text-sm text-white/50">(66) 98444-7849</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-kid-blue shrink-0" />
                  <span className="text-sm text-white/50">damatorres50@hotmail.com</span>
                </li>
              </ul>

              {/* Mini trust badges */}
              <div className="mt-6 flex gap-3">
                <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1">
                  <Shield className="h-3.5 w-3.5 text-kid-green" />
                  <span className="text-[10px] text-white/40">SSL</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1">
                  <Shield className="h-3.5 w-3.5 text-kid-blue" />
                  <span className="text-[10px] text-white/40">Seguro</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1">
                  <Award className="h-3.5 w-3.5 text-kid-yellow" />
                  <span className="text-[10px] text-white/40">Premium</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">
              © 2026 Mundo Aprender - Todos os direitos reservados. Feito com 💛 no Brasil
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {[
                  { label: "Visa", emoji: "💳", color: "bg-[#1A1F71]/30 border-[#1A1F71]/20" },
                  { label: "Mastercard", emoji: "💳", color: "bg-[#EB001B]/20 border-[#EB001B]/20" },
                  { label: "Pix", emoji: "📱", color: "bg-[#32BCAD]/20 border-[#32BCAD]/20" },
                  { label: "Boleto", emoji: "🏦", color: "bg-[#FF6600]/20 border-[#FF6600]/20" },
                ].map((payment) => (
                  <div key={payment.label} className={`flex items-center gap-1 rounded-lg border px-2 py-1 ${payment.color}`}>
                    <span className="text-xs">{payment.emoji}</span>
                    <span className="text-[10px] text-white/40 font-medium">{payment.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-white/40">
                <Link href="/termos-de-uso" className="hover:text-white/60 transition-colors underline decoration-white/20 hover:decoration-white/40">
                  Termos de Uso
                </Link>
                <span className="text-white/20">|</span>
                <Link href="/politica-de-privacidade" className="hover:text-white/60 transition-colors underline decoration-white/20 hover:decoration-white/40">
                  Politica de Privacidade
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════════════ FAVORITES SHEET ═══════════════ */}
      <Sheet open={favoritesOpen} onOpenChange={setFavoritesOpen}>
        <SheetContent className="w-full sm:max-w-md bg-white p-0 flex flex-col">
          <SheetTitle className="sr-only">Meus Favoritos</SheetTitle>
          <div className="bg-gradient-to-r from-kid-pink to-kid-purple p-6 text-white">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6" fill="currentColor" />
              <h2 className="text-xl font-bold">Meus Favoritos</h2>
            </div>
            <p className="text-white/80 text-sm mt-1">
              {favorites.size === 0
                ? "Nenhum favorito ainda"
                : `${favorites.size} produto${favorites.size === 1 ? "" : "s"} salvo${favorites.size === 1 ? "" : "s"}`}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {favorites.size === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <span className="text-6xl mb-4">💝</span>
                <p className="text-lg font-semibold text-foreground/60">Nenhum favorito ainda</p>
                <p className="text-sm text-foreground/40 mt-1">Clique no ❤️ dos produtos que você gostou!</p>
                <Button
                  className="mt-4 rounded-2xl bg-kid-pink hover:bg-kid-pink/90 text-white font-semibold"
                  onClick={() => setFavoritesOpen(false)}
                >
                  Ver Produtos
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {products
                  .filter((p) => favorites.has(p.id))
                  .map((product) => {
                    const inCart = cartItems.some((item) => item.id === product.id);
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="flex items-center gap-3 bg-kid-pink/5 rounded-2xl p-3 border border-kid-pink/20"
                      >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                          {product.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{product.name}</p>
                          <p className="text-kid-pink font-bold text-sm">
                            R$ {product.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant={inCart ? "outline" : "default"}
                            size="sm"
                            className={`rounded-xl text-[11px] px-2.5 h-8 ${
                              inCart
                                ? "border-kid-orange/30 text-kid-orange bg-white"
                                : "bg-kid-orange hover:bg-kid-orange/90 text-white"
                            }`}
                            onClick={() => addToCart(product)}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            {inCart ? "No carrinho" : "Comprar"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl text-[11px] px-2.5 h-7 text-kid-red hover:bg-kid-red/10"
                            onClick={() => toggleFavorite(product.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            )}
          </div>

          {favorites.size > 0 && (
            <div className="border-t-2 border-kid-pink/20 p-4 bg-white">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-foreground/60">Total dos favoritos:</span>
                <span className="text-xl font-black text-kid-pink">
                  R$ {products
                    .filter((p) => favorites.has(p.id))
                    .reduce((sum, p) => sum + p.price, 0)
                    .toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full rounded-2xl bg-gradient-to-r from-kid-pink to-kid-purple hover:from-kid-pink/90 hover:to-kid-purple/90 text-white font-bold text-base py-5 shadow-kid-pink"
                onClick={() => {
                  favorites.forEach((id) => {
                    const product = products.find((p) => p.id === id);
                    if (product && !cartItems.some((item) => item.id === id)) {
                      addToCart(product);
                    }
                  });
                  setFavoritesOpen(false);
                  setTimeout(() => setCartOpen(true), 250);
                }}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Adicionar Tudo ao Carrinho 🛒
              </Button>
              <Button
                className="w-full mt-2 rounded-2xl bg-transparent text-[#1a1a2e]/50 hover:text-[#1a1a2e] hover:bg-kid-pink/10"
                onClick={() => setFavoritesOpen(false)}
              >
                Continuar Navegando
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ═══════════════ CHECKOUT SHEET ═══════════════ */}
      <Sheet open={checkoutOpen} onOpenChange={(open) => {
        if (!open) setCheckoutOpen(false);
      }}>
        <SheetContent className="w-full sm:max-w-lg bg-white p-0 flex flex-col overflow-y-auto">
          <SheetTitle className="sr-only">Finalizar Compra</SheetTitle>
          {/* Checkout Header */}
          <div className="bg-gradient-to-r from-kid-orange via-kid-pink to-kid-purple p-6 text-white sticky top-0 z-10">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-white hover:text-white hover:bg-white/20 mr-3 shrink-0 font-bold text-base"
                onClick={() => {
                  if (checkoutStep === 1) setCheckoutOpen(false);
                  else setCheckoutStep(checkoutStep === 2 ? 1 : 2);
                }}
              >
                <ChevronLeft className="h-5 w-5 mr-1" /> Voltar
              </Button>
              <div className="flex items-center gap-3 min-w-0">
                <ShoppingCart className="h-6 w-6 shrink-0" />
                <h2 className="text-xl font-bold truncate">Finalizar Compra</h2>
              </div>
            </div>
            {/* Steps indicator */}
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    checkoutStep >= step
                      ? "bg-white text-kid-orange"
                      : "bg-white/20 text-white/50"
                  }`}>
                    {checkoutStep > step ? <CheckCircle2 className="h-4 w-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`h-0.5 w-8 rounded transition-all ${
                      checkoutStep > step ? "bg-white" : "bg-white/20"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 p-6">
            {/* Step 1: Customer info */}
            {checkoutStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <span className="text-4xl">📄</span>
                  <h3 className="text-lg font-bold mt-2">Dados para Recebimento</h3>
                  <p className="text-sm text-foreground/50">Dados para receber sua key de ativação</p>
                </div>

                <div className="bg-kid-blue/10 rounded-2xl p-4 border border-kid-blue/20 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-kid-blue shrink-0" />
                  <p className="text-sm text-foreground/70">Produto digital em PDF — após o pagamento, você recebe uma key de ativação pelo WhatsApp!</p>
                </div>

                <div className="space-y-3">
                  {/* Saved data prompt */}
                  {showSavedPrompt && savedCustomer && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-kid-blue/10 rounded-2xl p-4 border-2 border-kid-blue/20"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg">💡</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground/80">
                            Usar dados da ultima compra?
                          </p>
                          <p className="text-xs text-foreground/50 mt-1 mb-3">
                            {savedCustomer.name} — {savedCustomer.email}
                            {savedCustomer.phone ? ` — ${savedCustomer.phone}` : ""}
                            {savedCustomer.state ? ` — ${savedCustomer.state}` : ""}
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={fillFromSaved}
                              className="flex-1 rounded-xl bg-kid-blue text-white font-semibold text-xs py-2 hover:bg-kid-blue/90 transition-colors active:scale-[0.97]"
                            >
                              Sim, preencher
                            </button>
                            <button
                              type="button"
                              onClick={fillManually}
                              className="flex-1 rounded-xl bg-foreground/5 text-foreground/60 font-semibold text-xs py-2 hover:bg-foreground/10 transition-colors active:scale-[0.97]"
                            >
                              Preencher manual
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <Label className="text-sm font-semibold text-foreground/70 mb-1 block">Nome Completo *</Label>
                    <Input
                      placeholder="Seu nome completo"
                      className="rounded-2xl border-2 border-kid-orange/20 focus:border-kid-orange"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-foreground/70 mb-1 block">E-mail *</Label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      className="rounded-2xl border-2 border-kid-orange/20 focus:border-kid-orange"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    />
                    <p className="text-xs text-foreground/40 mt-1">Seu contato para caso precisemos</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-foreground/70 mb-1 block">Telefone</Label>
                    <div className="flex">
                      <DDDSelector
                        selectedDDD={selectedDDD}
                        selectedState={customer.state}
                        onStateChange={(uf) => setCustomer({ ...customer, state: uf })}
                        onDDDChange={handleDDDChange}
                      />
                      <Input
                        placeholder="99999-9999"
                        className="rounded-l-none rounded-r-2xl border-2 border-l-0 border-kid-orange/20 focus:border-kid-orange"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: formatPhone(e.target.value) })}
                      />
                    </div>
                  </div>
                  <StateSelector
                    value={customer.state}
                    onChange={(state) => setCustomer({ ...customer, state })}
                  />
                </div>

                <Button
                  className="w-full rounded-2xl bg-gradient-to-r from-kid-orange to-kid-pink text-white font-bold text-lg py-6 shadow-kid-orange mt-2"
                  onClick={saveCustomerAndAdvance}
                  disabled={!customer.name || !customer.email}
                >
                  Revisar Pedido ➡️
                </Button>
              </motion.div>
            )}

            {/* Step 2: Order summary */}
            {checkoutStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <span className="text-4xl">🛍️</span>
                  <h3 className="text-lg font-bold mt-2">Resumo do Pedido</h3>
                </div>

                {/* Customer info summary */}
                <div className="bg-kid-yellow/10 rounded-2xl p-4 border border-kid-yellow/20">
                  <p className="text-xs font-semibold text-foreground/50 mb-1">Dados do comprador:</p>
                  <p className="text-sm font-semibold">{customer.name}</p>
                  <p className="text-xs text-foreground/60">{customer.email}</p>
                  {customer.phone && <p className="text-xs text-foreground/60">{customer.phone}</p>}
                  {customer.state && (
                    <p className="text-xs text-foreground/60">
                      {BRAZILIAN_STATES.find(s => s.abbreviation === customer.state)?.name} ({customer.state})
                    </p>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground/50">Itens:</p>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-kid-orange/5 rounded-xl p-3 border border-kid-orange/10">
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{item.name}</p>
                        <p className="text-xs text-foreground/50">Qtd: {item.quantity} × R$ {item.price.toFixed(2)}</p>
                      </div>
                      <span className="text-sm font-bold text-kid-orange">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-kid-orange to-kid-pink rounded-2xl p-4 text-white">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total do Pedido:</span>
                    <span className="text-2xl font-black">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-white/70 text-xs mt-1">Key de ativação enviada após pagamento 🗝️</p>
                </div>

                <div
                  onClick={() => setCheckoutTermsAccepted(!checkoutTermsAccepted)}
                  className={`flex items-start gap-3 cursor-pointer select-none rounded-2xl p-3.5 border-2 transition-all duration-300 ${checkoutTermsAccepted ? 'bg-kid-orange/5 border-kid-orange/30 shadow-md shadow-kid-orange/10' : 'bg-white border-gray-200 hover:border-kid-orange/20 hover:bg-kid-orange/[0.02]'}`}
                >
                  <div className={`shrink-0 w-6 h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 overflow-hidden ${checkoutTermsAccepted ? 'bg-kid-orange border-kid-orange shadow-sm shadow-kid-orange/30' : 'bg-white border-gray-300'}`}>
                    {checkoutTermsAccepted && (
                      <AnimatedIcon name="check-circle" size={24} color="#FFFFFF" animated={true} />
                    )}
                  </div>
                  <span className="text-sm text-foreground/70 leading-relaxed">
                    Li e concordo com os{" "}
                    <Link href="/termos-de-uso" target="_blank" className="text-kid-orange font-semibold underline hover:text-kid-orange/70">
                      Termos de Uso
                    </Link>{" "}
                    e a{" "}
                    <Link href="/politica-de-privacidade" target="_blank" className="text-kid-orange font-semibold underline hover:text-kid-orange/70">
                      Politica de Privacidade
                    </Link>
                  </span>
                </div>

                <Button
                  className="w-full rounded-2xl bg-gradient-to-r from-kid-green to-[#2f9e5a] hover:from-[#2f9e5a] hover:to-[#228b4d] text-white font-bold text-lg py-6 shadow-kid-green/30"
                  onClick={handleCheckout}
                  disabled={checkoutLoading || !checkoutTermsAccepted}
                >
                  {checkoutLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Preparando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Finalizar Compra 🎉
                    </span>
                  )}
                </Button>
                {!checkoutTermsAccepted && (
                  <p className="text-center text-sm text-kid-orange flex items-center justify-center gap-2 font-medium">
                    <AnimatedIcon name="alert-circle" size={20} color="#FF922B" animated={true} />
                    Aceite os termos acima para continuar
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 3: Payment Result (Checkout Pro callback) */}
            {checkoutStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-center py-4"
              >
                <img src="https://devtools.com.br/img/pix/logo-pix-png-icone-520x520.png" alt="Pix" className="h-14 w-auto mx-auto mb-3 object-contain" />
                <h3 className="text-xl font-black text-foreground">Pagamento via PIX</h3>
                <p className="text-foreground/60 mt-1 text-sm">
                  Efetue o pagamento e envie o comprovante
                </p>

                {/* Order total */}
                <div className="mt-4 bg-gradient-to-r from-kid-orange to-kid-pink rounded-2xl p-4 text-white">
                  <p className="text-xs text-white/70">Valor a pagar</p>
                  <p className="text-3xl font-black">R$ {totalPrice.toFixed(2)}</p>
                </div>

                {/* Payment method tabs */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-kid-green/10 border-2 border-kid-green/40 shadow-sm">
                    <img src="https://devtools.com.br/img/pix/logo-pix-png-icone-520x520.png" alt="Pix" className="h-8 w-auto object-contain" />
                    <span className="text-xs font-bold text-foreground">Pix</span>
                    <span className="text-[10px] text-kid-green font-semibold">Disponível</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-foreground/5 border-2 border-foreground/10 cursor-not-allowed">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTIMaJ2EZbryt3Hur2j_qYUZwmYEOYM2uQ3aE-aEtJIkeBE4i6Cm0A_pZb&s=10" alt="Cartão de Crédito" className="h-8 w-auto object-contain opacity-40 mix-blend-multiply" />
                    <span className="text-xs font-bold text-foreground/40">Cartão de Crédito</span>
                    <span className="text-[10px] text-foreground/30 font-semibold">Em breve</span>
                  </div>
                </div>

                {/* Copy PIX code */}
                <div className="mt-5 bg-kid-green/10 rounded-2xl p-5 border-2 border-kid-green/20">
                  <p className="text-xs font-semibold text-foreground/50 mb-3">Copia e cola o código PIX:</p>
                  <button
                    onClick={copyPixCode}
                    className="w-full flex items-center gap-3 bg-white rounded-xl p-3 border-2 border-kid-green/30 hover:border-kid-green/60 transition-all active:scale-[0.98] shadow-sm"
                  >
                    {pixCopied ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-kid-green/20 flex items-center justify-center shrink-0">
                          <Check className="h-5 w-5 text-kid-green" />
                        </div>
                        <span className="text-sm font-bold text-kid-green flex-1 text-left">Código copiado!</span>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-kid-green/10 flex items-center justify-center shrink-0">
                          <Copy className="h-5 w-5 text-kid-green" />
                        </div>
                        <span className="text-sm font-bold text-foreground flex-1 text-left">Copiar código PIX</span>
                      </>
                    )}
                  </button>
                </div>

                {/* WhatsApp instruction */}
                <div className="mt-4 bg-[#25D366]/10 rounded-2xl p-4 border-2 border-[#25D366]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📱</span>
                    <p className="text-sm font-bold text-foreground">Envie o comprovante</p>
                  </div>
                  <p className="text-xs text-foreground/60 mb-3">
                    Após pagar, envie o comprovante pelo WhatsApp para receber sua key de ativação:
                  </p>
                  <a
                    href="https://wa.me/5566984447849?text=Olá! Acabei de realizar o pagamento pelo Mundo Aprender. Segue o comprovante:"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full p-3 bg-[#25D366] hover:bg-[#1da851] text-white rounded-xl font-bold transition-colors text-sm shadow-md"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Enviar Comprovante
                  </a>
                  <p className="text-[10px] text-foreground/40 mt-2">(66) 98444-7849</p>
                </div>

                {/* Nubank payment option */}
                <div className="mt-4 bg-[#820AD1]/10 rounded-2xl p-4 border-2 border-[#820AD1]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src="https://imgs.search.brave.com/UNJ3X6hCb_iyuWCqrEk9BVIexCkriJr3oHBZQFqmmtk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9sb2dv/ZG93bmxvYWQub3Jn/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDE5/LzA4L251YmFuay1s/b2dvLTIucG5n"
                      alt="Nubank"
                      className="h-6 w-auto object-contain"
                    />
                    <p className="text-sm font-bold text-foreground">Prefere pagar pelo Nubank?</p>
                  </div>
                  <p className="text-xs text-foreground/60 mb-3">
                    Clique abaixo e pague direto pelo seu Nubank, sem precisar copiar código PIX:
                  </p>
                  <a
                    href="https://nubank.com.br/cobrar/fymy8c/69e98c4e-f0bc-4bae-9737-4639732bbe06"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full p-3 bg-[#820AD1] hover:bg-[#6B08A8] text-white rounded-xl font-bold transition-colors text-sm shadow-md"
                  >
                    Pagar com Nubank
                  </a>
                  <p className="text-[10px] text-foreground/40 mt-2">Abre direto no app do Nubank</p>
                </div>

                {/* Items reminder */}
                <div className="mt-4 text-left bg-kid-blue/5 rounded-2xl p-4 border border-kid-blue/10">
                  <p className="text-xs font-semibold text-foreground/50 mb-2">Itens do pedido:</p>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 mb-1.5 last:mb-0">
                      <span className="text-base">{item.emoji}</span>
                      <span className="text-xs text-foreground/70 flex-1 truncate">{item.name}</span>
                      <span className="text-xs font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  <Button
                    className="w-full rounded-2xl bg-transparent text-foreground/50 hover:text-foreground hover:bg-kid-yellow/10 font-semibold"
                    onClick={() => {
                      setCheckoutStep(2);
                    }}
                  >
                    ← Voltar ao Resumo
                  </Button>
                  <Button
                    className="w-full rounded-2xl bg-gradient-to-r from-kid-green to-[#2f9e5a] hover:from-[#2f9e5a] hover:to-[#228b4d] text-white font-bold text-lg py-6 shadow-lg shadow-kid-green/25 hover:shadow-xl hover:shadow-kid-green/30 transition-all duration-300 active:scale-[0.98]"
                    onClick={() => {
                      setCheckoutOpen(false);
                      setCheckoutStep(1);
                      setCartItems([]);
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Pagamento Confirmado
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* ═══════════════ SCROLL TO TOP ═══════════════ */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const startY = window.scrollY;
              const distance = -startY;
              const duration = 600;
              let start: number | null = null;
              function step(timestamp: number) {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                const ease = progress < 0.5
                  ? 4 * progress * progress * progress
                  : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                window.scrollTo(0, startY + distance * ease);
                if (progress < 1) requestAnimationFrame(step);
              }
              requestAnimationFrame(step);
            }}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-kid-orange text-white rounded-2xl shadow-kid-orange flex items-center justify-center hover:bg-kid-orange/90 transition-colors"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══════════════ ACTIVATE CODE MODAL ═══════════════ */}
      <AnimatePresence>
        {activateOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeActivate} />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 w-full sm:max-w-md mx-3 mb-3 sm:mb-0 bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-kid-purple to-kid-blue p-6 text-white text-center">
                <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <KeyRound className="h-8 w-8 mx-auto mb-2" />
                </motion.div>
                <h3 className="text-lg font-bold">Ativar Produto</h3>
                <p className="text-white/80 text-xs mt-1">Digite o código que recebeu para liberar seu produto</p>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6">
                {activateStep === "input" && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-foreground/80 mb-2 block">Código de Ativação</Label>
                      <Input
                        value={activateCode}
                        onChange={(e) => {
                          let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);
                          // Auto-insert dashes: XXXX-XXXX-XXXX-XXXX
                          const parts = raw.match(/.{1,4}/g);
                          const formatted = parts ? parts.join("-") : "";
                          setActivateCode(formatted);
                          setActivateError("");
                        }}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        className="text-center text-lg font-mono tracking-[0.2em] h-14 rounded-2xl border-2 border-foreground/10 focus:border-kid-purple/50"
                        maxLength={19}
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleActivateCode()}
                      />
                    </div>

                    {activateError && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs font-semibold text-red-500 text-center bg-red-50 rounded-xl px-3 py-2"
                      >
                        {activateError}
                      </motion.p>
                    )}

                    <div
                      onClick={() => setActivateTermsAccepted(!activateTermsAccepted)}
                      className={`flex items-start gap-3 cursor-pointer select-none rounded-2xl p-3.5 border-2 transition-all duration-300 ${activateTermsAccepted ? 'bg-kid-orange/5 border-kid-orange/30 shadow-md shadow-kid-orange/10' : 'bg-white border-gray-200 hover:border-kid-orange/20 hover:bg-kid-orange/[0.02]'}`}
                    >
                      <div className={`shrink-0 w-6 h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 overflow-hidden ${activateTermsAccepted ? 'bg-kid-orange border-kid-orange shadow-sm shadow-kid-orange/30' : 'bg-white border-gray-300'}`}>
                        {activateTermsAccepted && (
                          <AnimatedIcon name="check-circle" size={24} color="#FFFFFF" animated={true} />
                        )}
                      </div>
                      <span className="text-sm text-foreground/70 leading-relaxed">
                        Li e concordo com os{" "}
                        <Link href="/termos-de-uso" target="_blank" className="text-kid-orange font-semibold underline hover:text-kid-orange/70">
                          Termos de Uso
                        </Link>{" "}
                        e a{" "}
                        <Link href="/politica-de-privacidade" target="_blank" className="text-kid-orange font-semibold underline hover:text-kid-orange/70">
                          Politica de Privacidade
                        </Link>
                      </span>
                    </div>

                    <Button
                      onClick={handleActivateCode}
                      className="w-full h-13 rounded-2xl bg-gradient-to-r from-kid-purple to-kid-blue text-white font-bold text-sm shadow-lg hover:shadow-xl hover:opacity-90 transition-all active:scale-[0.98]"
                      disabled={activateCode.replace(/-/g, "").length < 16 || !activateTermsAccepted}
                    >
                      Ativar
                    </Button>

                    {!activateTermsAccepted && (
                      <p className="text-center text-sm text-kid-blue flex items-center justify-center gap-2 font-medium">
                        <AnimatedIcon name="alert-circle" size={20} color="#4DABF7" animated={true} />
                        Aceite os termos acima para continuar
                      </p>
                    )}

                    <p className="text-[10px] text-foreground/30 text-center">
                      Recebeu o código no WhatsApp após enviar o comprovante PIX
                    </p>
                  </div>
                )}

                {activateStep === "loading" && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 text-kid-purple animate-spin" />
                    <p className="text-sm font-semibold text-foreground/60 mt-3">Verificando código...</p>
                  </div>
                )}

                {activateStep === "activated" && activatedProducts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-kid-green/10 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-kid-green" />
                    </div>
                    <div>
                      <p className="text-xs text-foreground/50 font-medium">Seus Produtos Liberados</p>
                    </div>

                    <div className="space-y-2">
                      {activatedProducts.map((prod, idx) => (
                        <a
                          key={idx}
                          href={prod.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 w-full p-3 rounded-2xl bg-kid-green/5 border border-kid-green/20 hover:bg-kid-green/10 transition-colors text-left"
                        >
                          <span className="text-2xl">{prod.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">{prod.name}</p>
                            <p className="text-[10px] text-kid-green font-semibold">Liberado</p>
                          </div>
                          <Download className="h-5 w-5 text-kid-green shrink-0" />
                        </a>
                      ))}
                    </div>

                    <Button
                      onClick={() => {
                        setActivateStep("input");
                        setActivateCode("");
                        setActivateError("");
                      }}
                      variant="outline"
                      className="w-full h-11 rounded-2xl border-2 border-dashed border-kid-blue/30 text-kid-blue hover:bg-kid-blue/5 hover:border-kid-blue/50 font-bold text-sm transition-all"
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      Ativar outro produto
                    </Button>

                    <Button
                      onClick={closeActivate}
                      variant="ghost"
                      className="w-full h-10 rounded-2xl text-foreground/40 hover:text-foreground/60 text-xs"
                    >
                      Fechar
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={closeActivate}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ CART TOAST NOTIFICATION ═══════════════ */}
      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ paddingBottom: "max(10px, env(safe-area-inset-bottom, 10px))" }}
            className="fixed bottom-3 left-3 right-3 sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto sm:max-w-xs z-50 flex items-center gap-2 bg-white border-2 border-kid-green/30 rounded-2xl shadow-lg shadow-kid-green/10 px-3 py-2.5 sm:px-4 sm:py-3"
          >
            <span className="text-xl sm:text-2xl shrink-0 leading-none">{cartToast.emoji}</span>
            <span className="text-xs sm:text-sm font-bold text-foreground truncate flex-1 min-w-0">{cartToast.name}</span>
            <span className="text-kid-green shrink-0">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={3} />
            </span>
            <button
              onClick={() => { setCartToast(null); setCartOpen(true); }}
              className="shrink-0 flex items-center gap-1 text-[11px] sm:text-xs font-bold text-white bg-kid-blue rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 active:scale-95 transition-transform"
            >
              <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Ver
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ IMAGE LIGHTBOX ═══════════════ */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            onClick={() => setPreviewImage(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Top bar: title + close button — always above image */}
            <div className="relative z-[110] flex items-center justify-between w-full px-4 pt-3 pb-2 sm:px-8 sm:pt-5 sm:pb-3 shrink-0">
              {/* Product name */}
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: 0.1 }}
                className="text-white/90 font-semibold text-xs sm:text-base bg-white/10 backdrop-blur-md rounded-full px-3 py-1 sm:px-4 sm:py-1.5 border border-white/20 max-w-[55vw] sm:max-w-[60vw] truncate"
              >
                {previewImage.name}
              </motion.p>

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setPreviewImage(null)}
                className="shrink-0 ml-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:bg-white/25 hover:border-white/50 active:scale-90 transition-all duration-200 group/close"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover/close:rotate-90 transition-transform duration-300" />
              </motion.button>
            </div>

            {/* Image container — fills remaining space */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              className="relative z-[105] flex-1 min-h-0 w-full flex items-center justify-center px-3 pb-4 sm:px-6 sm:pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-5 shadow-2xl max-w-full max-h-full flex items-center justify-center">
                <img
                  src={previewImage.src}
                  alt={previewImage.name}
                  className="max-w-full max-h-full object-contain rounded-xl"
                  style={{ maxHeight: 'calc(100dvh - 90px)' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
