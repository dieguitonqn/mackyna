import React from "react";
import { getCategories } from "./lib/getCategories";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  category_image: string;
  description: string;
  slug: string;
}

export const dynamic = "force-dynamic"; // Para evitar el cacheo de la página
async function Tienda() {
  const categories: Category[] = await getCategories();
  // console.log("Categories fetched:", categories);
  return (
    <div className="min-h-screen py-10 px-4 relative">
      <h1 className="text-4xl font-bold text-center text-slate-200 mb-8 drop-shadow border-b border-gray-300 pb-2">
        Tienda de Suplementos y Accesorios
      </h1>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <Image
                width={300}
                height={300}
                src={category.category_image}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-white">
                  {category.name}
                </h2>
                <p className="text-gray-400 mt-2">{category.description}</p>
                <a
                  href={`/Tienda/${category.slug}`}
                  className="mt-4 flex justify-center mx-auto w-fit bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
                >
                  Ver Productos
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tienda;
