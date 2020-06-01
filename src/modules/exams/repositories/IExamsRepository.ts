import Exam from '@modules/exams/infra/typeorm/entities/Exam';
import ICreateExamDTO from '@modules/exams/dtos/ICreateExamDTO';

export default interface IExamsRepository {
  findAllByUserInput(query: string): Promise<Exam[]>;
  findByTitle(title: string): Promise<Exam | undefined>;
  create({ title }: ICreateExamDTO): Promise<Exam>;
}
