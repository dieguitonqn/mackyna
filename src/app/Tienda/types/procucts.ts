
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  productImages: { url: string }[];
  isActive: boolean;
  stock: number;
  slug: string;
}