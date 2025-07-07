import { CardProduct } from "../componentes/CardProduct";
import getProducts from "../lib/getProducts";
import { Product } from "../types/procucts"; // Asegúrate de que la ruta sea correcta

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await  params;
  const products: Product[] = await getProducts({ category });

  console.log("Products fetched:", products);


  return (
    <div className="min-h-screen text-white p-4">
      <h1 className="text-3xl font-bold mb-4">
        Productos en la categoría: {category}
      </h1>
      {/* Aquí renderizarías los productos obtenidos */}
      {/* {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))} */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product,idx) => (
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
