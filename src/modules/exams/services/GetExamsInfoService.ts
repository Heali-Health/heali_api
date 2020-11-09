import { injectable, inject } from 'tsyringe';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';
import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import sortByTitle from '@shared/utils/sortByTitle';
import AppError from '@shared/errors/AppError';
import IListExamsDTO from '../dtos/IListExamsDTO';

@injectable()
export default class GetExamsInfoService {
  constructor(
    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,
  ) {}

  public async execute({ exam_ids, slugs }: IListExamsDTO): Promise<Exam[]> {
    if (!exam_ids && !slugs) {
      throw new AppError('No exam info was provided');
    }

    const examsI = exam_ids
      ? await this.examsRepository.findByExamIds(exam_ids)
      : [];

    const examsII = slugs
      ? await this.examsRepository.findByExamSlugs(slugs)
      : [];

    const exams = [...examsI, ...examsII];

    const sortedByTitleExams = exams.sort(sortByTitle);

    return sortedByTitleExams;
  }
}
