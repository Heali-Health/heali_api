import { injectable, inject } from 'tsyringe';

import OriginalExam from '@modules/exams/infra/typeorm/entities/OriginalExam';
import IOriginalExamsRepository from '../repositories/IOriginalExamsRepository';

@injectable()
export default class ListAssociatedOriginalExamsService {
  constructor(
    @inject('OriginalExamsRepository')
    private originalExamsRepository: IOriginalExamsRepository,
  ) {}

  public async execute(): Promise<OriginalExam[]> {
    const associatedOriginalExams = await this.originalExamsRepository.findAllAssociatedToExams();

    return associatedOriginalExams;
  }
}
