import { injectable, inject } from 'tsyringe';

import IOriginalExamsRepository from '@modules/exams/repositories/IOriginalExamsRepository';
import ILabInfoProvider from '@shared/container/providers/LabInfoProvider/models/ILabInfoProvider';

import OriginalExam from '@modules/exams/infra/typeorm/entities/OriginalExam';

@injectable()
export default class UpsertOriginalExamsFromApiService {
  constructor(
    @inject('OriginalExamsRepository')
    private originalExamsRepository: IOriginalExamsRepository,

    @inject('LabInfoProvider')
    private labInfoProvider: ILabInfoProvider,
  ) {}

  public async execute(): Promise<OriginalExam[]> {
    const originalExamsFromApi = await this.labInfoProvider.getOriginalExamsInfo();

    const originalExamsToUpdate = await this.originalExamsRepository.upsertOriginalExams(
      originalExamsFromApi,
    );

    return originalExamsToUpdate;
  }
}
