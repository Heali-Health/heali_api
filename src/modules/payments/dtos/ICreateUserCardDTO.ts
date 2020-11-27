import { IPagarmeBilling, IPagarmeCustomer } from './ICreatePaymentLogDTO';

export interface ICard {
  object: string;
  id: string;
  date_created: Date;
  date_updated: Date;
  brand: string;
  holder_name: string;
  first_digits: string;
  last_digits: string;
  country: string;
  fingerprint: string;
  valid: boolean;
  expiration_date: string;
}

export default interface ICreateUserCardDTO {
  userId: string;
  card: ICard | null;
  paying_customer: IPagarmeCustomer;
  billing_address: IPagarmeBilling;
  payment_method: string;
  boleto_barcode: string | null;
  boleto_expiration_date: string | null;
  boleto_url: string | null;
}
