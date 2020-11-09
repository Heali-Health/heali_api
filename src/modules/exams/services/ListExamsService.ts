import { injectable, inject } from 'tsyringe';

import Exam from '@modules/exams/infra/typeorm/entities/Exam';
import IExamsRepository from '@modules/exams/repositories/IExamsRepository';

@injectable()
export default class ListExamsService {
  constructor(
    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,
  ) {}

  public async execute(): Promise<Exam[]> {
    return this.examsRepository.findAll();
  }
}
