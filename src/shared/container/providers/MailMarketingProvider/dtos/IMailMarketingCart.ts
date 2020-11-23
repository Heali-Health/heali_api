import IMailMarketingCartLine from './IMailMarketingCartLine';
import IMailMarketingCustomer from './IMailMarketingCustomer';

export default interface IMailMarketingCart {
  id: string;
  customer: IMailMarketingCustomer;
  campaign_id: string;
  checkout_url: string;
  currency_code: string;
  order_total: number;
  tax_total: number;
  lines: IMailMarketingCartLine[];
  created_at: string;
  updated_at: string;
}
