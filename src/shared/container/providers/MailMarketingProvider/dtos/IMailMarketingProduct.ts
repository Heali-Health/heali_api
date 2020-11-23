interface IMailMarketingProductVariant {
  id: string;
  title: string;
  url?: string;
  sku?: string;
  price?: number;
  inventory_quantity?: number;
  image_url?: string;
  backorders?: string;
  visibility?: string;
  created_at?: string;
  updated_at?: string;
}

export default interface IMailMarketingProduct {
  id: string;
  currency_code?: string;
  title: string;
  handle?: string;
  url?: string;
  description?: string;
  type?: string;
  vendor?: string;
  image_url?: string;
  variants: IMailMarketingProductVariant[];
  published_at_foreign?: string;
}
