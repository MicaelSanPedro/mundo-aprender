import { Product } from "@/types";

export const PRODUCTS: Record<number, Product> = {
  1: {
    id: 1,
    name: "O Código Secreto do Mundo",
    emoji: "🔢",
    price: 4.99,
    link: "https://docs.google.com/document/d/1AW-YdqoprQcQzkLzMWE2G_PNwb5kEspQoQMAz4lXHe8/edit?usp=drivesdk",
    description: "Material didático sobre lógica e códigos para crianças.",
    category: "Lógica"
  },
  2: {
    id: 2,
    name: "Pack de Atividades - 3º Ano (10 atividades)",
    emoji: "📚",
    price: 4.95,
    link: "https://www.mediafire.com/folder/x8dcszq4f7egl/MUNDO-APRENDER-10",
    description: "Conjunto de 10 atividades focadas no currículo do 3º ano.",
    category: "Atividades"
  },
};

export const PRODUCT_LIST = Object.values(PRODUCTS);
