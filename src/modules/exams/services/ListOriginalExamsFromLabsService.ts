import { injectable, inject } from 'tsyringe';

import OriginalExam from '@modules/exams/infra/typeorm/entities/OriginalExam';
import IOriginalExamsRepository from '@modules/exams/repositories/IOriginalExamsRepository';

@injectable()
export default class ListOriginalExamsFromLabsService {
  constructor(
    @inject('OriginalExamsRepository')
    private originalExamsRepository: IOriginalExamsRepository,
  ) {}

  public async execute(labIds: string[]): Promise<OriginalExam[]> {
    const originalExams = await this.originalExamsRepository.findAllByLabsIds(
      labIds,
    );

    return originalExams;
  }
}
