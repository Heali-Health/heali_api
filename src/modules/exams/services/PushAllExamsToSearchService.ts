import { injectable, inject } from 'tsyringe';

import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import ISearchProvider from '@shared/container/providers/SearchProvider/models/ISearchProvider';
import IMailMarketingProvider from '@shared/container/providers/MailMarketingProvider/models/IMailMarketingProvider';
import IPushExamsToSearchDTO from '../dtos/IPushExamsToSearchDTO';
import IOriginalExamsRepository from '../repositories/IOriginalExamsRepository';

@injectable()
export default class PushAllExamsToSearchService {
  constructor(
    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,

    @inject('OriginalExamsRepository')
    private originalExamsRepository: IOriginalExamsRepository,

    @inject('SearchProvider')
    private searchProvider: ISearchProvider,

    @inject('MailMarketingProvider')
    private mailMarketingProvider: IMailMarketingProvider,
  ) {}

  public async execute(): Promise<string[]> {
    const exams = await this.examsRepository.findAll();
    const examsIds = exams.map(exam => exam.id);

    const originalExams = await this.originalExamsRepository.findAllByExamId(
      examsIds,
    );

    const index = exams.map(exam => {
      const examOriginalExams = originalExams.filter(
        originalExam => originalExam.exam_id === exam.id,
      );

      const examOriginalExamsTitles = examOriginalExams.map(oE => oE.title);

      const alternativeTitles = [...new Set(examOriginalExamsTitles)];

      const examIndex: IPushExamsToSearchDTO = {
        objectID: exam.id,
        title: exam.title,
        slug: exam.slug,
        alternative_titles: alternativeTitles,
      };

      this.mailMarketingProvider.addProduct({
        id: exam.id,
        title: exam.title,
        variants: [
          {
            id: exam.id,
            title: exam.title,
          },
        ],
      });

      return examIndex;
    });

    const examsObjectIds = await this.searchProvider.addExamsToIndex(index);

    return examsObjectIds;
  }
}
