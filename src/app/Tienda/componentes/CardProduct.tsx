'use client';
import { Product } from "../types/procucts";
import Image from "next/image";
import React, { useEffect } from "react";
import { useCart } from "../lib/useCart";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/swiper-custom.css';

export const CardProduct = (product: Product) => {
  const {cart, addToCart} = useCart();
  useEffect(() => {
    // console.log("Cart updated:", cart);
  }, [cart]);
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="h-48 relative">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={true}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {product.productImages.map((image, index) => (
            <SwiperSlide key={index}>
              <Image
                width={300}
                height={300}
                src={image.url}
                alt={`${product.name} - imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
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


