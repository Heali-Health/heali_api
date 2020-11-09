import { uuid } from 'uuidv4';

import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import ICreateExamDTO from '@modules/exams/dtos/ICreateExamDTO';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';

export default class FakeExamsRepository implements IExamsRepository {
  private exams: Exam[] = [];

  public async create({
    title,
    slug,
  }: // synonyms,
  // original_exams_ids,
  ICreateExamDTO): Promise<Exam> {
    const exam = new Exam();

    Object.assign(exam, {
      id: uuid(),
      title,
      slug,
      // synonyms,
      // original_exams_ids,
    });

    this.exams.push(exam);

    return exam;
  }

  public async save(exam: Exam): Promise<Exam> {
    const findIndex = this.exams.findIndex(findExam => findExam.id === exam.id);

    this.exams[findIndex] = exam;

    return exam;
  }

  public async findAll(): Promise<Exam[]> {
    return this.exams;
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

  public async findByExamIds(exam_ids: string | string[]): Promise<Exam[]> {
    const findExams = this.exams.filter(exam => exam_ids.includes(exam.id));

    return findExams;
  }

  public async findByExamId(exam_id: string): Promise<Exam | undefined> {
    const findExam = this.exams.find(exam => exam_id === exam.id);

    return findExam;
  }

  public async findByExamSlugs(slugs: string | string[]): Promise<Exam[]> {
    const findExams = this.exams.filter(exam => slugs.includes(exam.slug));

    return findExams;
  }
}
