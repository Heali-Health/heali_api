import User from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ICard } from '../dtos/ICreateUserCardDTO';
import UserCard from '../infra/typeorm/schemas/UserCard';
import FakeUserCardsRepository from '../repositories/fakes/FakeUserCardsRepository';
import UpdateMainUserCardService from './UpdateMainUserCardService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserCardsRepository: FakeUserCardsRepository;
let updateMainUserCard: UpdateMainUserCardService;

let user: User;
let card1: ICard;
let card2: ICard;
let userCard1: UserCard;
let userCard2: UserCard;

describe('UpdateMainUserCard', () => {
  beforeEach(async () => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserCardsRepository = new FakeUserCardsRepository();
    updateMainUserCard = new UpdateMainUserCardService(fakeUserCardsRepository);

    user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: 'hard-to-discover-password',
    });

    card1 = {
      object: 'card',
      id: 'card-id1',
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

    card2 = {
      object: 'card',
      id: 'card-id2',
      brand: 'ultracard',
      first_digits: '2345',
      last_digits: '6789',
      holder_name: 'Jane Doe',
      expiration_date: '1228',
      country: 'Johnland',
      fingerprint: 'fingerprint',
      valid: true,
      date_created: new Date(),
      date_updated: new Date(),
    };

    userCard1 = await fakeUserCardsRepository.create({
      userId: user.id,
      card: card1,
    });

    userCard2 = await fakeUserCardsRepository.create({
      userId: user.id,
      card: card2,
    });

    userCard1.isMain = true;
    userCard2.isMain = false;
  });

  it('should keep an informed main card as main', async () => {
    await updateMainUserCard.execute(user.id, userCard1.foreign_id);

    expect(userCard1.isMain).toBe(true);
    expect(userCard2.isMain).toBe(false);
  });

  it('should change an informed secondary card to main, and the main to secondary', async () => {
    await updateMainUserCard.execute(user.id, userCard2.foreign_id);

    expect(userCard1.isMain).toBe(false);
    expect(userCard2.isMain).toBe(true);
  });

  it('should change an recently created card to main, and the main to secondary', async () => {
    const newUserCard = await fakeUserCardsRepository.create({
      userId: user.id,
      card: {
        id: 'new-card',
        brand: 'super-brand',
        country: 'Cardsville',
        date_created: new Date(),
        date_updated: new Date(),
        expiration_date: '1230',
        fingerprint: '',
        first_digits: 'first-digits',
        last_digits: 'last-digits',
        holder_name: 'New Card Holder',
        object: 'card',
        valid: true,
      },
    });

    await updateMainUserCard.execute(user.id, newUserCard.foreign_id);

    expect(userCard1.isMain).toBe(false);
    expect(userCard2.isMain).toBe(false);
    expect(newUserCard.isMain).toBe(true);
  });
});
