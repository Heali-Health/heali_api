import AppError from '@shared/errors/AppError';

import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import { injectable, inject } from 'tsyringe';
import ICreateExamDTO from '@modules/exams/dtos/ICreateExamDTO';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';

@injectable()
export default class CreateExamService {
  constructor(
    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,

    @inject('PricesRepository')
    private pricesRepository: IPricesRepository,
  ) {}

  public async execute({
    title,
    synonyms,
    original_exams_ids,
  }: ICreateExamDTO): Promise<Exam> {
    const checkExamExists = await this.examsRepository.findByTitle(title);

    if (checkExamExists) {
      throw new AppError('Exam title already used', 400);
    }

    if (original_exams_ids) {
      const selectedPrices = this.pricesRepository.findByOriginalExamIdsArray(
        original_exams_ids,
      );

      return selectedPrices;
    }

    const exam = await this.examsRepository.create({
      title,
      synonyms,
      original_exam: selectedOriginalExams,
      price: selectedPrices,
    });

    return exam;
  }
}
