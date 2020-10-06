import { injectable, inject } from 'tsyringe';

// import Exam from '@modules/exams/infra/typeorm/entities/Exam';
import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import IPushExamsToSearchDTO from '../dtos/IPushExamsToSearchDTO';
import IOriginalExamsRepository from '../repositories/IOriginalExamsRepository';
import OriginalExam from '../infra/typeorm/entities/OriginalExam';

@injectable()
export default class PushExamsToSearchService {
  constructor(
    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,

    @inject('OriginalExamsRepository')
    private originalExamsRepository: IOriginalExamsRepository,
  ) {}

  public async execute(): Promise<IPushExamsToSearchDTO[]> {
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
        id: exam.id,
        title: exam.title,
        slug: exam.slug,
        alternative_titles: alternativeTitles,
      };

      return examIndex;
    });

    return index;
  }
}
