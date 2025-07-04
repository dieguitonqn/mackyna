import  {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

export interface HomeData {
  title: string | null;
  description: BlocksContent | null;
  logo_principal: string | null;
  prices: string;
  carrousel: { url: string }[];
}