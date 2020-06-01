import FakePatientsRepository from '@modules/users/repositories/fakes/FakePatientsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import UpdateUserPatientService from './UpdateUserPatientService';

let fakePatientsRepository: FakePatientsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateUserPatient: UpdateUserPatientService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakePatientsRepository = new FakePatientsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateUserPatient = new UpdateUserPatientService(
      fakeCacheProvider,
      fakePatientsRepository,
    );
  });

  it('should be able to update an user´s patient', async () => {
    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      phone_whatsapp: '2345678',
      password: '123456',
    });

    const patient = await fakePatientsRepository.create({
      first_name: 'Mary',
      last_name: 'Doe',
      document_id: '1234567890',
      document_type: 'CPF',
      height: 1.88,
      weight: 95.5,
      user_id: user.id,
    });

    const updatedUser = await updateUserPatient.execute({
      id: patient.id,
      first_name: 'Suzy',
      last_name: 'Tre',
      email: 'suzytre@example.com',
      document_id: '0123456789',
      document_type: 'RG',
      height: 1.69,
      weight: 76.3,
    });

    expect(updatedUser.first_name).toBe('Suzy');
    expect(updatedUser.last_name).toBe('Tre');
    expect(updatedUser.email).toBe('suzytre@example.com');
    expect(updatedUser.document_id).toBe('0123456789');
    expect(updatedUser.document_type).toBe('RG');
    expect(updatedUser.height).toBe(1.69);
    expect(updatedUser.weight).toBe(76.3);
  });
});
