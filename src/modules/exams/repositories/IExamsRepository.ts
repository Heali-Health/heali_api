import Exam from '@modules/exams/infra/typeorm/entities/Exam';
import ICreateExamDTO from '@modules/exams/dtos/ICreateExamDTO';

export default interface IExamsRepository {
  create({ title }: ICreateExamDTO): Promise<Exam>;
  save(exam: Exam): Promise<Exam>;
  findAll(): Promise<Exam[]>;
  findAllByUserInput(query: string): Promise<Exam[]>;
  findByTitle(title: string | string[]): Promise<Exam | undefined>;
  findByExamId(exam_id: string): Promise<Exam | undefined>;
  findByExamIds(exam_ids: string[]): Promise<Exam[]>;
}
