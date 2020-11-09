import { injectable, inject } from 'tsyringe';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';
import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import sortByTitle from '@shared/utils/sortByTitle';

@injectable()
export default class SearchExamByUserInputService {
  constructor(
    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,
  ) {}

  public async execute(userInput: string): Promise<Exam[]> {
    const exams = await this.examsRepository.findAllByUserInput(userInput);

    const sortedByTitleExams = exams.sort(sortByTitle);

    return sortedByTitleExams;
  }
}
