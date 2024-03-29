import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Patient from '@modules/users/infra/typeorm/entities/Patient';
import IPatientsRepository from '@modules/users/repositories/IPatientsRepository';

interface IRequest {
  first_name: string;
  last_name: string;
  email?: string;
  birth_date?: Date;
  sex?: 'male' | 'female';
  document_id: string;
  document_type: 'RG' | 'CPF' | 'Passaporte' | 'RNE';
  height?: number;
  weight?: number;
  mobility_restrictions?: string;
  user_id: string;
  relationship?: 'self' | string;
}

@injectable()
export default class CreatePatientService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute({
    first_name,
    last_name,
    email,
    document_id,
    document_type,
    birth_date,
    sex,
    height,
    weight,
    mobility_restrictions,
    user_id,
    relationship,
  }: IRequest): Promise<Patient> {
    if (!user_id) {
      throw new AppError('User not found');
    }

    const patient = await this.patientsRepository.create({
      first_name,
      last_name,
      email,
      document_id,
      document_type,
      birth_date,
      sex,
      height,
      weight,
      mobility_restrictions,
      user_id,
      relationship,
    });

    await this.cacheProvider.invalidate(`user-patients:${user_id}`);

    return patient;
  }
}
