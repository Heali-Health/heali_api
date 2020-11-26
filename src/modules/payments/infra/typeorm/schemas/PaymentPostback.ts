import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import { IPagarmeLog } from '@modules/payments/dtos/ICreatePaymentLogDTO';

@Entity('payments_postbacks')
class PaymentPostback {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  user: User;

  @Column()
  fingerprint: string;

  @Column()
  event: string;

  @Column()
  old_status: string;

  @Column()
  desired_status: string;

  @Column()
  current_status: string;

  @Column()
  object: string;

  @Column()
  transaction: IPagarmeLog;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}

export default PaymentPostback;
