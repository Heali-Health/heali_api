import { injectable, inject } from 'tsyringe';

import OriginalExam from '@modules/exams/infra/typeorm/entities/OriginalExam';
import IOriginalExamsRepository from '@modules/exams/repositories/IOriginalExamsRepository';

@injectable()
export default class ListOriginalExamsFromCompanyService {
  constructor(
    @inject('OriginalExamsRepository')
    private originalExamsRepository: IOriginalExamsRepository,
  ) {}

  public async execute(company_id: string): Promise<OriginalExam[]> {
    const originalExams = await this.originalExamsRepository.findAllByCompanyId(
      company_id,
    );

    return originalExams;
  }
}
