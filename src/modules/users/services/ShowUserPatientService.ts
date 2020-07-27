import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IPatientsRepository from '../repositories/IPatientsRepository';
import Patient from '../infra/typeorm/entities/Patient';

@injectable()
export default class ShowUserPatientService {
  constructor(
    @inject('PatientsRepository')
    private patientsRepository: IPatientsRepository,
  ) {}

  public async execute(patient_id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findById(patient_id);

    if (!patient) {
      throw new AppError('Patient not found');
    }

    return patient;
  }
}
