import { Repository, getRepository } from 'typeorm';

import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import ICreateExamDTO from '@modules/exams/dtos/ICreateExamDTO';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';

class ExamsRepository implements IExamsRepository {
  private ormRepository: Repository<Exam>;

  constructor() {
    this.ormRepository = getRepository(Exam);
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

  public async create({ title }: ICreateExamDTO): Promise<Exam> {
    const exam = this.ormRepository.create({ title });

    await this.ormRepository.save(exam);

    return exam;
  }
}

export default ExamsRepository;
