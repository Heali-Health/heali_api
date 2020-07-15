import {
  ObjectID,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';
import Price from '@modules/exams/infra/typeorm/entities/Price';

@Entity('quotes')
class Quote {
  @ObjectIdColumn()
  id: ObjectID;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  patient_id: string;

  @Column()
  patient_first_name: string;

  @Column()
  patient_last_name: string;

  @Column()
  price: Price[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Quote;
