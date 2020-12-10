import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import OriginalExam from '@modules/exams/infra/typeorm/entities/OriginalExam';
import Price from '@modules/exams/infra/typeorm/entities/Price';
import Company from './Company';

@Entity('labs')
class Lab {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  company_id: string;

  @ManyToOne(() => Company, company => company.lab, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  original_id: string;

  @Column()
  company_id_original_id: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  collect_hour: string;

  @Column()
  open_hour: string;

  @Column()
  how_to_get: string;

  @Column()
  technician_responsible: string;

  @Column()
  is_open: string;

  @OneToMany(() => OriginalExam, originalExam => originalExam.lab)
  original_exam: OriginalExam;

  @OneToMany(() => Price, price => price.lab)
  price: Price;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Lab;
