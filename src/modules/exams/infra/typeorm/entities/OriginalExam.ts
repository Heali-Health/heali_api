import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import Lab from '@modules/labs/infra/typeorm/entities/Lab';
import Exam from './Exam';
import Price from './Price';

@Entity('original_exams')
class OriginalExam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  exam_id: string;

  @ManyToOne(() => Exam, exam => exam.original_exam)
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @Column()
  lab_id: string;

  @ManyToOne(() => Lab, lab => lab.original_exam)
  @JoinColumn({ name: 'lab_id' })
  lab: Lab;

  @Column()
  exam_original_id: string;

  @Column()
  lab_id_exam_original_id: string;

  @OneToMany(() => Price, price => price.original_exam_id)
  price: Price;

  @Column()
  description: string;

  @Column()
  preparation: string;

  @Column()
  sex: string;

  @Column()
  min_age: number;

  @Column()
  max_age: number;

  @Column()
  days_to_results: number;

  @Column()
  lab_min_price: number;

  @Column()
  lab_min_price_max_installments: number;

  @Column()
  lab_max_price: number;

  @Column()
  lab_max_price_max_installments: number;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}

export default OriginalExam;
