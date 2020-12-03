import { ICard } from './ICreateUserCardDTO';

export interface IPagarmeAddress {
  object: string;
  street: string;
  complementary?: string;
  street_number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  id: number;
}

export interface IPagarmeShipping {
  address: IPagarmeAddress;
  object: string;
  id: number;
  name: string;
  fee: number;
  delivery_date: string;
  expedited: true;
}

export interface IPagarmeBilling {
  address: IPagarmeAddress;
  object: string;
  id: number;
  name: string;
}

export interface IPagarmeCustomer {
  object: string;
  id: number;
  external_id: string;
  type: string;
  country: string;
  document_number?: string;
  document_type: string;
  name: string;
  email: string;
  phone_numbers: string[];
  born_at?: string;
  birthday?: string;
  gender?: string;
  date_created: string;
  documents: IPagarmeDocument[];
}

export interface IPagarmeDocument {
  object: string;
  id: string;
  type: string;
  number: string;
}

export interface IPagarmeItem {
  object: string;
  id: string;
  title: string;
  unit_price: number;
  quantity: number;
  category?: string;
  tangible: true;
  venue?: string;
  date?: string;
}

export interface IPagarmeLog {
  object: string;
  status: string;
  refse_reason?: string;
  status_reason: string;
  acquirer_response_code: string;
  acquirer_name: string;
  acquirer_id: string;
  authorization_code: string;
  soft_descriptor?: string;
  tid: number;
  nsu: number;
  date_created: string;
  date_updated: string;
  amount: string;
  authorized_amount: number;
  paid_amount: number;
  refunded_amount: number;
  installments: number;
  id: number;
  cost: number;
  card_holder_name: string;
  card_last_digits: string;
  card_first_digits: string;
  card_brand: string;
  card_pin_mode?: string;
  postback_url?: string;
  payment_method: string;
  capture_method: string;
  antifraud_score?: string;
  boleto_url: string | null;
  boleto_barcode: string | null;
  boleto_expiration_date: string | null;
  referer: string;
  ip: string;
  subscription_id?: string;
  phone?: string;
  address?: string;
  customer: IPagarmeCustomer;
  billing: IPagarmeBilling;
  shipping: IPagarmeShipping;
  items: IPagarmeItem[];
  card: ICard | null;
  split_rules?: string;
  metadata: {
    bagId: string;
    quoteId: string;
  };
  antifraud_metadata: {};
  reference_key?: string;
}

export default interface ICreatePaymentLogDTO {
  bagId: string;
  userId: string;
  quoteId: string;
  payment: IPagarmeLog;
}
