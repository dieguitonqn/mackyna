import StrapiQuery from "./strapi";

const {STRAPI_HOST} = process.env;

export default async function getProducts({category}: {category: string}) {
    const productosRaw = StrapiQuery(`products?filters[product_category][slug][$contains]=${category}&populate[productImages][fields][0]=url`)
    const {data, meta} = await productosRaw;
    const products = data.map((product: any) => {
        const {name, description, price, productImages, isActive, stock, slug} = product;
        const images = productImages.map((image: {url:string}) => ({
            url: `${STRAPI_HOST}${image.url}`,
        }));
        console.log("Product images:", images);
        return {name, description, price, productImages: images, isActive, stock, slug};
    }
    );
    console.log("Products fetched:", products);
    return products;
}