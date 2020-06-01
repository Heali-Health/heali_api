import { injectable, inject } from 'tsyringe';

import ILabsRepository from '@modules/labs/repositories/ILabsRepository';
import ILabInfoProvider from '@shared/container/providers/LabInfoProvider/models/ILabInfoProvider';

import Lab from '@modules/labs/infra/typeorm/entities/Lab';

@injectable()
export default class UpsertLabsFromApiService {
  constructor(
    @inject('LabsRepository')
    private labsRepository: ILabsRepository,

    @inject('LabInfoProvider')
    private labInfoProvider: ILabInfoProvider,
  ) {}

  public async execute(): Promise<Lab[]> {
    const labsFromApi = await this.labInfoProvider.getLabsInfo();

    const labsToUpdate = await this.labsRepository.upsertLabs(labsFromApi);

    return labsToUpdate;
  }
}
