import { injectable, inject } from 'tsyringe';
import IOriginalExamsRepository from '../repositories/IOriginalExamsRepository';

interface ISearchOriginalExamResponseDTO {
  associatedOriginalExamsToExams: string[];
  notAssociatedOriginalExamsToExams: string[];
}

@injectable()
export default class SearchOriginalExamsService {
  constructor(
    @inject('OriginalExamsRepository')
    private originalExamsRepository: IOriginalExamsRepository,
  ) {}

  public async execute(input: string): Promise<ISearchOriginalExamResponseDTO> {
    const originalExams = await this.originalExamsRepository.findAllByUserInput(
      input,
    );

    const associatedOriginalExams = originalExams.filter(
      originalExam => !!originalExam.exam_id,
    );

    const associatedOriginalExamsTitlesDuplicated = associatedOriginalExams.map(
      originalExam => originalExam.title,
    );

    const associatedOriginalExamsTitles = [
      ...new Set(associatedOriginalExamsTitlesDuplicated),
    ];

    const notAssociatedOriginalExams = originalExams.filter(
      originalExam => !originalExam.exam_id,
    );

    const notAssociatedOriginalExamsTitlesDuplicated = notAssociatedOriginalExams.map(
      originalExam => originalExam.title,
    );

    const notAssociatedOriginalExamsTitles = [
      ...new Set(notAssociatedOriginalExamsTitlesDuplicated),
    ];

    const matchedOriginalExamsTitles = {
      associatedOriginalExamsToExams: associatedOriginalExamsTitles,
      notAssociatedOriginalExamsToExams: notAssociatedOriginalExamsTitles,
    };

    return matchedOriginalExamsTitles;
  }
}
