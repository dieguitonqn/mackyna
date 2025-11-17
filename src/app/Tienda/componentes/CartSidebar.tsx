"use client";
import React, { useState } from "react";
import { useCart } from "../lib/useCart";
import Image from "next/image";
import { BsCart4, BsBox, BsTrash } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { FaShoppingBag } from "react-icons/fa";
import { CartItem } from "../types/cartContext";
import { useSession } from "next-auth/react";
import { saveSoldCart } from "../lib/saveSoldCart"; // Asegúrate de tener esta función implementada

export default function CartSidebar() {
  const { data: session } = useSession();
  const { cart, removeFromCart, changeQuantity, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [clientData, setClientData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });
  const [modalView, setModalView] = useState(false);

  const total = cart.reduce(
    (acc, item) =>
      acc +
      (session?.user.dias_permitidos === 5 && metodoPago === "transferencia"
        ? item.product.precio_minimo ?? 0
        : metodoPago === "transferencia"
        ? item.product.precio_minimo ?? 0
        : metodoPago === "tarjeta_1_pago"
        ? item.product.precio_tarjeta1cuota ?? 0
        : metodoPago === "tarjeta_3_pagos"
        ? item.product.precio_tarjeta3cuotas ?? 0
        : metodoPago === "tarjeta_6_pagos"
        ? item.product.precio_tarjeta6cuotas ?? 0
        : item.product.price ?? 0) *
        item.quantity,
    0
  );

  const handleBuy = async (
    cart: CartItem[],
    nombre: string,
    email: string,
    telefono?: string,
    direccion?: string
  ) => {
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
    message +=
      "\n *Metodo de pago:* " +
      (metodoPago === "transferencia"
        ? "Transferencia/Efectivo"
        : metodoPago === "tarjeta_1_pago"
        ? "Tarjeta 1 Pago"
        : metodoPago === "tarjeta_3_pagos"
        ? "Tarjeta 3 Pagos"
        : "Tarjeta 6 Pagos") +
      "\n";
    message += "\n💰 *Total:* $" + total.toLocaleString("es-AR");
    message += "\n\n**Datos del cliente:**\n";
    message += `Nombre: ${nombre}\n`;
    message += `Email: ${email}\n`;
    message += telefono ? `Teléfono: ${telefono}\n` : "";
    message += direccion ? `Dirección: ${direccion}\n` : "";

    // Codificar el mensaje para la URL
    const metodoPagoDB = (
      metodoPago === "transferencia"
        ? "Transferencia/Efectivo"
        : metodoPago === "tarjeta_1_pago"
        ? "Tarjeta 1 Pago"
        : metodoPago === "tarjeta_3_pagos"
        ? "Tarjeta 3 Pagos"
        : "Tarjeta 6 Pagos"
    );
    const encodedMessage = encodeURIComponent(message);
    try {
      const cartItems = cart.map((item) => ({
        productItemName: item.product.name,
        productItemDescription: item.product.description || "",
        productItemPrice: item.product.price,
        productItemPriceTarjeta1Cuota: item.product.precio_tarjeta1cuota,
        productItemPriceTarjeta3Cuotas: item.product.precio_tarjeta3cuotas,
        productItemPriceTarjeta6Cuotas: item.product.precio_tarjeta6cuotas,
        prodcutItemMinPrice: item.product.precio_minimo,
        productItemSlug: item.product.slug,
        quantity: item.quantity,
      }));
      // console.log("Cart items to save:", cartItems);
      try {
        await saveSoldCart(
          cartItems,
          nombre,
          email,
          telefono || "",
          total,
          metodoPagoDB
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error al guardar el carrito vendido en la base de datos:", error.message);
        }
        alert(
          "Ocurrió un error al procesar tu pedido. Por favor, inténtalo de nuevo más tarde."
        );
        return;
      }
    } catch (error: unknown) {
      console.error("Error al guardar el carrito vendido:", error);
      alert(
        "Ocurrió un error al procesar tu pedido. Por favor, inténtalo de nuevo más tarde."
      );
      return;
    }

    // Abrir WhatsApp en una nueva pestaña
    window.open(
      `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}&type=phone_number&app_absent=1`,
      "_blank"
    );

    // Opcional: cerrar el carrito y/o limpiarlo
    setOpen(false);
    clearCart(); // Descomenta si quieres limpiar el carrito después de enviar
  };

  const getPrecio = (item: CartItem) => {
    switch (metodoPago) {
      case "tarjeta_1_pago":
        return item.product.precio_tarjeta1cuota;
      case "tarjeta_3_pagos":
        return item.product.precio_tarjeta3cuotas;
      case "tarjeta_6_pagos":
        return item.product.precio_tarjeta6cuotas;
      case "transferencia":
        return session?.user.dias_permitidos === 5
          ? item.product.precio_minimo
          : item.product.price;
    }
    return item.product.price;
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
                        ${getPrecio(item)?.toLocaleString("es-AR")}
                      </div>
                      {session?.user.dias_permitidos === 5 &&
                        metodoPago === "transferencia" && (
                          <div className="text-xs text-gray-500">
                            Descuento alumno libre aplicado
                          </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              changeQuantity(
                                item.product.slug,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className={`px-2 py-1 rounded ${
                              item.quantity <= 1
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-gray-700 text-gray-200 hover:bg-emerald-600"
                            }`}
                          >
                            -
                          </button>
                          <span className="px-2 text-lg text-slate-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              changeQuantity(
                                item.product.slug,
                                item.quantity + 1
                              )
                            }
                            disabled={
                              item.quantity >= (item.product.stock || 0)
                            }
                            className={`px-2 py-1 rounded ${
                              item.quantity >= (item.product.stock || 0)
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-gray-700 text-gray-200 hover:bg-emerald-600"
                            }`}
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs text-gray-400">
                          Stock disponible:{" "}
                          {(item.product.stock || 0) - item.quantity}
                        </span>
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
              <div>
                <div className="text-gray-300 mb-2 border-b border-gray-700 pb-2">
                  <span>Método de pago:</span>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-end gap-2">
                      <span>Transferencia/Efectivo</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="accent-emerald-400"
                        checked={metodoPago === "transferencia"}
                        onChange={() => setMetodoPago("transferencia")}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span>Tarjeta de crédito 1 pago</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="accent-emerald-400"
                        checked={metodoPago === "tarjeta_1_pago"}
                        onChange={() => setMetodoPago("tarjeta_1_pago")}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span>Tarjeta de crédito 3 pagos</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="accent-emerald-400"
                        checked={metodoPago === "tarjeta_3_pagos"}
                        onChange={() => setMetodoPago("tarjeta_3_pagos")}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span>Tarjeta de crédito 6 pagos</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="accent-emerald-400"
                        checked={metodoPago === "tarjeta_6_pagos"}
                        onChange={() => setMetodoPago("tarjeta_6_pagos")}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
                onClick={() => {
                  if (session) {
                    if (metodoPago === "") {
                      alert("Debe seleccionar un método de pago");
                    } else {
                      if (confirm("¿Estás seguro de que deseas realizar la compra?")) {
                        handleBuy(
                          cart,
                          session.user?.name || "",
                          session.user?.email || "",
                          session.user?.telefono || "",
                          clientData.direccion
                        );
                        setOpen(false);
                        setMetodoPago("");
                      }
                    }
                  } else {
                    setModalView(true);
                  }
                }}
              >
                <FaShoppingBag className="w-5 h-5" />
                Finalizar compra
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de compra */}
      {modalView && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-end">
              <button
                onClick={() => setModalView(false)}
                className="text-slate-200 hover:text-emerald-400 text-2xl bg-red-600 rounded-full p-1"
                aria-label="Cerrar modal"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-4 text-center">
              Finalizar compra
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                handleBuy(
                  cart,
                  clientData.nombre,
                  clientData.email,
                  clientData.telefono,
                  clientData.direccion
                );

                setModalView(false);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Nombre"
                value={clientData.nombre}
                onChange={(e) =>
                  setClientData({ ...clientData, nombre: e.target.value })
                }
                required
                className="w-full p-2 bg-gray-700 text-white rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={clientData.email}
                onChange={(e) =>
                  setClientData({ ...clientData, email: e.target.value })
                }
                required
                className="w-full p-2 bg-gray-700 text-white rounded"
              />
              <input
                type="tel"
                placeholder="Teléfono (opcional)"
                value={clientData.telefono}
                onChange={(e) =>
                  setClientData({ ...clientData, telefono: e.target.value })
                }
                className="w-full p-2 bg-gray-700 text-white rounded"
              />
              <input
                type="text"
                placeholder="Dirección (opcional)"
                value={clientData.direccion}
                onChange={(e) =>
                  setClientData({ ...clientData, direccion: e.target.value })
                }
                className="w-full p-2 bg-gray-700 text-white rounded"
              />
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold shadow transition-colors text-lg"
              >
                Enviar pedido
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
