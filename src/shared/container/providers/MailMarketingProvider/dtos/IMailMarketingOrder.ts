import IMailMarketingCustomer from './IMailMarketingCustomer';

export interface IMailMarketingOrderLine {
  id: string;
  product_id: string;
  product_title: string;
  product_variant_id: string;
  product_variant_title: string;
  image_url?: string;
  quantity: number;
  price: number;
  discount?: number;
}

interface IMailMarketingAddress {
  name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  province_code?: string;
  postal_code?: string;
  country?: string;
  country_code?: string;
  longitude?: number;
  latitude?: number;
  phone?: string;
  company?: string;
}

export default interface IMailMarketingOrder {
  id: string;
  customer: IMailMarketingCustomer;
  store_id?: string;
  campaign_id?: string;
  landing_site?: string;
  financial_status?: string;
  fulfillment_status?: string;
  currency_code: string;
  order_total: number;
  order_url?: string;
  discount_total?: number;
  tax_total?: number;
  shipping_total?: number;
  tracking_code?: string;
  processed_at_foreign?: string;
  cancelled_at_foreign?: string;
  updated_at_foreign?: string;
  shipping_address?: IMailMarketingAddress;
  billing_address?: IMailMarketingAddress;
  promos?: [
    {
      code?: string;
      amount_discounted?: number;
      type?: string;
    },
  ];
  lines: IMailMarketingOrderLine[];
  outreach?: {
    id?: string;
    name?: string;
    type?: string;
    published_time?: string;
  };
}
