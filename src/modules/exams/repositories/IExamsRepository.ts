import Exam from '@modules/exams/infra/typeorm/entities/Exam';
import ICreateExamDTO from '@modules/exams/dtos/ICreateExamDTO';

export default interface IExamsRepository {
  create({ title }: ICreateExamDTO): Promise<Exam>;
  save(exam: Exam): Promise<Exam>;
  findAllByUserInput(query: string): Promise<Exam[]>;
  findByTitle(title: string): Promise<Exam | undefined>;
}
