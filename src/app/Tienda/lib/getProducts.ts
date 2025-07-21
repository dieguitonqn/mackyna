import { Product } from "../types/procucts";
import StrapiQuery from "./strapi";

const { STRAPI_HOST } = process.env;

export default async function getProducts({ category }: { category: string }) {
  try {
    const productosRaw = StrapiQuery(
      `products?filters[product_category][slug][$contains]=${category}&populate[productImages][fields][0]=url`
    );
    const { data, meta } = await productosRaw;
    const products = data.map((product: Product) => {
      const { name, description, price, precio_minimo,precio_tarjeta1cuota,precio_tarjeta3cuotas,precio_tarjeta6cuotas, productImages, isActive, stock, slug } =
        product;
      const images = productImages.map((image: { url: string }) => ({
        url: `${STRAPI_HOST}${image.url}`,
      }));
      // console.log("Product images:", images);
      return {
        name,
        description,
        price,
        precio_minimo,
        precio_tarjeta1cuota,
        precio_tarjeta3cuotas,
        precio_tarjeta6cuotas,
        productImages: images,
        isActive,
        stock,
        slug,
      };
    });
    // console.log("Products fetched:", products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
