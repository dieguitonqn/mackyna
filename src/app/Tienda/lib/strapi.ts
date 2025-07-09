import logger from "@/lib/logger";

const {STRAPI_API_URL, STRAPI_API_TOKEN} = process.env;

console.log("STRAPI_API_URL:", STRAPI_API_URL);
export default async function StrapiQuery(url: string) {
    try {
        const res = await fetch(`${STRAPI_API_URL}/${url}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${STRAPI_API_TOKEN}`
            }
        });

        if (!res.ok) {
            logger.error(`Error fetching data from Strapi: ${res.statusText}`);
        }

        return await res.json();
    } catch (error) {
        
        logger.error(`Error in StrapiQuery: ${error}`);
    }
}
