"use client";
import getAllProducts from "./lib/getAllProducts";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  stock: number;
  category?: { name: string } | string;
}



export default function TiendaProfesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Obtener categorías únicas para el filtro
  const categories = Array.from(
    new Set(products.map((p) => typeof p.category === "string" ? p.category : p.category?.name || "Sin categoría"))
  );

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        console.log("Productos obtenidos:", data);
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filtrado por búsqueda y categoría
  const filtered = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      prod.description.toLowerCase().includes(search.toLowerCase());
    // const matchesCategory =
    //   !categoryFilter ||
    //   (typeof prod.category === "string"
    //     ? prod.category === categoryFilter
    //     : prod.category?.name === categoryFilter);
    return matchesSearch ; //&& matchesCategory;
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Productos en Stock</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full"
        />
        {/* <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 text-white border border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select> */}
      </div>
      {loading ? (
        <p className="text-gray-400">Cargando productos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white rounded-lg shadow-lg">
            <thead>
              <tr>
                {/* <th className="px-4 py-2 border-b border-emerald-700">ID</th> */}
                <th className="px-4 py-2 border-b border-emerald-700">Nombre</th>
                <th className="px-4 py-2 border-b border-emerald-700">Descripción</th>
                {/* <th className="px-4 py-2 border-b border-emerald-700">Categoría</th> */}
                <th className="px-4 py-2 border-b border-emerald-700">Stock</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((prod,idx) => (
                <tr key={idx} className="hover:bg-emerald-950/30">
                  {/* <td className="px-4 py-2 border-b border-gray-700">{prod.id}</td> */}
                  <td className="px-4 py-2 border-b border-gray-700">{prod.name}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{prod.description}</td>
                  {/* <td className="px-4 py-2 border-b border-gray-700">{typeof prod.category === "string" ? prod.category : prod.category?.name || "Sin categoría"}</td> */}
                  <td className="px-4 py-2 border-b border-gray-700">{prod.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
