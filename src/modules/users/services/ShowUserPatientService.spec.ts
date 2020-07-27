import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowUserPatientService from './ShowUserPatientService';
import FakePatientsRepository from '../repositories/fakes/FakePatientsRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakePatientsRepository: FakePatientsRepository;
let showUserPatient: ShowUserPatientService;

describe('ShowUserPatient', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePatientsRepository = new FakePatientsRepository();

    showUserPatient = new ShowUserPatientService(fakePatientsRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const patient = await fakePatientsRepository.create({
      first_name: 'Mary',
      last_name: 'Doe',
      document_type: 'CPF',
      document_id: 'docnumber',
      user_id: user.id,
    });

    const profile = await showUserPatient.execute(patient.id);

    expect(profile.first_name).toBe('Mary');
    expect(profile.last_name).toBe('Doe');
    expect(profile.document_id).toBe('docnumber');
  });

  it('should not be able to show the profile from non-existing user', async () => {
    await expect(
      showUserPatient.execute('non-existing-patient'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
