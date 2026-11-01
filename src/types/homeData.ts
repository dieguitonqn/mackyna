import type { BlocksContent } from "@strapi/blocks-react-renderer";

export interface HomeData {
  title: string | null;
  description: BlocksContent | null;
  logo_principal: string | null;
  carrousel: { url: string }[];
}
