import { uuid } from 'uuidv4';

import IPatientsRepository from '@modules/users/repositories/IPatientsRepository';
import ICreatePatientDTO from '@modules/users/dtos/ICreatePatientDTO';

import Patient from '@modules/users/infra/typeorm/entities/Patient';

class FakePatientsRepository implements IPatientsRepository {
  private patients: Patient[] = [];

  public async findAllByUserId(user_id: string): Promise<Patient[]> {
    let { patients } = this;

    if (user_id) {
      patients = this.patients.filter(patient => patient.user_id === user_id);
    }

    return patients;
  }

  public async findById(id: string): Promise<Patient | undefined> {
    const findPatient = this.patients.find(patient => patient.id === id);

    return findPatient;
  }

  public async create(patientData: ICreatePatientDTO): Promise<Patient> {
    const patient = new Patient();

    Object.assign(patient, { id: uuid() }, patientData);

    this.patients.push(patient);

    return patient;
  }

  public async save(patient: Patient): Promise<Patient> {
    const findIndex = this.patients.findIndex(
      findPatient => findPatient.id === patient.id,
    );

    this.patients[findIndex] = patient;

    return patient;
  }
}

export default FakePatientsRepository;
