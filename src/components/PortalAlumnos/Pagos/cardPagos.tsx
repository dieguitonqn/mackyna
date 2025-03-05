'use client';
import React from "react";
import { FaDumbbell } from "react-icons/fa";

interface ICardPagosProps {
  texto: string;
  precio: number;
  onclick?: (texto: string, precio: number) => void;
}

export const CardPagos = ({texto, precio, onclick}: ICardPagosProps) => {
  const handleClick = () => {
    if (onclick) {
      onclick(texto, precio);
    }
  };

  return (
    <div className="flex justify-center items-center w-full md:w-auto h-full md_hscreen mx-1">
      <button 
      className="w-full bg-white p-5 rounded-lg shadow-lg border border-gray-300 hover:shadow-lg hover:shadow-slate-300 hover:border-2 transition-shadow duration-300 ease-in-out"
      onClick={handleClick}>
        <div className="flex flex-col items-center gap-4 text-center">
          <FaDumbbell className="text-4xl text-emerald-500" />
          <p className="text-lg font-semibold text-gray-700">{texto}</p>
          <p className="text-2xl font-bold text-gray-900">$ {precio.toLocaleString()}</p>
        </div>
      </button>
    </div>
  );
};

