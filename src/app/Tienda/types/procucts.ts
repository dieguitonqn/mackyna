
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  productImages: { url: string }[];
  isActive: boolean;
  stock: number;
  slug: string;
  cost: number | null;
  costo_flete: number | null;
  precio_minimo: number | null;
  precio_tarjeta1cuota: number | null;
  precio_tarjeta3cuotas: number | null;
  precio_tarjeta6cuotas: number | null;
}