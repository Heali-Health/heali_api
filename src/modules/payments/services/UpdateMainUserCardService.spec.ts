import User from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import {
  IPagarmeBilling,
  IPagarmeCustomer,
} from '../dtos/ICreatePaymentLogDTO';
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
let customer: IPagarmeCustomer;
let billing: IPagarmeBilling;

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

    customer = {
      object: 'customer',
      id: 4219329,
      external_id: 'aade5262-297e-4f35-a84f-a426aa159cd4',
      type: 'individual',
      country: 'br',
      document_type: 'cpf',
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone_numbers: ['+5551996542954'],
      date_created: '2020-11-25T17:41:11.933Z',
      documents: [
        {
          object: 'document',
          id: 'doc_ckhxp2hl317170i9t6urv8n1g',
          type: 'cpf',
          number: '1234567890',
        },
      ],
    };

    billing = {
      object: 'billing',
      id: 123,
      name: 'John Doe',
      address: {
        object: 'address',
        street: 'Doe',
        street_number: '123',
        city: 'Nothingland',
        state: 'HI',
        zipcode: '00000',
        country: 'br',
        neighborhood: 'Nothingville',
        id: 123,
      },
    };

    userCard1 = await fakeUserCardsRepository.create({
      userId: user.id,
      card: card1,
      billing_address: billing,
      paying_customer: customer,
      payment_method: 'credit_card',
      boleto_barcode: null,
      boleto_expiration_date: null,
      boleto_url: null,
    });

    userCard2 = await fakeUserCardsRepository.create({
      userId: user.id,
      card: card2,
      billing_address: billing,
      paying_customer: customer,
      payment_method: 'credit_card',
      boleto_barcode: null,
      boleto_expiration_date: null,
      boleto_url: null,
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
      billing_address: billing,
      paying_customer: customer,
      payment_method: 'credit_card',
      boleto_barcode: null,
      boleto_expiration_date: null,
      boleto_url: null,
    });

    await updateMainUserCard.execute(user.id, newUserCard.foreign_id);

    expect(userCard1.isMain).toBe(false);
    expect(userCard2.isMain).toBe(false);
    expect(newUserCard.isMain).toBe(true);
  });
});
