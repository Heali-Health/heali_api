import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import Lab from '@modules/labs/infra/typeorm/entities/Lab';
import Exam from './Exam';
import OriginalExam from './OriginalExam';

@Entity('prices')
class Price {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  exam_id: string;

  @ManyToOne(() => Exam, exam => exam.price, { eager: true })
  @JoinColumn({ name: 'exam_id' })
  exam: Exam;

  @Column()
  lab_id: string;

  @ManyToOne(() => Lab, lab => lab.price, { eager: true })
  @JoinColumn({ name: 'lab_id' })
  lab: Lab;

  @Column()
  original_exam_id: string;

  @ManyToOne(() => OriginalExam, originalExam => originalExam.price, {
    eager: true,
  })
  @JoinColumn({ name: 'original_exam_id' })
  original_exam: OriginalExam;

  @Column()
  price: number;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}

export default Price;
