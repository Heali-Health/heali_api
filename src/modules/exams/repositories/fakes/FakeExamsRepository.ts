import { uuid } from 'uuidv4';

import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import ICreateExamDTO from '@modules/exams/dtos/ICreateExamDTO';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';

export default class FakeExamRepository implements IExamsRepository {
  private exams: Exam[] = [];

  public async create({ title }: ICreateExamDTO): Promise<Exam> {
    const exam = new Exam();

    Object.assign(exam, { id: uuid(), title });

    this.exams.push(exam);

    return exam;
  }

  public async save(exam: Exam): Promise<Exam> {
    const findIndex = this.exams.findIndex(findExam => findExam.id === exam.id);

    this.exams[findIndex] = exam;

    return exam;
  }

  public async findAllByUserInput(query: string): Promise<Exam[]> {
    const { exams } = this;

    const queryRegex = new RegExp(query, 'i');

    const results = exams.filter(exam => queryRegex.test(exam.title));

    return results;
  }

  public async findByTitle(title: string): Promise<Exam | undefined> {
    const findExam = this.exams.find(exam => exam.title === title);

    return findExam;
  }
}
