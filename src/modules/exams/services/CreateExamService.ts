import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import IOriginalExamsRepository from '@modules/exams/repositories/IOriginalExamsRepository';
import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import ICreateExamDTO from '@modules/exams/dtos/ICreateExamDTO';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';

import ISlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/models/ISlugTransformationProvider';
import IMailMarketingProvider from '@shared/container/providers/MailMarketingProvider/models/IMailMarketingProvider';

@injectable()
export default class CreateExamService {
  constructor(
    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,

    @inject('OriginalExamsRepository')
    private originalExamsRepository: IOriginalExamsRepository,

    @inject('PricesRepository')
    private pricesRepository: IPricesRepository,

    @inject('SlugTransformationProvider')
    private slugTransformation: ISlugTransformationProvider,

    @inject('MailMarketingProvider')
    private mailMarketingProvider: IMailMarketingProvider,
  ) {}

  public async execute({
    title,
    // synonyms,
    slug,
    original_exams_ids,
  }: ICreateExamDTO): Promise<Exam> {
    const checkExamExists = await this.examsRepository.findByTitle(title);

    if (checkExamExists) {
      throw new AppError('Exam title already used', 400);
    }

    const exam = await this.examsRepository.create({
      title,
      slug: !slug ? this.slugTransformation.transform(title) : slug,
    });

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

    await this.mailMarketingProvider.addProduct({
      id: exam.id,
      title: exam.title,
      variants: [
        {
          id: exam.id,
          title: exam.title,
        },
      ],
    });

    return exam;
  }
}
