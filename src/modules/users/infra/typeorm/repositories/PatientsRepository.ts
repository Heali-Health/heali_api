import { getRepository, Repository } from 'typeorm';

import IPatientsRepository from '@modules/users/repositories/IPatientsRepository';
import ICreatePatientDTO from '@modules/users/dtos/ICreatePatientDTO';

import Patient from '@modules/users/infra/typeorm/entities/Patient';

class PatientsRepository implements IPatientsRepository {
  private ormRepository: Repository<Patient>;

  constructor() {
    this.ormRepository = getRepository(Patient);
  }

  public async findAllByUserId(user_id: string): Promise<Patient[]> {
    const patients = await this.ormRepository.find({ where: { user_id } });

    return patients;
  }

  public async findById(id: string): Promise<Patient | undefined> {
    const patient = await this.ormRepository.findOne(id);

    return patient;
  }

  public async create(patientData: ICreatePatientDTO): Promise<Patient> {
    const patient = this.ormRepository.create(patientData);

    await this.ormRepository.save(patient);

    return patient;
  }

  public async save(patient: Patient): Promise<Patient> {
    return this.ormRepository.save(patient);
  }
}

export default PatientsRepository;
