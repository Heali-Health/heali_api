import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import OriginalExam from './OriginalExam';
import Price from './Price';

@Entity('exams')
class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => OriginalExam, originalExam => originalExam.exam)
  original_exam: OriginalExam;

  @OneToMany(() => Price, price => price.exam)
  price: Price;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}

export default Exam;
