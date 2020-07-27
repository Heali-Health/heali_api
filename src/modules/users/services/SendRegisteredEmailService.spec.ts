import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeQueueProvider from '@shared/container/providers/QueueProvider/fakes/FakeQueueProvider';
import SendRegisteredEmailService from './SendRegisteredEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeQueueProvider: FakeQueueProvider;
let sendRegisteredEmail: SendRegisteredEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeQueueProvider = new FakeQueueProvider();
    sendRegisteredEmail = new SendRegisteredEmailService(fakeQueueProvider);
  });

  it('should be able to add user`s register email to the queue', async () => {
    const addToQueue = jest.spyOn(fakeQueueProvider, 'add');
    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await sendRegisteredEmail.execute(user);

    expect(addToQueue).toHaveBeenCalled();
  });
});
