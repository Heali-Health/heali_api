import Price from '@modules/exams/infra/typeorm/entities/Price';
import User from '@modules/users/infra/typeorm/entities/User';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

@Entity('bags')
class Bag {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  user: User;

  @Column()
  prices: Price[];

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}

export default Bag;
