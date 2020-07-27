import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import ProcessUserEmailQueueService from './ProcessUserEmailQueueService';

let fakeUsersRepository: FakeUsersRepository;
let fakeQueueProvider: FakeQueueProvider;
let fakeMailProvider: FakeMailProvider;
let processUserEmailQueue: ProcessUserEmailQueueService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeQueueProvider = new FakeQueueProvider();
    fakeMailProvider = new FakeMailProvider();
    processUserEmailQueue = new ProcessUserEmailQueueService(
      fakeQueueProvider,
      fakeMailProvider,
    );
  });

  it('should be able to add user`s register email to the queue', async () => {
    const processQueue = jest.spyOn(fakeQueueProvider, 'process');
    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await fakeQueueProvider.add(user);

    await processUserEmailQueue.execute();

    expect(processQueue).toHaveBeenCalled();
  });
});
