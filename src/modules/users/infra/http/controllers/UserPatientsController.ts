import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import { container } from 'tsyringe';

import CreatePatientService from '@modules/users/services/CreatePatientService';
import ListUserPatientsService from '@modules/users/services/ListUserPatientsService';
import UpdateUserPatientService from '@modules/users/services/UpdateUserPatientService';
import ShowUserPatientService from '@modules/users/services/ShowUserPatient';

export default class PatientPatientsController {
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const {
        first_name,
        last_name,
        email,
        document_id,
        document_type,
        height,
        weight,
        mobility_restrictions,
      } = req.body;
      const user_id = req.user.id;

      const createPatient = container.resolve(CreatePatientService);
      const patient = await createPatient.execute({
        first_name,
        last_name,
        email,
        document_id,
        document_type,
        height,
        weight,
        mobility_restrictions,
        user_id,
      });

      return res.json(classToClass(patient));
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  public async index(req: Request, res: Response): Promise<Response> {
    try {
      const user_id = req.user.id;

      const listUserPatients = container.resolve(ListUserPatientsService);
      const patients = await listUserPatients.execute(user_id);

      return res.json(patients);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  public async show(req: Request, res: Response): Promise<Response> {
    try {
      const { patient_id } = req.params;

      const listUserPatient = container.resolve(ShowUserPatientService);
      const patient = await listUserPatient.execute(patient_id);

      return res.json(patient);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const {
        first_name,
        last_name,
        email,
        document_id,
        document_type,
        height,
        weight,
        mobility_restrictions,
      } = req.body;
      const { patient_id } = req.params;

      const updateUserPatient = container.resolve(UpdateUserPatientService);
      const patient = await updateUserPatient.execute({
        id: patient_id,
        first_name,
        last_name,
        email,
        document_id,
        document_type,
        height,
        weight,
        mobility_restrictions,
      });

      return res.json(patient);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
