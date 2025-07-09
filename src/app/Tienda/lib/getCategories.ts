import logger from "@/lib/logger";
import  StrapiQuery from "./strapi";
const STRAPI_HOST = process.env.STRAPI_HOST || "http://localhost:1337";
interface Category {
  id: number;
  name: string;
  category_image: {
    url: string;
  };
  description: string;
  slug: string;
}
export async function getCategories() {
  try {
    const data = await StrapiQuery(
      "product-categories?populate[category_image][fields][0]=url"
    );
    if (!data || !data.data) {
      logger.error("getCategories.ts :No categories found");
      return [];
    }
    // console.log("Fetched categories:", data);
    return data.data.map((category: Category) => ({
      id: category.id,
      name: category.name,
      category_image: `${STRAPI_HOST}${category.category_image?.url}`,
      description: category.description || "",
      slug: category.slug || "",
    }));
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error fetching categories:", error.message);
    }
    logger.error("An unexpected error occurred:", error);
    return [];
  }
}
