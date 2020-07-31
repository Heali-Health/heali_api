import { injectable, inject } from 'tsyringe';

import ILabsRepository from '@modules/labs/repositories/ILabsRepository';
import ILabInfoProvider from '@shared/container/providers/LabInfoProvider/models/ILabInfoProvider';

import Lab from '@modules/labs/infra/typeorm/entities/Lab';
// import ICreateLabDTO from '../dtos/ICreateLabDTO';
// import ISlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/models/ISlugTransformationProvider';

@injectable()
export default class UpsertLabsFromApiService {
  constructor(
    @inject('LabsRepository')
    private labsRepository: ILabsRepository,

    @inject('LabInfoProvider')
    private labInfoProvider: ILabInfoProvider, // @inject('SlugTransformation') // private slugTransformation: ISlugTransformationProvider,
  ) {}

  public async execute(): Promise<Lab[]> {
    const labsFromApi = await this.labInfoProvider.getLabsInfo();

    const labsToUpdate = await this.labsRepository.upsertLabs(labsFromApi);

    const updatedLabs = await this.labsRepository.saveMany(labsToUpdate);

    return updatedLabs;
  }
}
