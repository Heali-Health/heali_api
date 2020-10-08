import { injectable, inject } from 'tsyringe';
import ISlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/models/ISlugTransformationProvider';
import IOriginalExamsRepository from '../repositories/IOriginalExamsRepository';
import IAssociateExamToOriginalExamTitleDTO from '../dtos/IAssociateExamToOriginalExamTitleDTO';
import IExamsRepository from '../repositories/IExamsRepository';
import IPricesRepository from '../repositories/IPricesRepository';
import Exam from '../infra/typeorm/entities/Exam';

@injectable()
export default class AssociateExamToOriginalExamTitleService {
  constructor(
    @inject('OriginalExamsRepository')
    private originalExamsRepository: IOriginalExamsRepository,

    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,

    @inject('PricesRepository')
    private pricesRepository: IPricesRepository,

    @inject('SlugTransformationProvider')
    private slugTransformation: ISlugTransformationProvider,
  ) {}

  public async execute({
    examTitle,
    originalExamTitle,
  }: IAssociateExamToOriginalExamTitleDTO): Promise<Exam> {
    const originalExams = await this.originalExamsRepository.findAllByTitle(
      originalExamTitle,
    );

    const originalExamsIds = originalExams.map(originalExam => originalExam.id);

    const examExists = await this.examsRepository.findByTitle(examTitle);

    if (!examExists) {
      const exam = await this.examsRepository.create({
        title: examTitle,
        slug: this.slugTransformation.transform(examTitle),
      });

      const updatedOriginalExams = originalExams.map(selectedOriginalExam => {
        const updatedOriginalExam = selectedOriginalExam;
        updatedOriginalExam.exam = exam;
        updatedOriginalExam.exam_id = exam.id;
        return updatedOriginalExam;
      });

      await this.originalExamsRepository.saveMany(updatedOriginalExams);

      const selectedPrices = await this.pricesRepository.findByOriginalExamIdsArray(
        originalExamsIds,
      );

      const updatedPrices = selectedPrices.map(selectedPrice => {
        const updatedPrice = selectedPrice;
        updatedPrice.exam = exam;
        updatedPrice.exam_id = exam.id;
        return updatedPrice;
      });

      await this.pricesRepository.saveMany(updatedPrices);

      return exam;
    }
    const updatedOriginalExams = originalExams.map(selectedOriginalExam => {
      const updatedOriginalExam = selectedOriginalExam;
      updatedOriginalExam.exam = examExists;
      updatedOriginalExam.exam_id = examExists.id;
      return updatedOriginalExam;
    });

    await this.originalExamsRepository.saveMany(updatedOriginalExams);

    const selectedPrices = await this.pricesRepository.findByOriginalExamIdsArray(
      originalExamsIds,
    );

    const updatedPrices = selectedPrices.map(selectedPrice => {
      const updatedPrice = selectedPrice;
      updatedPrice.exam = examExists;
      updatedPrice.exam_id = examExists.id;
      return updatedPrice;
    });

    await this.pricesRepository.saveMany(updatedPrices);

    return examExists;
  }
}
