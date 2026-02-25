import Link from "next/link";
import { CardProduct } from "../componentes/CardProduct";
import getProducts from "../lib/getProducts";
import { Product } from "../types/procucts";
import { FaArrowLeft } from "react-icons/fa";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const products: Product[] = await getProducts({ category });

  return (
    <div className="min-h-screen text-white p-4">
      {/* Botón de volver */}
      <div className="mb-1">
        <Link
          href="/Tienda"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/40 hover:shadow-green-600 hover:shadow-lg  text-white rounded-lg transition-colors"
        >
          <FaArrowLeft />
          Volver a la tienda
        </Link>
      </div>

      <h1 className="text-4xl font-extrabold mb-6 text-center bg-slate-300 bg-clip-text text-transparent py-2 border-b border-gray-200">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <div
            key={idx}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <CardProduct {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}
