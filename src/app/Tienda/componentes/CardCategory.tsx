import { Category } from "../types/categories";

export const CardCategory = ( category :Category) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <img
        src={category.category_image}
        alt={category.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-white">{category.name}</h2>
        <p className="text-gray-400 mt-2">{category.description}</p>
        <a
          href={`/tienda/${category.slug}`}
          className="mt-4 inline-block bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
        >
          Ver Productos
        </a>
      </div>
    </div>
  );
}