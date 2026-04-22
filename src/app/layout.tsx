import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AcceptanceModal from "@/components/acceptance-modal";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Mundo Aprender - Materiais Didáticos Divertidos",
  description:
    "Loja de materiais didáticos divertidos para o ensino fundamental. Cadernos, jogos, livros e muito mais para tornar o aprendizado incrível!",
  keywords: [
    "materiais didáticos",
    "ensino fundamental",
    "educação infantil",
    "cadernos escolares",
    "jogos educativos",
    "brasil",
  ],
  authors: [{ name: "Mundo Aprender" }],
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${nunito.variable} antialiased font-[family-name:var(--font-nunito)]`}>
        {children}
        <Toaster />
        <AcceptanceModal />
      </body>
    </html>
  );
}
