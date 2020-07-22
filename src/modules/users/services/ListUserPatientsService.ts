import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Patient from '@modules/users/infra/typeorm/entities/Patient';
import IPatientsRepository from '@modules/users/repositories/IPatientsRepository';

@injectable()
export default class ListUserPatientsService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(user_id: string): Promise<Patient[]> {
    const cacheKey = `user-patients:${user_id}`;
    console.log(cacheKey);

    let patients = await this.cacheProvider.recover<Patient[]>(cacheKey);

    if (!patients) {
      patients = await this.patientsRepository.findAllByUserId(user_id);

      await this.cacheProvider.save(cacheKey, patients);
    }

    return patients;
  }
}
