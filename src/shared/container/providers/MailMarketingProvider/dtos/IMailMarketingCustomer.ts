export default interface IMailMarketingCustomer {
  id: string;
  email_address: string;
  opt_in_status: boolean;
  company?: string;
  first_name: string;
  last_name: string;
  orders_count?: number;
  total_spent?: number;
  address?: {
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    province_code?: string;
    postal_code?: string;
    country?: string;
    country_code?: string;
  };
  created_at?: string;
  updated_at?: string;
}
