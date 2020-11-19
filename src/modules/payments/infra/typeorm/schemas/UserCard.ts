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
  object: string;

  @Column()
  pagarme_id: string;

  @Column()
  pagarme_date_created: Date;

  @Column()
  pagarme_date_updated: Date;

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
  expiration_date: string;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}

export default UserCard;
