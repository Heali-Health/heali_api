import IAddCustomerToProvider from './IAddCustomerToProvider';
import IMailMarketingCustomer from './IMailMarketingCustomer';

export default interface IAddCartToProvider {
  id: string;
  customer: IMailMarketingCustomer;
  currency_code: string;
  order_total: number;
  lines: {
    id: string;
    product_id: string;
    product_variant_id: string;
    quantity: number;
    price: number;
  }[];
  campaign_id?: string;
  checkout_url: string;
  tax_total?: number;
}
