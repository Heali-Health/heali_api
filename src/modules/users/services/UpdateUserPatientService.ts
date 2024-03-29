import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Patient from '@modules/users/infra/typeorm/entities/Patient';
import IPatientsRepository from '@modules/users/repositories/IPatientsRepository';

interface IRequest {
  id: string;
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
  relationship?: 'self' | string;
}

@injectable()
export default class UpdatePatientService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,

    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute({
    id,
    first_name,
    last_name,
    email,
    birth_date,
    sex,
    document_id,
    document_type,
    height,
    weight,
    mobility_restrictions,
    relationship,
  }: IRequest): Promise<Patient> {
    const patient = await this.patientsRepository.findById(id);

    if (!patient) {
      throw new AppError('Patient not found');
    }

    if (first_name) {
      patient.first_name = first_name;
    }

    if (last_name) {
      patient.last_name = last_name;
    }

    if (email) {
      patient.email = email;
    }

    if (birth_date) {
      patient.birth_date = birth_date;
    }

    if (sex) {
      patient.sex = sex;
    }

    if (document_id) {
      patient.document_id = document_id;
    }

    if (document_type) {
      patient.document_type = document_type;
    }

    if (height) {
      patient.height = height;
    }

    if (weight) {
      patient.weight = weight;
    }

    if (mobility_restrictions) {
      patient.mobility_restrictions = mobility_restrictions;
    }

    if (relationship) {
      patient.relationship = relationship;
    }

    await this.cacheProvider.invalidatePrefix(
      `user-patients:${patient.user_id}`,
    );

    return this.patientsRepository.save(patient);
  }
}
