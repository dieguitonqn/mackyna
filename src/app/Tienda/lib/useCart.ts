import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export const useCart = () => {
  const cartCtx = useContext(CartContext);
  if (!cartCtx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  const { cart, addToCart, clearCart, removeFromCart, changeQuantity } = cartCtx;

  const isInCart = (productId: number) => {
    return cart.some((item) => item.product.id === productId);
  };

  return {
    cart,
    addToCart,
    clearCart,
    removeFromCart,
    changeQuantity,
    isInCart,
  };
};