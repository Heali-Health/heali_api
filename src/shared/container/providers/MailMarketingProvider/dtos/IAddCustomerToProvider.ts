export default interface IAddCustomerToProvider {
  id: string;
  email_address: string;
  opt_in_status: boolean;
  company?: string;
  first_name: string;
  last_name: string;
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
}
