import logger from "@/lib/logger";

const { STRAPI_API_URL, STRAPI_API_TOKEN } = process.env;

export default async function StrapiQuery(url: string) {
  try {
    const response = await fetch(`${STRAPI_API_URL}/${url}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    });

    if (!response.ok) {
      logger.error(`Error fetching data from Strapi: ${response.statusText}`);
      return undefined;
    }

    return await response.json();
  } catch (error) {
    logger.error(`Error in StrapiQuery: ${error}`);
    return undefined;
  }
}
