import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import IOriginalExamsRepository from '@modules/exams/repositories/IOriginalExamsRepository';
import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import IUpdateExamDTO from '@modules/exams/dtos/IUpdateExamDTO';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';

import ISlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/models/ISlugTransformationProvider';

@injectable()
export default class UpdateExamService {
  constructor(
    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,

    @inject('OriginalExamsRepository')
    private originalExamsRepository: IOriginalExamsRepository,

    @inject('PricesRepository')
    private pricesRepository: IPricesRepository,

    @inject('SlugTransformationProvider')
    private slugTransformation: ISlugTransformationProvider,
  ) {}

  public async execute({
    id,
    title,
    original_exams_ids,
    slug,
  }: IUpdateExamDTO): Promise<Exam> {
    const exam = await this.examsRepository.findByExamId(id);

    if (!exam) {
      throw new AppError('No exam corresponded the informed id', 400);
    }

    if (title) {
      exam.title = title;
      exam.slug = this.slugTransformation.transform(title);
    }

    if (slug) {
      exam.slug = slug;
    }

    if (original_exams_ids) {
      const selectedOriginalExams = await this.originalExamsRepository.findByIdArray(
        original_exams_ids,
      );

      const updatedOriginalExams = selectedOriginalExams.map(
        selectedOriginalExam => {
          const updatedOriginalExam = selectedOriginalExam;
          updatedOriginalExam.exam = exam;
          updatedOriginalExam.exam_id = exam.id;
          return updatedOriginalExam;
        },
      );

      await this.originalExamsRepository.saveMany(updatedOriginalExams);

      const selectedPrices = await this.pricesRepository.findByOriginalExamIdsArray(
        original_exams_ids,
      );

      const updatedPrices = selectedPrices.map(selectedPrice => {
        const updatedPrice = selectedPrice;
        updatedPrice.exam = exam;
        updatedPrice.exam_id = exam.id;
        return updatedPrice;
      });

      await this.pricesRepository.saveMany(updatedPrices);
    }

    await this.examsRepository.save(exam);

    return exam;
  }
}
