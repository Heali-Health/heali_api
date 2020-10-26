import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';

@Entity('patients')
class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  document_id: string;

  @Column()
  document_type: 'RG' | 'CPF' | 'Passaporte' | 'RNE';

  @Column()
  height: number;

  @Column()
  weight: number;

  @Column()
  mobility_restrictions: string;

  @Column()
  sex: 'male' | 'female';

  @Column('timestamp with time zone')
  birth_date: Date;

  @Column()
  user_id: string;

  @ManyToOne(() => User, user => user.patient, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}

export default Patient;
