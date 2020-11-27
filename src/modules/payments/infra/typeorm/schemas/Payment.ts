import {
  IPagarmeBilling,
  IPagarmeCustomer,
  IPagarmeItem,
  IPagarmeShipping,
} from '@modules/payments/dtos/ICreatePaymentLogDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserCard from './UserCard';

@Entity('payments')
class Payment {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  user: User;

  @Column()
  bagId: string;

  @Column()
  quoteId: string;

  @Column()
  object: string;

  @Column()
  status: string;

  @Column()
  refse_reason: string;

  @Column()
  status_reason: string;

  @Column()
  acquirer_response_code: string;

  @Column()
  acquirer_name: string;

  @Column()
  acquirer_id: string;

  @Column()
  authorization_code: string;

  @Column()
  soft_descriptor: string;

  @Column()
  tid: number;

  @Column()
  nsu: number;

  @Column()
  date_created: string;

  @Column()
  date_updated: string;

  @Column()
  amount: number;

  @Column()
  authorized_amount: number;

  @Column()
  paid_amount: number;

  @Column()
  refunded_amount: number;

  @Column()
  installments: number;

  @Column()
  card_holder_name: string;

  @Column()
  card_last_digits: string;

  @Column()
  card_first_digits: string;

  @Column()
  card_brand: string;

  @Column()
  card_pin_mode: string;

  @Column()
  postback_url: string;

  @Column()
  payment_method: string;

  @Column()
  capture_method: string;

  @Column()
  antifraud_score: string;

  @Column()
  boleto_url: string;

  @Column()
  boleto_barcode: string;

  @Column()
  boleto_expiration_date: string;

  @Column()
  referer: string;

  @Column()
  ip: string;

  @Column()
  subscription_id: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  customer: IPagarmeCustomer;

  @Column()
  billing: IPagarmeBilling;

  @Column()
  shipping: IPagarmeShipping;

  @Column()
  items: IPagarmeItem[];

  @Column()
  card: UserCard;

  split_rules: string;

  @Column()
  metadata: {};

  @Column()
  antifraud_metadata: {};

  @Column()
  reference_key: string;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}

export default Payment;
