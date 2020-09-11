import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import ProcessQuoteEmailQueueService from './ProcessQuoteEmailQueueService';

let fakeUsersRepository: FakeUsersRepository;
let fakeQueueProvider: FakeQueueProvider;
let fakeMailProvider: FakeMailProvider;
let processQuoteEmailQueue: ProcessQuoteEmailQueueService;

describe('ProcessQuoteEmailQueue', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeQueueProvider = new FakeQueueProvider();
    fakeMailProvider = new FakeMailProvider();
    processQuoteEmailQueue = new ProcessQuoteEmailQueueService(
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

    await processQuoteEmailQueue.execute();

    expect(processQueue).toHaveBeenCalled();
  });
});
