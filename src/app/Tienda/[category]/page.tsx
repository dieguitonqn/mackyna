import { CardProduct } from "../componentes/CardProduct";
import getProducts from "../lib/getProducts";
import { Product } from "../types/procucts"; // Asegúrate de que la ruta sea correcta

export default async function ProductsPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = await params;
  const products: Product[] = await getProducts({ category });

  console.log("Products fetched:", products);
  // const images = products.map((product) => {
  //     return product.productImages.map((image) => `${process.env.SRAPI_HOST}${image.url}`,
  //     );
  // });

  // console.log("Product images:", images);
  // Aquí podrías hacer una llamada a la API para obtener los productos de la categoría
  // Por ejemplo: const products = await fetchProductsByCategory(category);

  return (
    <div className="min-h-screen bg-black text-white p-4">
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
