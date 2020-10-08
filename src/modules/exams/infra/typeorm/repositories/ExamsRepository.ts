import { Repository, getRepository } from 'typeorm';

import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import ICreateExamDTO from '@modules/exams/dtos/ICreateExamDTO';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';

class ExamsRepository implements IExamsRepository {
  private ormRepository: Repository<Exam>;

  constructor() {
    this.ormRepository = getRepository(Exam);
  }

  public async create({ title, slug }: ICreateExamDTO): Promise<Exam> {
    const exam = this.ormRepository.create({ title, slug });

    await this.ormRepository.save(exam);

    return exam;
  }

  public async save(exam: Exam): Promise<Exam> {
    return this.ormRepository.save(exam);
  }

  public async findAll(): Promise<Exam[]> {
    return this.ormRepository.find();
  }

  public async findAllByUserInput(query: string): Promise<Exam[]> {
    const exams = await this.ormRepository.find({
      where: `title ILIKE '%${query}%'`,
    });

    return exams;
  }

  public async findByTitle(title: string): Promise<Exam | undefined> {
    const exam = await this.ormRepository.findOne({ where: { title } });

    return exam;
  }

  public async findByExamIds(exam_ids: string[]): Promise<Exam[]> {
    const exams = await this.ormRepository.findByIds(exam_ids);

    return exams;
  }
}

export default ExamsRepository;
