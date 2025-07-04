"use client";
import React, { createContext, useState, useEffect } from "react";
import { Product } from "../types/procucts";
import { CartContextType, CartItem } from "../types/cartContext";

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  clearCart: () => {},
  removeFromCart: () => {},
  changeQuantity: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Persistencia localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setCart(parsed);
      } catch {}
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((item) => item.product.slug === product.slug);
      if (idx !== -1) {
        const updated = [...prevCart];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productSlug: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.slug !== productSlug));
  };

  const clearCart = () => setCart([]);

  const changeQuantity = (productSlug: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.slug === productSlug ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, removeFromCart, changeQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
