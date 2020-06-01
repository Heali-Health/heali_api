import ICreatePatientDTO from '@modules/users/dtos/ICreatePatientDTO';
import Patient from '@modules/users/infra/typeorm/entities/Patient';

export default interface IPatientsRepository {
  findAllByUserId(id: string): Promise<Patient[]>;
  findById(id: string): Promise<Patient | undefined>;
  create(data: ICreatePatientDTO): Promise<Patient>;
  save(patient: Patient): Promise<Patient>;
}
