import AppError from '@shared/errors/AppError';

import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import { injectable, inject } from 'tsyringe';
import ICreateExamDTO from '@modules/exams/dtos/ICreateExamDTO';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';

@injectable()
export default class CreateExamService {
  constructor(
    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,
  ) {}

  public async execute({ title }: ICreateExamDTO): Promise<Exam> {
    const checkExamExists = await this.examsRepository.findByTitle(title);

    if (checkExamExists) {
      throw new AppError('Exam title already used', 400);
    }

    const exam = await this.examsRepository.create({ title });

    return exam;
  }
}
