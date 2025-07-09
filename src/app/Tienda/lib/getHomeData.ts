import logger from "@/lib/logger";
import  StrapiQuery  from "./strapi";

export async function getHomeData() {
const { STRAPI_HOST } = process.env;
    try {
        const data = await StrapiQuery("home?populate=logo_principal&populate=prices&populate=carrousel");
        if (!data || !data.data) {
            logger.error("getHomeData: No data found");
            return null;
        }
        // console.log("Fetched home data:", data);
        const {title, description, logo_principal, prices, carrousel, tiendaVisible} = data.data;
        const imagen = `${STRAPI_HOST}${logo_principal.url}`;
        const precios =`${STRAPI_HOST}${prices.url}`;
        const carrouselImages = carrousel.map((item: { url: string }) => ({
            url: `${STRAPI_HOST}${item.url}`,
            
        }));
        // console.log("Carrousel images:", carrouselImages);
        return {title, description, logo_principal: imagen, prices: precios, carrousel: carrouselImages, tiendaVisible};
    } catch (error:unknown) {
        if (error instanceof Error) {
            logger.error("getHomeData: Error fetching home data:", error.message);
        }
        logger.error("getHomeData: An unexpected error occurred:", error);
    }

//   return StrapiQuery("home?populate=image")
//     .then((data) => {
//       if (!data || !data.data) {
//         throw new Error("No data found");
//       }
//       return data.data;
//     })
//     .catch((error) => {
//       console.error("Error fetching home data:", error);
//       throw error;
//     });
}
