import { Product } from "./procucts";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  clearCart: () => void;
  removeFromCart: (productSlug: string) => void;
  changeQuantity: (productSlug: string, quantity: number) => void;
}
