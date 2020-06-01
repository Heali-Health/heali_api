import { injectable, inject } from 'tsyringe';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';
import IExamsRepository from '@modules/exams/repositories/IExamsRepository';

@injectable()
export default class SearchExamService {
  constructor(
    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,
  ) {}

  public async execute(userInput: string): Promise<Exam[]> {
    const exams = await this.examsRepository.findAllByUserInput(userInput);

    return exams;
  }
}
