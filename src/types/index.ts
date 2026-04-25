export interface Product {
  id: number;
  name: string;
  emoji: string;
  price: number;
  link: string;
  description?: string;
  category?: string;
}

export type OrderStatus = 'pendente' | 'em processamento' | 'enviado' | 'entregue' | 'cancelado';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: OrderStatus;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  emailSent?: boolean;
}
