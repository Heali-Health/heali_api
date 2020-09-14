import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';
import Price from '@modules/exams/infra/typeorm/entities/Price';
import User from '@modules/users/infra/typeorm/entities/User';
import Patient from '@modules/users/infra/typeorm/entities/Patient';

@Entity('quotes')
class Quote {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  user: User;

  @Column()
  patient: Patient;

  @Column()
  price: Price[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Quote;
