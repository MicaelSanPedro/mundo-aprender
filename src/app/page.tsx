"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  CheckCircle2,
  Clock,
  Loader2,
  Download,
  FileText,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────── */

const categories = [
  { id: "matematica", emoji: "🔢", name: "Matemática", color: "bg-kid-blue", shadow: "shadow-kid-blue", hoverBorder: "hover:border-kid-blue", itemCount: 85 },
  { id: "portugues", emoji: "📝", name: "Português", color: "bg-kid-pink", shadow: "shadow-kid-pink", hoverBorder: "hover:border-kid-pink", itemCount: 72 },
  { id: "ciencias", emoji: "🔬", name: "Ciências", color: "bg-kid-green", shadow: "shadow-kid-green", hoverBorder: "hover:border-kid-green", itemCount: 64 },
  { id: "historia", emoji: "📜", name: "História", color: "bg-kid-orange", shadow: "shadow-kid-orange", hoverBorder: "hover:border-kid-orange", itemCount: 53 },
  { id: "geografia", emoji: "🌍", name: "Geografia", color: "bg-kid-purple", shadow: "shadow-kid-purple", hoverBorder: "hover:border-kid-purple", itemCount: 48 },
  { id: "artes", emoji: "🎨", name: "Artes", color: "bg-kid-yellow", shadow: "shadow-kid-yellow", hoverBorder: "hover:border-kid-yellow", itemCount: 61 },
];

