import logger from "@/lib/logger";
import StrapiQuery from "@/lib/strapi";
import type { HomeData } from "@/types/homeData";

export async function getHomeData(): Promise<HomeData | null> {
  const { STRAPI_HOST } = process.env;

  try {
    const response = await StrapiQuery("home?populate=logo_principal&populate=carrousel");
    const data = response?.data;
    if (!data) {
      logger.error("getHomeData: No data found");
      return null;
    }

    return {
      title: data.title ?? null,
      description: data.description ?? null,
      logo_principal: data.logo_principal?.url && STRAPI_HOST
        ? `${STRAPI_HOST}${data.logo_principal.url}`
        : null,
      carrousel: Array.isArray(data.carrousel)
        ? data.carrousel.flatMap((item: { url?: string }) =>
            item?.url && STRAPI_HOST ? [{ url: `${STRAPI_HOST}${item.url}` }] : []
          )
        : [],
    };
  } catch (error) {
    logger.error("getHomeData: Error fetching home data:", error);
    return null;
  }
}
