import IBilling from '@modules/payments/types/IBilling';
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
  user_id: string;

  @Column()
  card: UserCard;

  @Column()
  billing: IBilling;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}

export default Payment;
