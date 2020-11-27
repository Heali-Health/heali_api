import User from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import {
  IPagarmeBilling,
  IPagarmeCustomer,
} from '../dtos/ICreatePaymentLogDTO';
import { ICard } from '../dtos/ICreateUserCardDTO';
import FakeUserCardsRepository from '../repositories/fakes/FakeUserCardsRepository';
import CreateUserCardService from './CreateUserCardService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserCardsRepository: FakeUserCardsRepository;
let createUserCard: CreateUserCardService;

let user: User;
let card: ICard;
let customer: IPagarmeCustomer;
let billing: IPagarmeBilling;

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
  });

  it('should create a new user card given informed user id and card', async () => {
    const userCard = await createUserCard.execute({
      userId: user.id,
      card,
      paying_customer: customer,
      billing_address: billing,
    });

    expect(userCard).toHaveProperty('id');
  });

  it('should not create a new user card if a card with the same foreign id is informed', async () => {
    const userCard1 = await createUserCard.execute({
      userId: user.id,
      card,
      paying_customer: customer,
      billing_address: billing,
    });

    const userCard2 = await createUserCard.execute({
      userId: user.id,
      card,
      paying_customer: customer,
      billing_address: billing,
    });

    expect(userCard2.id).toEqual(userCard1.id);
  });
});
