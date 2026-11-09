import logger from "@/lib/logger";
import StrapiQuery from "@/lib/strapi";
import type { HomeData } from "@/types/homeData";

type StrapiMedia = {
  url?: string;
  width?: number;
  height?: number;
  attributes?: { url?: string; width?: number; height?: number };
  data?: StrapiMedia | StrapiMedia[] | null;
};

function mediaFile(value: StrapiMedia | null | undefined): StrapiMedia | null {
  if (!value) return null;
  if (Array.isArray(value.data)) return value.data[0] ?? null;
  return value.data ?? value;
}

function mediaUrl(value: StrapiMedia | null | undefined, host: string | undefined): string | null {
  const file = mediaFile(value);
  const path = file?.url ?? file?.attributes?.url;
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (!host) return null;
  return `${host.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function mediaDimensions(value: StrapiMedia | null | undefined) {
  const file = mediaFile(value);
  return {
    width: file?.width ?? file?.attributes?.width,
    height: file?.height ?? file?.attributes?.height,
  };
}

function mediaItems(value: StrapiMedia | StrapiMedia[] | null | undefined): StrapiMedia[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  return [];
}

export async function getHomeData(): Promise<HomeData | null> {
  const { STRAPI_HOST } = process.env;

  try {
    const response = await StrapiQuery("home?populate[logo_principal]=true&populate[carrousel]=true&populate[prices]=true");
    const data = response?.data;
    if (!data) {
      logger.error("getHomeData: No data found");
      return null;
    }

    return {
      title: data.title ?? null,
      description: data.description ?? null,
      logo_principal: mediaUrl(data.logo_principal, STRAPI_HOST),
      carrousel: mediaItems(data.carrousel)
        .flatMap((item) => {
          const url = mediaUrl(item, STRAPI_HOST);
          return url ? [{ url }] : [];
        }),
      prices: mediaUrl(data.prices, STRAPI_HOST)
        ? { url: mediaUrl(data.prices, STRAPI_HOST)!, ...mediaDimensions(data.prices) }
        : null,
    };
  } catch (error) {
    logger.error("getHomeData: Error fetching home data:", error);
    return null;
  }
}
