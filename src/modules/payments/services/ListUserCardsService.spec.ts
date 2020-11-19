import User from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ICard } from '../dtos/ICreateUserCardDTO';
import UserCard from '../infra/typeorm/schemas/UserCard';
import FakeUserCardsRepository from '../repositories/fakes/FakeUserCardsRepository';
import ListUserCardsService from './ListUserCardsService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserCardsRepository: FakeUserCardsRepository;
let listUserCards: ListUserCardsService;

let user: User;
let card: ICard;
let userCard: UserCard;

describe('ListUserCards', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserCardsRepository = new FakeUserCardsRepository();
    listUserCards = new ListUserCardsService(fakeUserCardsRepository);

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

    userCard = await fakeUserCardsRepository.create({
      userId: user.id,
      card,
    });
  });

  it('should create a new user card given informed user id and card', async () => {
    const userCards = await listUserCards.execute(user.id);

    expect(userCards[0]).toEqual(userCard);
  });
});
