import IMailMarketingCustomer from './IMailMarketingCustomer';
import { IMailMarketingOrderLine } from './IMailMarketingOrder';

export default interface IAddOrderTOProvider {
  id: string;
  customer: IMailMarketingCustomer;
  currency_code: string;
  order_total: number;
  lines: IMailMarketingOrderLine[];
  campaign_id?: string;
  landing_site?: string;
  financial_status?: string;
  fulfillment_status?: string;
  order_url?: string;
  discount_total?: number;
  tax_total?: number;
  shipping_total?: number;
}
