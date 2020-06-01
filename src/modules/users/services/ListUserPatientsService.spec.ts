import FakePatientsRepository from '@modules/users/repositories/fakes/FakePatientsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListUserPatientsService from './ListUserPatientsService';

let fakeUsersRepository: FakeUsersRepository;
let fakePatientsRepository: FakePatientsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listUserPatients: ListUserPatientsService;

describe('ListUserPatients', () => {
  beforeEach(() => {
    fakePatientsRepository = new FakePatientsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listUserPatients = new ListUserPatientsService(
      fakePatientsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all patients linked to an user', async () => {
    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const patient1 = await fakePatientsRepository.create({
      first_name: 'Mary',
      last_name: 'Doe',
      document_id: '1234567890',
      document_type: 'CPF',
      height: 175,
      weight: 75.5,
      user_id: user.id,
    });

    const patient2 = await fakePatientsRepository.create({
      first_name: 'Joe',
      last_name: 'Doe',
      document_id: '3456789012',
      document_type: 'CPF',
      height: 168,
      weight: 55.5,
      user_id: user.id,
    });

    const patient3 = await fakePatientsRepository.create({
      first_name: 'Betty',
      last_name: 'Doe',
      document_id: '5678901234',
      document_type: 'CPF',
      height: 130,
      weight: 35.5,
      user_id: user.id,
    });

    const userPatients = await listUserPatients.execute(user.id);

    await expect(userPatients).toEqual([patient1, patient2, patient3]);
  });
});
