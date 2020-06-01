import FakePatientsRepository from '@modules/users/repositories/fakes/FakePatientsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreatePatientService from './CreatePatientService';

let fakePatientsRepository: FakePatientsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let createPatient: CreatePatientService;

describe('CreatePatient', () => {
  beforeEach(() => {
    fakePatientsRepository = new FakePatientsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createPatient = new CreatePatientService(
      fakeCacheProvider,
      fakePatientsRepository,
    );
  });

  it('should be able to create a new patient', async () => {
    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const patient = await createPatient.execute({
      first_name: 'Mary',
      last_name: 'Doe',
      document_id: '1234567890',
      document_type: 'CPF',
      height: 1.88,
      weight: 95.5,
      user_id: user.id,
    });

    expect(patient).toHaveProperty('id');
  });
});
