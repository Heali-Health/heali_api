import {
  IPagarmeBilling,
  IPagarmeCustomer,
} from '@modules/payments/dtos/ICreatePaymentLogDTO';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

@Entity('user_cards')
class UserCard {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  user_id: string;

  @Column()
  payment_method: string;

  @Column()
  object: string;

  @Column()
  foreign_id: string;

  @Column()
  isMain: boolean;

  @Column()
  foreign_date_created: Date;

  @Column()
  foreign_date_updated: Date;

  @Column()
  brand: string;

  @Column()
  holder_name: string;

  @Column()
  first_digits: string;

  @Column()
  last_digits: string;

  @Column()
  country: string;

  @Column()
  fingerprint: string;

  @Column()
  valid: boolean;

  @Column()
  billing_address: IPagarmeBilling;

  @Column()
  paying_customer: IPagarmeCustomer;

  @Column()
  expiration_date: string;

  @Column()
  boleto_barcode: string | null;

  @Column()
  boleto_expiration_date: string | null;

  @Column()
  boleto_url: string | null;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}

export default UserCard;
