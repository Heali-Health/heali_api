import User from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ICard } from '../dtos/ICreateUserCardDTO';
import FakeUserCardsRepository from '../repositories/fakes/FakeUserCardsRepository';
import CreateUserCardService from './CreateUserCardService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserCardsRepository: FakeUserCardsRepository;
let createUserCard: CreateUserCardService;

let user: User;
let card: ICard;

describe('CreateUserCard', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserCardsRepository = new FakeUserCardsRepository();
    createUserCard = new CreateUserCardService(fakeUserCardsRepository);

    user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: 'hard-to-discover-password',
    });

    card = {
      object: 'card',
      id: 'card-id',
      brand: 'ultracard',
      first_digits: '1234',
      last_digits: '7890',
      holder_name: 'John Doe',
      expiration_date: '1228',
      country: 'Johnland',
      fingerprint: 'fingerprint',
      valid: true,
      date_created: new Date(),
      date_updated: new Date(),
    };
  });

  it('should create a new user card given informed user id and card', async () => {
    const userCard = await createUserCard.execute({
      userId: user.id,
      card,
    });

    expect(userCard).toHaveProperty('id');
  });
});
