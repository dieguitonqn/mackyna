'use server'
import StrapiQuery from "@/app/Tienda/lib/strapi";
import { Product } from "@/app/Tienda/types/procucts";


// const { STRAPI_HOST } = process.env;

export default async function getAllProducts() {
  try {
    const productosRaw = StrapiQuery(
      `products`);
    const { data, meta } = await productosRaw;
    console.log("Raw products data:", data);
    const products = data.map((product: Product) => {
      const { name, description, price, isActive, stock, slug } =
        product;
    //   const images = productImages.map((image: { url: string }) => ({
    //     url: `${STRAPI_HOST}${image.url}`,
    //   }));
    //   console.log("Product images:", images);
      return {
        name,
        description,
        price,
        // productImages: images,
        isActive,
        stock,
        slug,
      };
    });
    console.log("Products fetched:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}