const products = [
  {
    id: 1,
    name: "Caderno de Matemática - 3º Ano (PDF)",
    description: "Exercícios divertidos com jogos e desafios numéricos — pronto para imprimir",
    price: 34.90,
    originalPrice: 49.90,
    rating: 5,
    reviews: 128,
    emoji: "📓",
    bgColor: "bg-blue-50",
    borderHover: "hover:border-kid-blue",
    category: "matematica",
    tag: "Mais Vendido",
    tagColor: "bg-kid-orange",
  },
  {
    id: 2,
    name: "Kit de Alfabetização Completo (PDF)",
    description: "Cartilhas, flashcards e atividades para imprimir e aprender a ler e escrever",
    price: 89.90,
    originalPrice: 129.90,
    rating: 5,
    reviews: 256,
    emoji: "📚",
    bgColor: "bg-pink-50",
    borderHover: "hover:border-kid-pink",
    category: "portugues",
    tag: "Promoção",
    tagColor: "bg-kid-red",
  },
  {
    id: 3,
    name: "Laboratório de Ciências - PDF",
    description: "Experimentos seguros e educativos para pequenos cientistas — imprima e faça em casa!",
    price: 149.90,
    originalPrice: null,
    rating: 4,
    reviews: 89,
    emoji: "🧪",
    bgColor: "bg-green-50",
    borderHover: "hover:border-kid-green",
    category: "ciencias",
    tag: "Novo",
    tagColor: "bg-kid-green",
  },
  {
    id: 4,
    name: "Atlas Ilustrado do Brasil (PDF)",
    description: "Mapas coloridos, capitais e curiosidades sobre cada estado — pronto para imprimir",
    price: 44.90,
    originalPrice: 59.90,
    rating: 5,
    reviews: 167,
    emoji: "🗺️",
    bgColor: "bg-purple-50",
    borderHover: "hover:border-kid-purple",
    category: "geografia",
    tag: "-25%",
    tagColor: "bg-kid-orange",
  },
  {
    id: 5,
    name: "Jogo da Linha do Tempo - PDF",
    description: "Aprenda história brincando! Imprima e jogue com a história do Brasil",
    price: 79.90,
    originalPrice: null,
    rating: 4,
    reviews: 95,
    emoji: "🎲",
    bgColor: "bg-orange-50",
    borderHover: "hover:border-kid-orange",
    category: "historia",
    tag: "Favorito",
    tagColor: "bg-kid-pink",
  },
  {
    id: 6,
    name: "Kit de Pintura Artística - PDF",
    description: "24 atividades de pintura para explorar a criatividade — imprima e pinte!",
    price: 59.90,
    originalPrice: 74.90,
    rating: 5,
    reviews: 203,
    emoji: "🖌️",
    bgColor: "bg-yellow-50",
    borderHover: "hover:border-kid-yellow",
    category: "artes",
    tag: "-20%",
    tagColor: "bg-kid-orange",
  },
  {
    id: 7,
    name: "Quebra-Cabeça do Sistema Solar - PDF",
    description: "200 peças para recortar e montar com informações sobre cada planeta",
    price: 39.90,
    originalPrice: null,
    rating: 4,
    reviews: 78,
    emoji: "🪐",
    bgColor: "bg-blue-50",
    borderHover: "hover:border-kid-blue",
    category: "ciencias",
    tag: "Novo",
    tagColor: "bg-kid-green",
  },
  {
    id: 8,
    name: "Caderno de Caligrafia Divertida (PDF)",
    description: "Letras e números com ilustrações para treinar a escrita — pronto para imprimir",
    price: 24.90,
    originalPrice: 34.90,
    rating: 5,
    reviews: 312,
    emoji: "✏️",
    bgColor: "bg-pink-50",
    borderHover: "hover:border-kid-pink",
    category: "portugues",
    tag: "Mais Vendido",
    tagColor: "bg-kid-orange",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Professora Maria Silva",
    role: "Professora do 2º Ano - Escola Municipal",
    emoji: "👩‍🏫",
    rating: 5,
    text: "Os materiais em PDF da Mundo Aprender transformaram minha sala de aula! Eu imprimo as atividades e as crianças ficaram muito mais engajadas — os resultados nas provas melhoraram demais!",
    bgColor: "bg-kid-blue/10",
    borderColor: "border-kid-blue/30",
  },
  {
    id: 2,
    name: "Ana Paula Oliveira",
    role: "Mãe da Sofia, 7 anos",
    emoji: "👩",
    rating: 5,
    text: "Comprei o kit de alfabetização em PDF e minha filha aprendeu a ler em 2 meses! As atividades para imprimir são super divertidas e ela não quer parar de estudar.",
    bgColor: "bg-kid-pink/10",
    borderColor: "border-kid-pink/30",
  },
  {
    id: 3,
    name: "Pedro Santos",
    role: "Pai do Lucas, 9 anos",
    emoji: "👨",
    rating: 5,
    text: "O PDF de laboratório de ciências é incrível! Meu filho agora quer ser cientista. Imprimimos os experimentos em casa e as instruções são super claras e divertidas!",
    bgColor: "bg-kid-green/10",
    borderColor: "border-kid-green/30",
  },
];

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

