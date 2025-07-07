'use client';
import { Product } from "../types/procucts";
import Image from "next/image";
import React, { useEffect } from "react";
import { useCart } from "../lib/useCart";

export const CardProduct = (product: Product) => {
  const {cart, addToCart} = useCart();
  useEffect(() => {
    // console.log("Cart updated:", cart);
  }, [cart]);
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <Image
        width={300}
        height={300}
        src={product.productImages[0].url}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-400 mb-4">{product.description}</p>
        <p className="text-emerald-400 text-lg font-semibold">${product.price}</p>
        <p className="text-gray-500">Stock: {product.stock}</p>
        <button
        className="mt-4 flex justify-center mx-auto w-fit bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
        onClick={() => {
          addToCart(product);
        }}
        >
            Anadir al carrito
        </button>
      </div>
    </div>
  );
};


