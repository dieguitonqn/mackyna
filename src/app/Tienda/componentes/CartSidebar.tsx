"use client";
import React, { useState } from "react";
import { useCart } from "../lib/useCart";
import Image from "next/image";
import { BsCart4, BsBox, BsTrash } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { FaShoppingBag } from "react-icons/fa";
import { CartItem } from "../types/cartContext";

export default function CartSidebar() {
  const { cart, removeFromCart, changeQuantity, clearCart } = useCart();
  const [open, setOpen] = useState(false);

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleBuy = (cart: CartItem[]) => {
    // Número de WhatsApp (sin espacios ni caracteres especiales)
    const phoneNumber = "2994630512";

    // Crear el mensaje con el detalle del carrito
    let message = "🛒 *Nuevo Pedido de Mackyna*\n\n";
    message += "*Detalle del pedido:*\n";
    cart.forEach((item) => {
      message += `▫️ ${item.quantity}x ${item.product.name} - $${(
        item.product.price * item.quantity
      ).toLocaleString("es-AR")}\n`;
    });
    message += "\n💰 *Total:* $" + total.toLocaleString("es-AR");
    message += "\n\n¡Gracias por tu compra! 🏋️‍♂️";

    // Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);

    // Abrir WhatsApp en una nueva pestaña
    window.open(
      `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}&type=phone_number&app_absent=1`,
      "_blank"
    );

    // Opcional: cerrar el carrito y/o limpiarlo
    setOpen(false);
    // clearCart(); // Descomenta si quieres limpiar el carrito después de enviar
  };

  return (
    <>
      {/* Botón flotante para abrir el carrito */}
      <button
        onClick={() => setOpen(true)}
        className="fixed z-40 top-32 right-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl border-4 border-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        aria-label="Abrir carrito"
      >
        <BsCart4 className="w-7 h-7" />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-emerald-400 text-black text-xs font-bold rounded-full px-2 py-0.5 border border-emerald-900">
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Sidebar del carrito */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="w-full max-w-md h-full bg-gray-900 shadow-2xl p-6 flex flex-col relative animate-slideInRight">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-200 hover:text-emerald-400 text-2xl bg-red-600 rounded-full p-1"
              aria-label="Cerrar carrito"
            >
              <IoClose className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">
              Carrito de compras
            </h2>
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center">
                El carrito está vacío.
              </p>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {cart.map((item, idx) => (
                  <div
                    key={item.product.id + "-" + idx}
                    className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4"
                  >
                    {item.product.productImages?.[0]?.url ? (
                      <Image
                        src={item.product.productImages[0].url}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain rounded border border-gray-700 bg-gray-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/mackyna.png";
                        }}
                      />
                    ) : (
                      <div className="icon-placeholder flex items-center justify-center w-16 h-16 rounded border border-gray-700 bg-gray-800">
                        <BsBox className="w-10 h-10 text-emerald-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-emerald-300">
                        {item.product.name}
                      </h3>
                      <div className="text-gray-300">
                        ${item.product.price.toLocaleString("es-AR")}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            changeQuantity(item.product.slug, item.quantity - 1)
                          }
                          className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-emerald-600"
                        >
                          -
                        </button>
                        <span className="px-2 text-lg text-slate-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            changeQuantity(item.product.slug, item.quantity + 1)
                          }
                          className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-emerald-600"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.slug)}
                        className="text-red-500 hover:text-red-700 text-xs mt-1"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center text-lg text-gray-200 mb-4">
                <span>Total:</span>
                <span className="font-bold text-emerald-400 text-2xl">
                  ${total.toLocaleString("es-AR")}
                </span>
              </div>
              <button
                onClick={clearCart}
                className={`w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold shadow transition-colors text-lg mb-4 ${
                  cart.length === 0 ? "hidden" : "block"
                } flex items-center justify-center gap-2`}
                disabled={cart.length === 0}
              >
                <BsTrash className="w-5 h-5" />
                Vaciar carrito
              </button>
              <button
                className={`w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold shadow transition-colors text-lg disabled:opacity-60 ${
                  cart.length === 0 ? "hidden" : "block"
                } flex items-center justify-center gap-2`}
                disabled={cart.length === 0}
                onClick={() => handleBuy(cart)}
              >
                <FaShoppingBag className="w-5 h-5" />
                Finalizar compra
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