/* ─── Component ─────────────────────────────────────────── */

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
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
    name: "", email: "", phone: "",
  });
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Order history state
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

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

  // Zip code mask helper
  const formatZipCode = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  // Open checkout from cart
  const openCheckout = () => {
    setCheckoutStep(1);
    setCustomer({ name: "", email: "", phone: "" });
    setCompletedOrder(null);
    setCartOpen(false);
    setTimeout(() => setCheckoutOpen(true), 200);
  };

  // Submit order
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          customer,
          total: totalPrice,
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar pedido");
      const order: Order = await res.json();
      setCompletedOrder(order);
      setCheckoutStep(3);
      setCartItems([]);
    } catch {
      alert("Erro ao processar pedido. Tente novamente.");
    } finally {
      setCheckoutLoading(false);
    }
  };

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

  // Open order history sheet
  const openOrders = async () => {
    setOrdersOpen(true);
    setExpandedOrderId(null);
    setCancelConfirmId(null);
    await fetchOrders();
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
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-kid-yellow/30 shadow-sm">
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

              {/* Orders history - desktop only (mobile: inside ☰ menu) */}
              <Sheet open={ordersOpen} onOpenChange={setOrdersOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:inline-flex rounded-2xl hover:bg-kid-green/20 h-9 w-9 sm:h-10 sm:w-10"
                    onClick={openOrders}
                  >
                    <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/60" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md bg-white p-0 flex flex-col">
                  <SheetTitle className="sr-only">Meus Pedidos</SheetTitle>
                  <div className="bg-gradient-to-r from-kid-green to-kid-teal p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ClipboardList className="h-6 w-6" />
                        <h2 className="text-xl font-bold">Meus Pedidos</h2>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-white/20 text-white"
                        onClick={fetchOrders}
                        disabled={ordersLoading}
                      >
                        <RefreshCw className={`h-4 w-4 ${ordersLoading ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                    <p className="text-white/80 text-sm mt-1">Acompanhe seus pedidos</p>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    {ordersLoading ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 text-kid-green animate-spin mb-3" />
                        <p className="text-sm text-foreground/50">Carregando pedidos...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <span className="text-6xl mb-4">📥</span>
                        <p className="text-lg font-semibold text-foreground/60">Nenhum pedido ainda</p>
                        <p className="text-sm text-foreground/40 mt-1">Faça sua primeira compra!</p>
                        <Button
                          className="mt-4 rounded-2xl bg-kid-green hover:bg-kid-green/90 text-white font-semibold"
                          onClick={() => setOrdersOpen(false)}
                        >
                          Ver Produtos
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orders.map((order) => {
                          const sc = statusConfig[order.status] || statusConfig["em processamento"];
                          const StatusIcon = sc.icon;
                          const isExpanded = expandedOrderId === order.id;
                          const isCancelable = order.status === "em processamento";
                          return (
                            <motion.div
                              key={order.id}
                              layout
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white rounded-2xl border-2 border-kid-green/20 overflow-hidden shadow-sm"
                            >
                              {/* Order header */}
                              <button
                                className="w-full text-left p-4"
                                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-bold text-sm text-kid-green">{order.orderNumber}</span>
                                  <ChevronDown className={`h-4 w-4 text-foreground/40 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-foreground/50">{formatDate(order.createdAt)}</span>
                                  <Badge className={`${sc.bgColor} ${sc.color} border text-[10px] font-bold rounded-full px-2 py-0.5`}>
                                    <StatusIcon className="h-2.5 w-2.5 mr-1" />
                                    {sc.label}
                                  </Badge>
                                </div>
                                <p className="text-lg font-black text-kid-orange mt-1">R$ {order.total.toFixed(2)}</p>
                              </button>

                              {/* Expanded details */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-4 pb-4 border-t border-kid-green/10 pt-3">
                                      <p className="text-xs font-semibold text-foreground/50 mb-2">Itens do pedido (Digital PDF):</p>
                                      <div className="space-y-2">
                                        {order.items.map((item) => (
                                          <div key={item.id} className="flex items-center gap-2 bg-kid-green/5 rounded-xl p-2">
                                            <span className="text-xl">{item.emoji}</span>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs font-semibold truncate">{item.name}</p>
                                              <div className="flex items-center gap-1 mt-0.5">
                                                <FileText className="h-2.5 w-2.5 text-kid-blue" />
                                                <p className="text-[10px] text-kid-blue font-medium">PDF Digital</p>
                                                <p className="text-[10px] text-foreground/30">• Qtd: {item.quantity}</p>
                                              </div>
                                            </div>
                                            <span className="text-xs font-bold text-kid-orange">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                          </div>
                                        ))}
                                      </div>

                                      <div className="mt-3 pt-3 border-t border-kid-green/10">
                                        <p className="text-xs text-foreground/50 mb-1">
                                          👤 {order.customer.name} — {order.customer.email}
                                        </p>
                                      </div>

                                      {/* Status update buttons */}
                                      <div className="mt-3 flex flex-wrap gap-2">
                                        {order.status !== "entregue" && order.status !== "cancelado" && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-[10px] rounded-xl border-kid-blue/30 text-kid-blue hover:bg-kid-blue/10"
                                            onClick={() => updateOrderStatus(order.id, "enviado")}
                                          >
                                            <Download className="h-3 w-3 mr-1" /> Liberar Download
                                          </Button>
                                        )}
                                        {order.status === "enviado" && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-[10px] rounded-xl border-kid-green/30 text-kid-green hover:bg-kid-green/10"
                                            onClick={() => updateOrderStatus(order.id, "entregue")}
                                          >
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Marcar Concluído
                                          </Button>
                                        )}
                                        {isCancelable && (
                                          <>
                                            {cancelConfirmId === order.id ? (
                                              <div className="flex gap-1">
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  className="text-[10px] rounded-xl border-kid-red/30 text-kid-red hover:bg-kid-red/10"
                                                  onClick={() => cancelOrder(order.id)}
                                                >
                                                  Confirmar
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  className="text-[10px] rounded-xl"
                                                  onClick={() => setCancelConfirmId(null)}
                                                >
                                                  Voltar
                                                </Button>
                                              </div>
                                            ) : (
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-[10px] rounded-xl border-kid-red/30 text-kid-red hover:bg-kid-red/10"
                                                onClick={() => setCancelConfirmId(order.id)}
                                              >
                                                <Trash2 className="h-3 w-3 mr-1" /> Cancelar Pedido
                                              </Button>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

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
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
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
                        className="w-full mt-2 rounded-2xl bg-transparent text-[#1a1a2e]/50 hover:text-[#1a1a2e] hover:bg-[#FFD43B]/10"
                        onClick={() => setCartOpen(false)}
                      >
                        Continuar Comprando
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
                <SheetContent className="w-[85vw] sm:max-w-sm bg-white p-0 flex flex-col">
                  <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                  <div className="bg-gradient-to-r from-kid-blue to-kid-purple p-5 sm:p-6 text-white">
                    <span className="text-3xl sm:text-4xl">🎒</span>
                    <h2 className="text-lg sm:text-xl font-bold mt-2">Mundo Aprender</h2>
                    <p className="text-white/70 text-xs sm:text-sm">Brincar &bull; Criar &bull; Aprender ✨</p>
                  </div>

                  {/* Mobile search */}
                  <div className="px-4 pt-4 shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                      <Input
                        placeholder="Buscar produtos..."
                        className="pl-9 pr-9 rounded-2xl border-2 border-kid-yellow/40 focus:border-kid-orange bg-kid-yellow/5 text-sm"
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
                          setTimeout(() => openOrders(), 250);
                        }}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-kid-green/5 hover:bg-kid-green/10 border border-kid-green/10 transition-all"
                      >
                        <ClipboardList className="h-5 w-5 text-foreground/40" />
                        <span className="text-[11px] font-semibold text-foreground/60">Pedidos</span>
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
                      <Download className="h-3.5 w-3.5" />
                      <span>Downloads imediatos em PDF</span>
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                    <Input
                      placeholder="Buscar produtos, matérias..."
                      className="pl-11 rounded-2xl border-2 border-kid-yellow/40 focus:border-kid-orange bg-kid-yellow/5"
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
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl"
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    >
                      <X className="h-4 w-4" />
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

        {/* Decorative shapes */}
        <div className="absolute top-10 right-10 w-20 h-20 md:w-32 md:h-32 bg-white/10 rounded-full blur-sm" />
        <div className="absolute bottom-10 left-10 w-24 h-24 md:w-40 md:h-40 bg-white/10 rounded-full blur-sm" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/5 rounded-2xl rotate-45 blur-sm" />

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
                crianças do 1º ao 9º ano. Download imediato! 📥
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
                <div className="flex items-center gap-1 sm:gap-1.5 bg-white/20 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-white text-xs sm:text-sm backdrop-blur-sm">
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Download Imediato
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 bg-white/20 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-white text-xs sm:text-sm backdrop-blur-sm">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Compra Segura
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 bg-white/20 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-white text-xs sm:text-sm backdrop-blur-sm">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Material Digital PDF
                </div>
              </div>
            </motion.div>

            {/* Illustration area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 mx-auto lg:mx-0">
                {/* Main circle */}
                <div className="absolute inset-0 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <span className="text-5xl sm:text-7xl md:text-9xl block animate-bounce-gentle">🎓</span>
                    <p className="text-white font-bold text-sm sm:text-lg md:text-xl mt-2 sm:mt-4 drop-shadow-md">
                      Aprender é Divertido!
                    </p>
                  </div>
                </div>

                {/* Orbiting emojis */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl md:text-5xl animate-float">📚</div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-3xl md:text-5xl animate-float-delay-2">🔬</div>
                <div className="absolute top-1/2 -left-4 -translate-y-1/2 text-3xl md:text-5xl animate-float-delay-1">🎨</div>
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 text-3xl md:text-5xl animate-float-slow">🔢</div>

                {/* Small decorative dots */}
                <div className="absolute top-8 right-8 w-4 h-4 bg-kid-yellow rounded-full animate-sparkle" />
                <div className="absolute bottom-12 left-12 w-3 h-3 bg-kid-pink rounded-full animate-sparkle" style={{ animationDelay: "0.5s" }} />
                <div className="absolute top-1/3 right-4 w-3 h-3 bg-kid-green rounded-full animate-sparkle" style={{ animationDelay: "1s" }} />
              </div>
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
      <section id="categorias" className="py-16 md:py-24 bg-background">
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

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`relative group flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 ${
                  activeCategory === cat.id
                    ? `${cat.color} border-transparent shadow-lg ${cat.shadow} ring-2 ring-white ring-offset-2`
                    : `bg-white ${cat.hoverBorder} hover:shadow-lg`
                }`}
              >
                <span className="text-3xl sm:text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
                  {cat.emoji}
                </span>
                <span className="font-bold text-xs sm:text-sm md:text-base text-center leading-tight">{cat.name}</span>
                <span className="text-[10px] sm:text-xs text-foreground/40 font-medium">{cat.itemCount} itens</span>
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

          {activeCategory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 text-center"
            >
              <p className="text-foreground/60">
                Mostrando produtos de{" "}
                <span className="font-bold text-kid-orange capitalize">
                  {categories.find((c) => c.id === activeCategory)?.name}
                </span>
              </p>
            </motion.div>
          )}
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
          ) : activeCategory ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <Badge className="mb-3 px-4 py-1 rounded-full bg-kid-purple/10 text-kid-purple font-semibold text-sm border-kid-purple/20">
                📂 Categoria Selecionada
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
                {categories.find((c) => c.id === activeCategory)?.emoji}{" "}
                {categories.find((c) => c.id === activeCategory)?.name}
              </h2>
              <p className="mt-3 text-foreground/60 max-w-lg mx-auto">
                {filteredProducts.length} produto{filteredProducts.length === 1 ? "" : "s"} nesta categoria
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className={`card-hover group relative bg-white rounded-3xl border-2 border-transparent ${product.borderHover} overflow-hidden shadow-md hover:shadow-xl`}
                >
                  {/* Discount badge */}
                  {product.tag && (
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className={`${product.tagColor} text-white font-bold text-xs rounded-xl px-2.5 py-1 shadow-md`}>
                        {product.tag}
                      </Badge>
                    </div>
                  )}

                  {/* Favorite button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-xl backdrop-blur-sm hover:scale-110 transition-all ${
                      favorites.has(product.id)
                        ? "bg-kid-pink/15 hover:bg-kid-pink/25"
                        : "bg-white/80 hover:bg-kid-pink/20"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    <motion.div
                      animate={justFavorited === product.id ? { scale: [1, 1.4, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart className={`h-4 w-4 transition-colors ${
                        favorites.has(product.id)
                          ? "text-kid-pink"
                          : "text-foreground/30 hover:text-kid-pink"
                      }`} fill={favorites.has(product.id) ? "currentColor" : "none"} />
                    </motion.div>
                  </Button>

                  {/* Product image placeholder */}
                  <div className={`relative ${product.bgColor} p-6 md:p-8 flex items-center justify-center aspect-square`}>
                    <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300">
                      {product.emoji}
                    </span>
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-current" />
                      <div className="absolute bottom-4 left-3 w-6 h-6 rounded-lg bg-current rotate-12" />
                      <div className="absolute top-1/2 left-1/2 w-20 h-20 rounded-full bg-current" />
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="p-4 md:p-5">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`h-3.5 w-3.5 ${
                            j < product.rating ? "fill-kid-yellow text-kid-yellow" : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-foreground/40 ml-1">({product.reviews})</span>
                    </div>

                    <h3 className="font-bold text-sm md:text-base text-foreground leading-snug line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-foreground/50 line-clamp-2 mb-3">{product.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-kid-orange">R$ {product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-foreground/30 line-through">
                            R$ {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <motion.div whileTap={{ scale: 0.95 }} className="mt-3">
                      <Button
                        className={`w-full rounded-2xl font-bold text-sm py-5 transition-all duration-300 ${
                          justAdded === product.id
                            ? "bg-kid-green text-white"
                            : "bg-kid-orange hover:bg-kid-orange/90 text-white shadow-kid-orange hover:shadow-lg"
                        }`}
                        onClick={() => addToCart(product)}
                      >
                        {justAdded === product.id ? (
                          <span className="flex items-center justify-center gap-1">
                            Adicionado! ✅
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1">
                            <ShoppingCart className="h-4 w-4" />
                            Adicionar ao Carrinho
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="text-lg font-semibold text-foreground/60">Nenhum produto encontrado</p>
              <p className="text-sm text-foreground/40 mt-1">Tente buscar por outro termo</p>
              <Button
                className="mt-4 rounded-2xl bg-kid-blue text-white font-semibold"
                onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
              >
                Ver Todos os Produtos
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-3 px-4 py-1 rounded-full bg-kid-pink/10 text-kid-pink font-semibold text-sm border-kid-pink/20">
              💖 Feedback dos Nossos Clientes
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
              O que dizem os professores e pais <span className="text-kid-pink">😊</span>
            </h2>
            <p className="mt-3 text-foreground/60 max-w-lg mx-auto">
              Mais de 10.000 famílias satisfeitas em todo o Brasil
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`relative ${t.bgColor} border-2 ${t.borderColor} rounded-3xl p-6 md:p-8`}
              >
                {/* Quote mark */}
                <span className="absolute -top-3 left-6 text-4xl">💬</span>

                <div className="flex items-center gap-1 mb-4 mt-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-kid-yellow text-kid-yellow" />
                  ))}
                </div>

                <p className="text-foreground/70 leading-relaxed text-sm md:text-base italic mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                    {t.emoji}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-foreground/50">{t.role}</p>
                  </div>
                </div>
              </motion.div>
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
                <div className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-kid-blue/10 rounded-xl flex items-center justify-center shrink-0">
                    <Download className="h-5 w-5 text-kid-blue" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Download Imediato</p>
                    <p className="text-xs text-foreground/50">Receba seus PDFs no instante</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-kid-green/10 rounded-xl flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-kid-green" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Acesso por 24h</p>
                    <p className="text-xs text-foreground/50">Link de download com validade</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-kid-pink/10 rounded-xl flex items-center justify-center shrink-0">
                    <Heart className="h-5 w-5 text-kid-pink" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Feito com Carinho</p>
                    <p className="text-xs text-foreground/50">Aprovado por educadores</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white rounded-2xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-kid-purple/10 rounded-xl flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 text-kid-purple" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">3 Downloads</p>
                    <p className="text-xs text-foreground/50">Baixe até 3 vezes cada PDF</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 md:gap-6"
            >
              {[
                { emoji: "📄", value: "500+", label: "Materiais em PDF", color: "bg-kid-blue/10", border: "border-kid-blue/20" },
                { emoji: "👨‍👩‍👧‍👦", value: "10.000+", label: "Clientes Felizes", color: "bg-kid-pink/10", border: "border-kid-pink/20" },
                { emoji: "⭐", value: "4.9/5", label: "Avaliação Média", color: "bg-kid-yellow/10", border: "border-kid-yellow/20" },
                { emoji: "🏫", value: "2.500+", label: "Escolas Parceiras", color: "bg-kid-green/10", border: "border-kid-green/20" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className={`${stat.color} border-2 ${stat.border} rounded-3xl p-5 md:p-6 text-center`}
                >
                  <span className="text-3xl md:text-4xl block mb-2">{stat.emoji}</span>
                  <p className="text-2xl md:text-3xl font-black text-foreground">{stat.value}</p>
                  <p className="text-xs md:text-sm text-foreground/50 font-medium mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ NEWSLETTER ═══════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative gradient-newsletter rounded-2xl sm:rounded-3xl md:rounded-[2rem] overflow-hidden p-6 sm:p-8 md:p-12 lg:p-16 text-center"
          >
            {/* Decorative elements */}
            <div className="absolute top-6 left-8 text-4xl animate-float opacity-30">📧</div>
            <div className="absolute bottom-6 right-8 text-4xl animate-float-delay-2 opacity-30">🎁</div>
            <div className="absolute top-1/2 left-4 text-3xl animate-float-delay-1 opacity-20">📬</div>

            <div className="relative max-w-lg mx-auto">
              <span className="text-4xl sm:text-5xl md:text-6xl block mb-3 sm:mb-4">📬</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
                Receba nossas novidades!
              </h2>
              <p className="mt-3 text-foreground/70 text-base sm:text-lg">
                Promoções exclusivas, dicas de ensino e novos produtos diretamente no seu e-mail. 🎉
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail..."
                  className="flex-1 rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-sm text-foreground placeholder:text-foreground/40 h-12 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                />
                <Button
                  className="rounded-2xl bg-kid-orange hover:bg-kid-orange/90 text-white font-bold px-8 h-12 shadow-kid-orange hover:shadow-lg transition-all"
                  onClick={handleSubscribe}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Inscrever-se
                </Button>
              </div>

              <AnimatePresence>
                {subscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-md"
                  >
                    <span className="text-lg">🎉</span>
                    <span className="text-sm font-semibold text-foreground">
                      Inscrito com sucesso! Obrigado!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-4 text-xs text-foreground/40">
                🔒 Não enviamos spam. Você pode cancelar a qualquer momento.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer id="contato" className="relative bg-foreground text-white/80">
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
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-kid-orange/50 transition-colors duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
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
                        document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-sm text-white/50 hover:text-kid-yellow transition-colors flex items-center gap-1.5"
                    >
                      <span>{cat.emoji}</span> {cat.name}
                    </button>
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
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-kid-orange mt-0.5 shrink-0" />
                  <span className="text-sm text-white/50">
                    Rua da Aprendizagem, 123
                    <br />
                    São Paulo - SP, 01234-567
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-kid-green shrink-0" />
                  <span className="text-sm text-white/50">(11) 98765-4321</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-kid-blue shrink-0" />
                  <span className="text-sm text-white/50">contato@mundoaprender.com.br</span>
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
            <div className="flex items-center gap-4 text-xs text-white/30">
              <span>💳 Visa</span>
              <span>💳 Mastercard</span>
              <span>💳 Pix</span>
              <span>💳 Boleto</span>
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
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6" />
                <h2 className="text-xl font-bold">Finalizar Compra</h2>
              </div>
              {checkoutStep > 1 && checkoutStep < 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-white/80 hover:text-white hover:bg-white/20"
                  onClick={() => setCheckoutStep(checkoutStep === 2 ? 1 : 2)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
                </Button>
              )}
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
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <span className="text-4xl">📄</span>
                  <h3 className="text-lg font-bold mt-2">Dados para Recebimento</h3>
                  <p className="text-sm text-foreground/50">Os PDFs serão enviados para seu e-mail</p>
                </div>

                <div className="bg-kid-blue/10 rounded-2xl p-4 border border-kid-blue/20 flex items-center gap-3">
                  <FileText className="h-5 w-5 text-kid-blue shrink-0" />
                  <p className="text-sm text-foreground/70">Produto digital em PDF — download imediato após a confirmação do pagamento!</p>
                </div>

                <div className="space-y-3">
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
                    <p className="text-xs text-foreground/40 mt-1">O link de download será enviado para este e-mail</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-foreground/70 mb-1 block">Telefone</Label>
                    <Input
                      placeholder="(11) 99999-9999"
                      className="rounded-2xl border-2 border-kid-orange/20 focus:border-kid-orange"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: formatPhone(e.target.value) })}
                    />
                  </div>
                </div>

                <Button
                  className="w-full rounded-2xl bg-gradient-to-r from-kid-orange to-kid-pink text-white font-bold text-lg py-6 shadow-kid-orange mt-6"
                  onClick={() => setCheckoutStep(2)}
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
                  <p className="text-white/70 text-xs mt-1">Download imediato após pagamento 📥</p>
                </div>

                <Button
                  className="w-full rounded-2xl bg-kid-green hover:bg-kid-green/90 text-white font-bold text-lg py-6 shadow-kid-green"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processando...
                    </span>
                  ) : (
                    "Confirmar Compra 🎉"
                  )}
                </Button>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {checkoutStep === 3 && completedOrder && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  <span className="text-7xl block mb-4">🎉</span>
                </motion.div>
                <h3 className="text-2xl font-black text-foreground">Pedido Confirmado!</h3>
                <p className="text-foreground/60 mt-2">
                  Seu pedido foi realizado com sucesso!
                </p>

                <div className="mt-6 bg-kid-green/10 rounded-2xl p-6 border-2 border-kid-green/20 inline-block">
                  <p className="text-xs text-foreground/50 mb-1">Número do Pedido</p>
                  <p className="text-3xl font-black text-kid-green">{completedOrder.orderNumber}</p>
                </div>

                <div className="mt-6 text-left bg-kid-yellow/5 rounded-2xl p-4 border border-kid-yellow/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="h-4 w-4 text-kid-blue" />
                    <p className="text-sm font-semibold">Download Imediato</p>
                  </div>
                  <p className="text-xs text-foreground/60">
                    Seus PDFs estarão disponíveis para download imediato. Acesse a seção "Meus Pedidos" para baixar cada material. Link válido por 24h com até 3 downloads por produto.
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    className="w-full rounded-2xl bg-kid-green hover:bg-kid-green/90 text-white font-bold py-6"
                    onClick={() => {
                      setCheckoutOpen(false);
                      setTimeout(() => openOrders(), 300);
                    }}
                  >
                    <ClipboardList className="h-5 w-5 mr-2" />
                    Ver Meus Pedidos
                  </Button>
                  <Button
                    className="w-full rounded-2xl bg-transparent text-foreground/50 hover:text-foreground hover:bg-kid-yellow/10"
                    onClick={() => setCheckoutOpen(false)}
                  >
                    Continuar Comprando
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
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-kid-orange text-white rounded-2xl shadow-kid-orange flex items-center justify-center hover:bg-kid-orange/90 transition-colors"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
