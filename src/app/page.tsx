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
  Copy,
  Check,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────── */

const categories = [
  { id: "matematica", emoji: "🔢", name: "Matemática", color: "bg-kid-blue", shadow: "shadow-kid-blue", hoverBorder: "hover:border-kid-blue" },
  { id: "portugues", emoji: "📝", name: "Português", color: "bg-kid-pink", shadow: "shadow-kid-pink", hoverBorder: "hover:border-kid-pink" },
  { id: "ciencias", emoji: "🔬", name: "Ciências", color: "bg-kid-green", shadow: "shadow-kid-green", hoverBorder: "hover:border-kid-green" },
  { id: "historia", emoji: "📜", name: "História", color: "bg-kid-orange", shadow: "shadow-kid-orange", hoverBorder: "hover:border-kid-orange" },
  { id: "geografia", emoji: "🌍", name: "Geografia", color: "bg-kid-purple", shadow: "shadow-kid-purple", hoverBorder: "hover:border-kid-purple" },
  { id: "artes", emoji: "🎨", name: "Artes", color: "bg-kid-yellow", shadow: "shadow-kid-yellow", hoverBorder: "hover:border-kid-yellow" },
];

const products: { id: number; name: string; description: string; price: number; originalPrice: number | null; rating: number; reviews: number; emoji: string; bgColor: string; borderHover: string; category: string; tag: string | null; tagColor: string; image?: string; link?: string }[] = [
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
    category: "Matemática",
    tag: "Novo!",
    tagColor: "bg-kid-green/90 text-white",
    image: "/product-2.png",
    link: "https://docs.google.com/document/d/1AW-YdqoprQcQzkLzMWE2G_PNwb5kEspQoQMAz4lXHe8/edit?usp=drivesdk",
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
        <span className="text-xl sm:text-2xl shrink-0">{emoji}</span>
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

  // Payment callback state (Checkout Pro redirect)
  const [paymentResult, setPaymentResult] = useState<{ status: string; orderId: string; paymentId: string } | null>(null);
  const [paymentResultOrder, setPaymentResultOrder] = useState<Order | null>(null);
  const [paymentResultLoading, setPaymentResultLoading] = useState(false);

  // Order history state
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [expandedDescId, setExpandedDescId] = useState<number | null>(null);

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
    setPaymentResult(null);
    setPaymentResultOrder(null);
    setCartOpen(false);
    setTimeout(() => setCheckoutOpen(true), 200);
  };

  // Submit order — creates Mercado Pago Checkout Pro Preference
  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          customer,
          total: totalPrice,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Erro ao criar pagamento");
      }
      const data = await res.json();
      // Redirect to Mercado Pago checkout
      window.location.href = data.initPoint;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao processar pedido. Tente novamente.");
      setCheckoutLoading(false);
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
                                        {order.items.map((item) => {
                                          const prod = products.find((p) => p.id === item.id);
                                          return (
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
                                              {(order.status === "enviado" || order.status === "entregue") && prod?.link && (
                                                <a
                                                  href={prod.link}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="flex-shrink-0 w-7 h-7 rounded-lg bg-kid-blue/10 hover:bg-kid-blue/20 flex items-center justify-center transition-colors"
                                                  title="Baixar PDF"
                                                >
                                                  <Download className="h-3.5 w-3.5 text-kid-blue" />
                                                </a>
                                              )}
                                            </div>
                                          );
                                        })}
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
                <div className="flex items-center gap-1 sm:gap-1.5 glass rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-white text-xs sm:text-sm">
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Download Imediato
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 glass rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-white text-xs sm:text-sm">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Compra Segura
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 glass rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-white text-xs sm:text-sm">
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
                {/* Decorative background blobs */}
                <div className="absolute top-4 left-0 w-20 h-20 bg-kid-yellow/20 blob-1 blur-xl" />
                <div className="absolute bottom-4 right-0 w-24 h-24 bg-kid-pink/20 blob-2 blur-xl" />

                {/* Animated gradient ring */}
                <div className="absolute inset-[-6px] sm:inset-[-10px] md:inset-[-14px] rounded-full bg-gradient-to-r from-kid-yellow via-kid-pink via-kid-purple to-kid-blue opacity-40 blur-sm" style={{ animation: 'gradient-shift 6s ease infinite', backgroundSize: '300% 300%' }} />
                <div className="absolute inset-[-3px] sm:inset-[-5px] md:inset-[-7px] rounded-full bg-gradient-to-r from-kid-yellow via-kid-pink to-kid-purple opacity-60" style={{ animation: 'gradient-shift 8s ease infinite', backgroundSize: '300% 300%' }} />

                {/* Main circle */}
                <div className="absolute inset-0 glass rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <span className="text-5xl sm:text-7xl md:text-9xl block animate-bounce-gentle">🎓</span>
                    <p className="text-white font-bold text-sm sm:text-lg md:text-xl mt-2 sm:mt-4 drop-shadow-md">
                      Aprender é Divertido!
                    </p>
                  </div>
                </div>

                {/* Orbiting emojis - CSS orbit animations */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-orbit text-2xl sm:text-3xl md:text-4xl" style={{ animationDelay: '0s' }}>📚</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-orbit text-2xl sm:text-3xl md:text-4xl" style={{ animationDelay: '-5s' }}>🔬</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-orbit-sm text-xl sm:text-2xl md:text-3xl" style={{ animationDelay: '-3s' }}>🎨</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-orbit-sm text-xl sm:text-2xl md:text-3xl" style={{ animationDelay: '-8s' }}>🔢</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-orbit text-xl sm:text-2xl md:text-3xl" style={{ animationDelay: '-10s' }}>✏️</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-orbit-sm text-lg sm:text-xl md:text-2xl" style={{ animationDelay: '-12s' }}>📝</div>
                </div>

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

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`relative group flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 ${
                  activeCategory === cat.id
                    ? `${cat.color} border-transparent shadow-lg ${cat.shadow} ring-2 ring-white ring-offset-2`
                    : `bg-white ${cat.hoverBorder} hover:shadow-lg`
                }`}
              >
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="category-glow"
                    className={`absolute inset-0 rounded-2xl sm:rounded-3xl ${cat.shadow} opacity-50 blur-md`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="text-3xl sm:text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
                  {cat.emoji}
                </span>
                <span className="font-bold text-xs sm:text-sm md:text-base text-center leading-tight">{cat.name}</span>
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

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className={`card-hover group relative bg-white rounded-2xl sm:rounded-3xl border-2 border-transparent ${product.borderHover} overflow-hidden shadow-md hover:shadow-xl`}
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

                  {/* Product image */}
                  <div className={`relative ${product.bgColor} p-3 sm:p-6 md:p-8 flex items-center justify-center aspect-square overflow-hidden`}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      />
                    ) : (
                      <span className="text-3xl sm:text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300">
                        {product.emoji}
                      </span>
                    )}
                    {!product.image && (
                      <>
                        {/* Decorative background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-current" />
                          <div className="absolute bottom-4 left-3 w-6 h-6 rounded-lg bg-current rotate-12" />
                          <div className="absolute top-1/2 left-1/2 w-20 h-20 rounded-full bg-current" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="p-2.5 sm:p-4 md:p-5">
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

                    <h3 className="font-bold text-xs sm:text-sm md:text-base text-foreground leading-snug line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p
                      className={`text-[10px] sm:text-xs text-foreground/50 mb-2 sm:mb-3 transition-all duration-200 ${
                        expandedDescId === product.id ? "" : "line-clamp-2"
                      }`}
                    >
                      {product.description}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedDescId(expandedDescId === product.id ? null : product.id);
                      }}
                      className="text-[10px] sm:text-xs text-kid-blue font-semibold hover:text-kid-blue/70 hover:underline -mt-1.5 mb-1.5 block transition-colors"
                    >
                      {expandedDescId === product.id ? "Ver menos ▲" : "Ver mais ▼"}
                    </button>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-xl font-black text-kid-orange">R$ {product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] sm:text-xs text-foreground/30 line-through">
                            R$ {product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <motion.div whileTap={{ scale: 0.95 }} className="mt-2 sm:mt-3">
                      <Button
                        className={`w-full rounded-xl sm:rounded-2xl font-bold text-[11px] sm:text-sm py-3 sm:py-5 transition-all duration-300 ${
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
                            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Adicionar
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
                onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
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
                title: "Receba e Imprima",
                description: "O download do PDF é liberado na hora! Imprima quantas vezes quiser e comece a usar.",
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
                transition={{ delay: i * 0.15, duration: 0.4 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`relative text-center ${item.bgColor} border-2 ${item.borderColor} rounded-3xl p-6 md:p-8`}
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
                q: "Como recebo o PDF após a compra?",
                a: "Após a confirmação do pagamento, o download é liberado automaticamente. Você recebe o link por e-mail e também pode acessar pela área 'Meus Pedidos'. O link é válido por 24 horas.",
                emoji: "📥",
              },
              {
                q: "Posso imprimir quantas vezes quiser?",
                a: "Sim! Após o download, o PDF é seu. Você pode imprimir quantas cópias precisar para uso pessoal ou em sala de aula. Recomendamos impressão em papel sulfite 75g ou superior.",
                emoji: "🖨️",
              },
              {
                q: "Os materiais são para qual faixa etária?",
                a: "Nossos materiais cobrem do 1º ao 9º ano do Ensino Fundamental. Cada produto tem a indicação de série/ano na descrição, facilitando a escolha do material adequado.",
                emoji: "👨‍🎓",
              },
              {
                q: "Qual a forma de pagamento?",
                a: "Aceitamos Pix (aprovação instantânea), cartão de crédito (em até 12x), e boleto bancário. Para Pix e cartão, o download é liberado em minutos!",
                emoji: "💳",
              },
              {
                q: "Posso solicitar reembolso?",
                a: "Sim! Oferecemos garantia de 7 dias. Se o material não atender suas expectativas, entre em contato pelo e-mail contato@mundoaprender.com.br e devolvemos 100% do valor.",
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
                  { icon: Download, color: "kid-blue", title: "Download Imediato", desc: "Receba seus PDFs no instante" },
                  { icon: Shield, color: "kid-green", title: "Acesso por 24h", desc: "Link de download com validade" },
                  { icon: Heart, color: "kid-pink", title: "Feito com Carinho", desc: "Aprovado por educadores" },
                  { icon: Award, color: "kid-purple", title: "3 Downloads", desc: "Baixe até 3 vezes cada PDF" },
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
                  <span className="text-3xl md:text-4xl block mb-2">{stat.emoji}</span>
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
            <div className="absolute top-8 right-1/4 text-3xl animate-float-delay-3 opacity-20">🧸</div>
            <div className="absolute bottom-12 left-1/4 text-3xl animate-float-slow opacity-20">🎈</div>
            <div className="absolute top-1/3 right-8 text-2xl animate-float opacity-15">🌟</div>
            <div className="absolute bottom-1/3 left-8 text-2xl animate-float-delay-2 opacity-15">🎨</div>

            <div className="relative max-w-lg mx-auto">
              <span className="text-4xl sm:text-5xl md:text-6xl block mb-3 sm:mb-4">📬</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground">
                Receba nossas novidades!
              </h2>
              <p className="mt-3 text-foreground/70 text-base sm:text-lg">
                Promoções exclusivas, dicas de ensino e novos produtos diretamente no seu e-mail. 🎉
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-kid-orange/10 via-kid-pink/10 to-kid-purple/10 opacity-50 blur-sm" />
                  <Input
                    type="email"
                    placeholder="Seu melhor e-mail..."
                    className="relative flex-1 w-full rounded-2xl border-2 border-white/70 bg-white/90 backdrop-blur-md text-foreground placeholder:text-foreground/40 h-14 text-base shadow-lg shadow-black/5 focus:shadow-xl focus:shadow-kid-orange/10 transition-all duration-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  />
                </div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    className="rounded-2xl bg-kid-orange hover:bg-kid-orange/90 text-white font-bold px-8 h-14 text-base shadow-kid-orange hover:shadow-lg transition-all animate-pulse-glow"
                    onClick={handleSubscribe}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Inscrever-se
                  </Button>
                </motion.div>
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
                  className="w-full rounded-2xl bg-gradient-to-r from-kid-blue to-[#0096c7] hover:from-[#0096c7] hover:to-[#0077b6] text-white font-bold text-lg py-6 shadow-[#00b4d8]/30"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Preparando pagamento...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Shield className="h-5 w-5" />
                      Ir para o Pagamento
                    </span>
                  )}
                </Button>
              </motion.div>
            )}

            {/* Step 3: Payment Result (Checkout Pro callback) */}
            {checkoutStep === 3 && (
              <>
                {/* Loading state */}
                {paymentResultLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 space-y-4"
                  >
                    <Loader2 className="h-10 w-10 text-kid-blue animate-spin" />
                    <p className="text-sm text-foreground/60">Verificando pagamento...</p>
                  </motion.div>
                )}

                {/* Success — payment approved */}
                {!paymentResultLoading && paymentResult?.status === "approved" && paymentResultOrder && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <span className="text-7xl block mb-4">🎉</span>
                    </motion.div>
                    <h3 className="text-2xl font-black text-foreground">Pagamento Confirmado!</h3>
                    <p className="text-foreground/60 mt-2">
                      Seu pedido foi realizado com sucesso!
                    </p>

                    <div className="mt-4 bg-kid-green/10 rounded-2xl p-4 border-2 border-kid-green/20 inline-block">
                      <p className="text-xs text-foreground/50 mb-1">Número do Pedido</p>
                      <p className="text-2xl font-black text-kid-green">{paymentResultOrder.orderNumber}</p>
                    </div>

                    <div className="mt-4 text-left bg-kid-green/5 rounded-2xl p-4 border-2 border-kid-green/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Download className="h-5 w-5 text-kid-green" />
                        <p className="text-sm font-bold text-kid-green">Seu material está pronto!</p>
                      </div>
                      <div className="space-y-3">
                        {paymentResultOrder.items.map((item) => {
                          const prod = products.find((p) => p.id === item.id);
                          const link = prod?.link || "";
                          return (
                            <div key={item.id} className="bg-white rounded-xl p-3 border border-kid-green/10 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{item.emoji}</span>
                                <p className="text-sm font-bold truncate flex-1">{item.name}</p>
                              </div>
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full p-3 bg-kid-green hover:bg-kid-green/90 text-white rounded-xl font-bold transition-colors text-sm"
                              >
                                <Download className="h-4 w-4" />
                                Baixar Material (PDF)
                              </a>
                              {link && (
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                      await navigator.clipboard.writeText(link);
                                      const el = document.getElementById(`copy-link-${item.id}`);
                                      if (el) el.classList.replace("opacity-0", "opacity-100");
                                      setTimeout(() => {
                                        const el2 = document.getElementById(`copy-link-${item.id}`);
                                        if (el2) el2.classList.replace("opacity-100", "opacity-0");
                                      }, 2000);
                                    } catch {
                                      const ta = document.createElement("textarea");
                                      ta.value = link;
                                      document.body.appendChild(ta);
                                      ta.select();
                                      document.execCommand("copy");
                                      document.body.removeChild(ta);
                                    }
                                  }}
                                  className="flex items-center justify-center gap-1.5 w-full mt-2 p-2 rounded-xl text-xs text-foreground/50 hover:text-kid-blue hover:bg-kid-blue/5 transition-colors"
                                >
                                  <Copy className="h-3 w-3" />
                                  Copiar link do material
                                  <Check className="h-3 w-3 text-kid-green opacity-0" id={`copy-link-${item.id}`} style={{ transition: "opacity 0.2s" }} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <Button
                        className="w-full rounded-2xl bg-kid-green hover:bg-kid-green/90 text-white font-bold py-6"
                        onClick={() => {
                          setCheckoutOpen(false);
                          setPaymentResult(null);
                          setPaymentResultOrder(null);
                          setTimeout(() => openOrders(), 300);
                        }}
                      >
                        <ClipboardList className="h-5 w-5 mr-2" />
                        Ver Meus Pedidos
                      </Button>
                      <Button
                        className="w-full rounded-2xl bg-transparent text-foreground/50 hover:text-foreground hover:bg-kid-yellow/10"
                        onClick={() => {
                          setCheckoutOpen(false);
                          setPaymentResult(null);
                          setPaymentResultOrder(null);
                        }}
                      >
                        Continuar Comprando
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Pending — payment processing */}
                {!paymentResultLoading && paymentResult?.status === "pending" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <span className="text-7xl block mb-4">⏳</span>
                    <h3 className="text-xl font-black text-foreground">Pagamento Pendente</h3>
                    <p className="text-foreground/60 mt-2">
                      Seu pagamento está sendo processado. Você receberá o material assim que for confirmado!
                    </p>
                    {paymentResultOrder && (
                      <div className="mt-4 bg-amber-50 rounded-2xl p-4 border border-amber-200 inline-block">
                        <p className="text-xs text-foreground/50 mb-1">Número do Pedido</p>
                        <p className="text-xl font-black text-amber-600">{paymentResultOrder.orderNumber}</p>
                      </div>
                    )}
                    <div className="mt-6 space-y-3">
                      <Button
                        className="w-full rounded-2xl bg-kid-blue hover:bg-kid-blue/90 text-white font-bold py-6"
                        onClick={() => {
                          setCheckoutOpen(false);
                          setPaymentResult(null);
                          setPaymentResultOrder(null);
                          setTimeout(() => openOrders(), 300);
                        }}
                      >
                        <ClipboardList className="h-5 w-5 mr-2" />
                        Ver Meus Pedidos
                      </Button>
                      <Button
                        className="w-full rounded-2xl bg-transparent text-foreground/50 hover:text-foreground hover:bg-kid-yellow/10"
                        onClick={() => {
                          setCheckoutOpen(false);
                          setPaymentResult(null);
                          setPaymentResultOrder(null);
                        }}
                      >
                        Continuar Comprando
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Rejected / Failed */}
                {!paymentResultLoading && paymentResult?.status === "rejected" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <span className="text-7xl block mb-4">😔</span>
                    <h3 className="text-xl font-black text-foreground">Pagamento Recusado</h3>
                    <p className="text-foreground/60 mt-2">
                      O pagamento não foi aprovado. Tente novamente com outro método de pagamento.
                    </p>
                    <div className="mt-6 space-y-3">
                      <Button
                        className="w-full rounded-2xl bg-kid-orange hover:bg-kid-orange/90 text-white font-bold py-6"
                        onClick={() => {
                          setCheckoutStep(2);
                          setPaymentResult(null);
                          setPaymentResultOrder(null);
                        }}
                      >
                        Tentar Novamente
                      </Button>
                      <Button
                        className="w-full rounded-2xl bg-transparent text-foreground/50 hover:text-foreground hover:bg-kid-yellow/10"
                        onClick={() => {
                          setCheckoutOpen(false);
                          setPaymentResult(null);
                          setPaymentResultOrder(null);
                        }}
                      >
                        Continuar Comprando
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Error */}
                {!paymentResultLoading && paymentResult?.status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <span className="text-7xl block mb-4">❌</span>
                    <h3 className="text-xl font-black text-foreground">Erro ao Processar</h3>
                    <p className="text-foreground/60 mt-2">
                      Ocorreu um erro ao verificar o pagamento. Tente novamente.
                    </p>
                    <div className="mt-6 space-y-3">
                      <Button
                        className="w-full rounded-2xl bg-kid-orange hover:bg-kid-orange/90 text-white font-bold py-6"
                        onClick={() => {
                          setCheckoutStep(2);
                          setPaymentResult(null);
                          setPaymentResultOrder(null);
                        }}
                      >
                        Tentar Novamente
                      </Button>
                      <Button
                        className="w-full rounded-2xl bg-transparent text-foreground/50 hover:text-foreground hover:bg-kid-yellow/10"
                        onClick={() => {
                          setCheckoutOpen(false);
                          setPaymentResult(null);
                          setPaymentResultOrder(null);
                        }}
                      >
                        Voltar à Loja
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
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
    </div>
  );
}
