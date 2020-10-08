import { injectable, inject } from 'tsyringe';

import ISearchProvider from '@shared/container/providers/SearchProvider/models/ISearchProvider';
import IPushExamsToSearchDTO from '../dtos/IPushExamsToSearchDTO';
import IOriginalExamsRepository from '../repositories/IOriginalExamsRepository';
import Exam from '../infra/typeorm/entities/Exam';

@injectable()
export default class PushExamToSearchProviderService {
  constructor(
    @inject('OriginalExamsRepository')
    private originalExamsRepository: IOriginalExamsRepository,

    @inject('SearchProvider')
    private searchProvider: ISearchProvider,
  ) {}

  public async execute(exam: Exam): Promise<string[]> {
    const examId = exam.id;

    const originalExams = await this.originalExamsRepository.findAllByExamId([
      examId,
    ]);

    const examOriginalExams = originalExams.filter(
      originalExam => originalExam.exam_id === exam.id,
    );

    const examOriginalExamsTitles = examOriginalExams.map(oE => oE.title);

    const alternativeTitles = [...new Set(examOriginalExamsTitles)];

    const examToIndex: IPushExamsToSearchDTO = {
      objectID: exam.id,
      title: exam.title,
      slug: exam.slug,
      alternative_titles: alternativeTitles,
    };

    const examsObjectIds = await this.searchProvider.addExamsToIndex([
      examToIndex,
    ]);

    return examsObjectIds;
  }
}
